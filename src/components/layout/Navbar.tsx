
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";

import {
  getCurrentUser,
  type CurrentUser,
} from "../../services/authService";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [isLoadingUser, setIsLoadingUser] =
    useState(true);

  const getToken = () => {
    return (
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token")
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const token = getToken();

      if (!token) {
        if (isMounted) {
          setUser(null);
          setIsLoadingUser(false);
        }

        return;
      }

      try {
        const currentUser =
          await getCurrentUser();

        if (isMounted) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error(
          "Failed to load navbar user:",
          error
        );

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoadingUser(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "projecthub_token"
    );

    sessionStorage.removeItem(
      "projecthub_token"
    );

    setUser(null);

    navigate("/login");
  };

  const userName =
    user?.fullName ||
    user?.username ||
    "User";

  const firstName =
    userName.split(" ")[0];

  const userInitial =
    userName.charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
        >
          <span className="logo-mark">
            P
          </span>

          <span className="logo-text">
            Project<span>Hub</span>
          </span>
        </Link>

        {/* MAIN NAVIGATION */}

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

          {user && (
            <>
              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/messages">
                Messages
              </Link>
            </>
          )}

        </nav>

        {/* ACTIONS */}

        <div className="navbar-actions">

          {isLoadingUser ? (
            <>
              <span
                className="btn-login"
                style={{
                  opacity: 0.5,
                  cursor: "default",
                }}
              >
                ...
              </span>
            </>
          ) : user ? (
            <>
              {/* USER NAME */}

              <Link
                to="/profile"
                className="btn-login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "linear-gradient(135deg, #7c3aed, #2563eb)",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {userInitial}
                </span>

                <span>
                  {firstName}
                </span>
              </Link>

              {/* LOGOUT */}

              <button
                type="button"
                className="btn-primary"
                onClick={handleLogout}
                style={{
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
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
            </>
          )}

        </div>

        {/* MOBILE MENU */}

        <button
          type="button"
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

