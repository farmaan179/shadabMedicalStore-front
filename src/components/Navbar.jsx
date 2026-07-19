import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-md sticky-top bg-cream border-bottom" style={{ borderColor: "var(--teal-soft)" }}>
      <div className="container">
        <Link to="/" className="navbar-brand"><Logo size={40} /></Link>

        <button className="navbar-toggler" type="button" onClick={() => setOpen(!open)}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
          <ul className="navbar-nav mx-auto gap-3 fw-medium">
            <li className="nav-item"><a className="nav-link text-teal-deep" href="/#home">Home</a></li>
            <li className="nav-item"><a className="nav-link text-teal-deep" href="/#products">Medicines</a></li>
            <li className="nav-item"><a className="nav-link text-teal-deep" href="/#contact">Contact</a></li>
            {user && <li className="nav-item"><Link className="nav-link text-teal-deep" to="/orders">My Orders</Link></li>}
            {user?.role === "admin" && <li className="nav-item"><Link className="nav-link text-teal-deep fw-bold" to="/admin">Admin</Link></li>}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
            <button onClick={() => navigate("/cart")} className="btn btn-light position-relative" aria-label="Cart">
              <ShoppingCart size={20} className="text-teal-deep" />
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">{totalItems}</span>
              )}
            </button>

            {user ? (
              <>
                <span className="text-teal-deep small">Hi, {user.name?.split(" ")[0]}</span>
                <button onClick={logout} className="btn btn-outline-teal btn-sm rounded-pill px-3">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="btn btn-outline-teal btn-sm rounded-pill px-3">Login</button>
                <button onClick={() => navigate("/signup")} className="btn btn-amber btn-sm rounded-pill px-3">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}