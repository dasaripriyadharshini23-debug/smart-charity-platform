import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">❤</span>
        Smart<span>Charity</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/causes">Causes</Link>
        <Link to="/how-it-works">How It Works</Link>
        <Link to="/about">About</Link>

        {user?.role === "donor" && <Link to="/match">Smart Matching</Link>}
        {user && <Link to="/dashboard">Dashboard</Link>}
      </div>

      <div className="nav-buttons">
        {user ? (
          <>
            <span>{user.name}</span>
            <button className="login-btn" onClick={() => { logout(); navigate("/"); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="signup-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}