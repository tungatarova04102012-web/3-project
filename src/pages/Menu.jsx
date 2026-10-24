import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";
import FoodCard from "../components/FoodCard";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "foods"),
      (snapshot) => {
        const foodList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setFoods(foodList);
        setLoading(false);
      },
      (err) => {
        console.error("Ошибка загрузки меню:", err);
        setError("Не удалось загрузить меню. Проверь Firebase.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const addToCart = (food) => {
    setCart((previousCart) => {
      const existing = previousCart.find((item) => item.id === food.id);

      if (existing) {
        return previousCart.map((item) =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...food, quantity: 1 }];
    });
  };

  const changeQuantity = (id, amount) => {
    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Сначала добавь блюда в корзину!");
      return;
    }

    setOrdering(true);
    setError("");

    try {
      const orderItems = cart.map((item) => ({
        foodId: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        imageUrl: item.imageUrl || "",
      }));

      await addDoc(collection(db, "orders"), {
        items: orderItems,
        totalPrice,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setCart([]);
      alert("Заказ успешно оформлен!");
    } catch (err) {
      console.error("Ошибка оформления заказа:", err);
      setError("Не удалось оформить заказ. Проверь настройки Firebase.");
    } finally {
      setOrdering(false);
    }
  };

  return (
    <main className="page-container">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">🍽️ ВКУСНО. БЫСТРО. УДОБНО.</span>

          <h1>
            Твоя любимая еда
            <br />
            <span>уже ждёт тебя!</span>
          </h1>

          <p>
            Выбирай любимые блюда, добавляй их в корзину
            и оформляй заказ всего за пару кликов.
          </p>

          <a href="#food-menu" className="primary-button">
            Смотреть меню ↓
          </a>
        </div>

        <div className="hero-illustration" aria-hidden="true">
          🍔
          <span className="hero-fries">🍟</span>
          <span className="hero-drink">🥤</span>
          <span className="hero-sparkle sparkle-one">✦</span>
          <span className="hero-sparkle sparkle-two">✦</span>
        </div>
      </section>

      <div className="section-heading" id="food-menu">
        <div>
          <span className="eyebrow">НАШЕ МЕНЮ</span>
          <h2>Что будем кушать?</h2>
          <p>Выбирай что-нибудь вкусное из нашего меню.</p>
        </div>

        <div className="menu-count">
          🍴 {foods.length} блюд
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <span className="empty-icon">🍳</span>
          <h3>Загружаем меню...</h3>
          <p>Скоро здесь появятся вкусные блюда.</p>
        </div>
      ) : foods.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🍕</span>
          <h3>Пока нет блюд</h3>
          <p>
            Перейди в раздел «Добавить блюдо» и создай первое блюдо.
          </p>
        </div>
      ) : (
        <section className="food-grid">
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onAdd={addToCart}
            />
          ))}
        </section>
      )}

      <section className="cart-section">
        <div className="cart-heading">
          <div>
            <span className="eyebrow">ТВОЙ ЗАКАЗ</span>
            <h2>🛒 Корзина</h2>
          </div>

          <span className="cart-counter">{totalItems} шт.</span>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span>🛍️</span>
            <p>Корзина пока пустая. Самое время выбрать что-нибудь!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src =
                        "https://placehold.co/100x100?text=Food";
                    }}
                  />

                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <span>
                      {(
                        Number(item.price) * item.quantity
                      ).toLocaleString("ru-RU")}{" "}
                      сом
                    </span>
                  </div>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, -1)}
                      aria-label="Уменьшить количество"
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, 1)}
                      aria-label="Увеличить количество"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Общая сумма</span>
                <strong>
                  {totalPrice.toLocaleString("ru-RU")} сом
                </strong>
              </div>

              <button
                type="button"
                className="primary-button order-button"
                onClick={placeOrder}
                disabled={ordering}
              >
                {ordering ? "Оформляем..." : "Оформить заказ →"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default Menu;