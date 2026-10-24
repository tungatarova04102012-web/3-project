import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <NavLink to="/" className="logo">
        <span className="logo-icon">🍔</span>
        <span>Food<span className="logo-accent">Order</span></span>
      </NavLink>

      <nav className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Меню
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Заказы
        </NavLink>

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            isActive ? "nav-link active" : "nav-link"
          }
        >
          Добавить блюдо
        </NavLink>
      </nav>

      <div className="navbar-badge">Свежая еда каждый день</div>
    </header>
  );
}

export default Navbar;