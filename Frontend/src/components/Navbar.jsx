import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <span className="nav-logo">🏥</span>
        <span>KlinikBul</span>
      </Link>
      <div className="nav-links">
        <Link to="/" className={pathname === "/" ? "active" : ""}>Klinikler</Link>
        <Link to="/admin" className={pathname === "/admin" ? "active" : ""}>Admin Panel</Link>
      </div>
    </nav>
  );
}
