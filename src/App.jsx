import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin" element={<Admin />} />

          <Route
            path="*"
            element={
              <main className="page-container not-found">
                <span>🍽️</span>
                <h1>Страница не найдена</h1>
                <a href="/">Вернуться в меню</a>
              </main>
            }
          />
        </Routes>

        <footer className="footer">
          <div className="footer-logo">🍔 FoodOrder</div>
          <p>Вкусная еда — хорошее настроение.</p>
          <span>© 2026 FoodOrder. Учебный проект.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;