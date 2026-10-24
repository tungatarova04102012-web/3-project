import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ordersQuery = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const orderList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setOrders(orderList);
        setLoading(false);
      },
      (err) => {
        console.error("Ошибка загрузки заказов:", err);
        setError("Не удалось загрузить заказы. Проверь Firebase.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const completeOrder = async (orderId) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "completed",
      });
    } catch (err) {
      console.error("Ошибка обновления статуса:", err);
      alert("Не удалось изменить статус заказа.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "Ожидание даты...";
    }

    const date = timestamp.toDate
      ? timestamp.toDate()
      : new Date(timestamp);

    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="page-container inner-page">
      <section className="page-title">
        <span className="eyebrow">ИСТОРИЯ ПОКУПОК</span>
        <h1>Мои заказы 🧾</h1>
        <p>Все оформленные заказы собраны в одном месте.</p>
      </section>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <span className="empty-icon">⏳</span>
          <h3>Загружаем заказы...</h3>
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h3>Заказов пока нет</h3>
          <p>Оформи первый заказ на странице меню!</p>
        </div>
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div className="order-card-header">
                <div>
                  <span className="order-number">
                    Заказ #{order.id.slice(0, 7)}
                  </span>

                  <p className="order-date">
                    📅 {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`status ${
                    order.status === "completed"
                      ? "status-completed"
                      : "status-pending"
                  }`}
                >
                  {order.status === "completed"
                    ? "✓ Завершён"
                    : "◷ Ожидает"}
                </span>
              </div>

              <div className="order-products">
                {(order.items || []).map((item, index) => (
                  <div
                    className="order-product"
                    key={`${item.foodId || item.name}-${index}`}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                          "https://placehold.co/80x80?text=Food";
                      }}
                    />

                    <div>
                      <h4>{item.name}</h4>
                      <p>
                        {item.quantity} шт. ×{" "}
                        {Number(item.price).toLocaleString("ru-RU")} сом
                      </p>
                    </div>

                    <strong>
                      {(
                        Number(item.price) * Number(item.quantity)
                      ).toLocaleString("ru-RU")}{" "}
                      сом
                    </strong>
                  </div>
                ))}
              </div>

              <div className="order-card-footer">
                <div>
                  <span>Итого:</span>
                  <strong>
                    {Number(order.totalPrice || 0).toLocaleString("ru-RU")}{" "}
                    сом
                  </strong>
                </div>

                {order.status !== "completed" && (
                  <button
                    type="button"
                    className="complete-button"
                    onClick={() => completeOrder(order.id)}
                  >
                    Отметить завершённым
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Orders;