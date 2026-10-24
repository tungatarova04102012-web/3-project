import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const trimmedName = name.trim();
    const parsedPrice = Number(price);

    if (!trimmedName) {
      setError("Введи название блюда.");
      return;
    }

    if (price.trim() === "" || !Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setError("Цена должна быть числом больше нуля.");
      return;
    }

    let parsedImageUrl;

    try {
      parsedImageUrl = new URL(imageUrl.trim());

      if (
        !["http:", "https:"].includes(parsedImageUrl.protocol)
      ) {
        throw new Error("Invalid protocol");
      }
    } catch {
      setError("Введи корректную ссылку на изображение, начинающуюся с https://.");
      return;
    }

    setSaving(true);

    try {
      await addDoc(collection(db, "foods"), {
        name: trimmedName,
        price: parsedPrice,
        imageUrl: parsedImageUrl.href,
        createdAt: serverTimestamp(),
      });

      setName("");
      setPrice("");
      setImageUrl("");
      setMessage("🎉 Блюдо успешно добавлено в меню!");
    } catch (err) {
      console.error("Ошибка добавления блюда:", err);
      setError("Не удалось добавить блюдо. Проверь Firebase и правила доступа.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="page-container inner-page">
      <section className="page-title">
        <span className="eyebrow">УПРАВЛЕНИЕ МЕНЮ</span>
        <h1>Добавить блюдо 🍕</h1>
        <p>
          Заполни форму, чтобы новое блюдо появилось в меню.
        </p>
      </section>

      <section className="admin-layout">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-heading">
            <span className="form-icon">🍳</span>
            <h2>Новое блюдо</h2>
            <p>Заполни все поля формы.</p>
          </div>

          <label htmlFor="food-name">Название блюда</label>

          <input
            id="food-name"
            type="text"
            placeholder="Например, чизбургер"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
          />

          <label htmlFor="food-price">Цена (сом)</label>

          <input
            id="food-price"
            type="number"
            placeholder="Например, 350"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            min="0.01"
            step="0.01"
            required
          />

          <label htmlFor="food-image">Ссылка на изображение</label>

          <input
            id="food-image"
            type="url"
            placeholder="https://example.com/food.jpg"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            required
          />

          <p className="form-hint">
            💡 Вставь прямую ссылку на картинку. Файл загружать не нужно.
          </p>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            className="primary-button submit-button"
            disabled={saving}
          >
            {saving ? "Сохраняем..." : "+ Добавить блюдо"}
          </button>
        </form>

        <aside className="preview-panel">
          <span className="eyebrow">ПРЕДПРОСМОТР</span>
          <h3>Так будет выглядеть блюдо</h3>

          <div className="preview-card">
            <div className="preview-image">
              {imageUrl.trim() ? (
                <img
                  src={imageUrl}
                  alt="Предпросмотр блюда"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              ) : (
                <span>🍔</span>
              )}
            </div>

            <div className="preview-info">
              <h4>{name.trim() || "Название блюда"}</h4>
              <strong>
                {price && Number(price) > 0
                  ? `${Number(price).toLocaleString("ru-RU")} сом`
                  : "0 сом"}
              </strong>
            </div>
          </div>

          <div className="preview-tip">
            <span>✨</span>
            <p>
              После сохранения блюдо автоматически появится на странице меню.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Admin;