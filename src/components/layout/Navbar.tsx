import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">
          <span className="logo-mark">P</span>
          <span className="logo-text">Project<span>Hub</span></span>
        </a>

        <nav className="navbar-links">
          <a href="#projects">Browse Projects</a>
          <a href="#requests">Requests</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="navbar-actions">
          <button className="btn-login">Log in</button>
          <button className="btn-primary">Get Started</button>
        </div>

        <button className="mobile-menu" aria-label="Open menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;