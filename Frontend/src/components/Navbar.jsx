import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useApp();
  const is = (path) => pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-logo">🌍</span>
        <span className="nav-brand-text">Medtravio</span>
      </Link>

      <div className="nav-links">
        <Link to="/clinics" className={is("/clinics") ? "active" : ""}>Klinikler</Link>
        <Link to="/blog"    className={is("/blog")    ? "active" : ""}>Rehber</Link>
        <Link to="/onboarding" className="nav-ai-btn">🤖 AI ile Eşleş</Link>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="nav-user-menu">
            <button className="nav-user-btn">
              <div className="nav-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <span>{user.name}</span>
            </button>
            <div className="nav-dropdown">
              {user.role === "admin"  && <Link to="/admin">🛡️ Admin Panel</Link>}
              {user.role === "clinic" && <Link to="/clinic-panel/1">🏥 Klinik Panel</Link>}
              <Link to="/panel">👤 Profilim</Link>
              <button onClick={() => { logout(); navigate("/"); }}>Çıkış Yap</button>
            </div>
          </div>
        ) : (
          <div className="nav-auth">
            <Link to="/login" className="nav-login-btn">Giriş Yap</Link>
            <Link to="/register" className="nav-register-btn">Üye Ol</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
