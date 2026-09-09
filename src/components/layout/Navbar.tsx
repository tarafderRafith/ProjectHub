import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-mark">P</span>

          <span className="logo-text">
            Project<span>Hub</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <Link to="/projects">
            Browse Projects
          </Link>

          <Link to="/requests">
            Requests
          </Link>

          <a href="/#how-it-works">
            How It Works
          </a>
        </nav>

        <div className="navbar-actions">

          <Link
            to="/login"
            className="btn-login"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="btn-primary"
          >
            Get Started
          </Link>

        </div>

        <button
          className="mobile-menu"
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </header>
  );
}

export default Navbar;