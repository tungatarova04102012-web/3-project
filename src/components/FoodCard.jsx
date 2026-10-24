function FoodCard({ food, onAdd }) {
  return (
    <article className="food-card">
      <div className="food-image-wrap">
        <img
          src={food.imageUrl}
          alt={food.name}
          className="food-image"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://placehold.co/600x400?text=Food";
          }}
        />

        <span className="food-tag">Популярное</span>
      </div>

      <div className="food-info">
        <h3>{food.name}</h3>

        <div className="food-bottom">
          <div className="food-price">
            {Number(food.price).toLocaleString("ru-RU")} сом
          </div>

          <button
            type="button"
            className="add-button"
            onClick={() => onAdd(food)}
            aria-label={`Добавить ${food.name} в корзину`}
          >
            + Добавить
          </button>
        </div>
      </div>
    </article>
  );
}

export default FoodCard;