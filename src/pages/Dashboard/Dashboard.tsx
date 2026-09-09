
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface JwtPayload {
  sub?: string;
  email?: string;
  unique_name?: string;
  name?: string;
  role?: string;

  // ASP.NET Core ClaimTypes.Name
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"?: string;

  // ASP.NET Core ClaimTypes.Role
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;

  exp?: number;
}

function decodeToken(token: string): JwtPayload | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];

    const decoded = atob(
      payload
        .replace(/-/g, "+")
        .replace(/_/g, "/")
    );

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function Dashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] =
    useState("Overview");

  const token =
    localStorage.getItem("projecthub_token") ||
    sessionStorage.getItem("projecthub_token");

  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    return decodeToken(token);
  }, [token]);

  /*
    ASP.NET Core creates ClaimTypes.Name.

    Depending on how the JWT is serialized,
    the name may appear as either:

    1. unique_name
    2. name
    3. the full ClaimTypes.Name URI

    We check all of them.
  */

  const userName =
    user?.unique_name ||
    user?.name ||
    user?.[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
    ] ||
    "ProjectHub User";

  const userEmail =
    user?.email ||
    "user@example.com";

  const userRole =
    user?.role ||
    user?.[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] ||
    "Buyer";

  const firstName =
    userName.split(" ")[0];

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem(
      "projecthub_token"
    );

    sessionStorage.removeItem(
      "projecthub_token"
    );

    navigate("/login");
  };

  if (!token || !user) {
    navigate("/login");

    return null;
  }

  return (
    <main className="dashboard-page">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <Link
          to="/"
          className="dashboard-brand"
        >
          <span className="dashboard-logo">
            P
          </span>

          <span className="dashboard-brand-text">
            Project<span>Hub</span>
          </span>
        </Link>

        <div className="sidebar-section">

          <span className="sidebar-label">
            WORKSPACE
          </span>

          <button
            className={`sidebar-link ${
              activeMenu === "Overview"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("Overview")
            }
          >
            <span>⌂</span>
            Overview
          </button>

          <Link
            to="/projects"
            className="sidebar-link"
          >
            <span>◈</span>
            Browse Projects
          </Link>

          <Link
            to="/requests"
            className="sidebar-link"
          >
            <span>◌</span>
            My Requests
          </Link>

          <button
            className={`sidebar-link ${
              activeMenu === "Orders"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("Orders")
            }
          >
            <span>▣</span>
            My Orders
          </button>

          <button
            className={`sidebar-link ${
              activeMenu === "Messages"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("Messages")
            }
          >
            <span>▱</span>
            Messages
            <small>2</small>
          </button>

        </div>

        <div className="sidebar-section">

          <span className="sidebar-label">
            ACCOUNT
          </span>

          <button
            className={`sidebar-link ${
              activeMenu === "Profile"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveMenu("Profile")
            }
          >
            <span>◎</span>
            Profile
          </button>

          <button
            className="sidebar-link"
            onClick={handleLogout}
          >
            <span>↪</span>
            Log out
          </button>

        </div>

        <div className="sidebar-bottom">

          <div className="sidebar-help">

            <div className="help-icon">
              ?
            </div>

            <div>
              <strong>
                Need help?
              </strong>

              <span>
                Visit our support center
              </span>
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}

      <section className="dashboard-main">

        {/* TOPBAR */}

        <header className="dashboard-topbar">

          <div className="dashboard-mobile-brand">

            <span className="dashboard-logo">
              P
            </span>

            <strong>
              Project<span>Hub</span>
            </strong>

          </div>

          <div className="dashboard-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search projects, requests..."
            />

            <kbd>
              /
            </kbd>

          </div>

          <div className="dashboard-top-actions">

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              ♧
              <span></span>
            </button>

            <div className="topbar-user">

              <div className="topbar-avatar">
                {userInitial}
              </div>

              <div className="topbar-user-info">

                <strong>
                  {userName}
                </strong>

                <span>
                  {userRole}
                </span>

              </div>

            </div>

          </div>

        </header>

        {/* CONTENT */}

        <div className="dashboard-content">

          {/* WELCOME */}

          <section className="dashboard-welcome">

            <div>

              <span className="dashboard-eyebrow">
                {userRole.toUpperCase()} DASHBOARD
              </span>

              <h1>
                Welcome back, {firstName} 
              </h1>

              <p>
                Here's what's happening with
                your ProjectHub account today.
              </p>

            </div>

            <div className="welcome-actions">

              <Link
                to="/projects"
                className="dashboard-primary-button"
              >
                Browse Projects
                <span>→</span>
              </Link>

              <Link
                to="/requests"
                className="dashboard-secondary-button"
              >
                Create Request
              </Link>

            </div>

          </section>

          {/* STATS */}

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon purple">
                ◈
              </div>

              <div>
                <span>
                  Saved Projects
                </span>

                <strong>
                  0
                </strong>
              </div>

              <small>
                +0 this month
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon blue">
                ▣
              </div>

              <div>
                <span>
                  Active Orders
                </span>

                <strong>
                  0
                </strong>
              </div>

              <small>
                No active orders
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon green">
                ◌
              </div>

              <div>
                <span>
                  Open Requests
                </span>

                <strong>
                  0
                </strong>
              </div>

              <small>
                Ready for proposals
              </small>

            </div>

            <div className="stat-card">

              <div className="stat-icon orange">
                ★
              </div>

              <div>
                <span>
                  Average Rating
                </span>

                <strong>
                  —
                </strong>
              </div>

              <small>
                No reviews yet
              </small>

            </div>

          </section>

          {/* QUICK ACTIONS */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span>
                  GET STARTED
                </span>

                <h2>
                  What would you like to do?
                </h2>

              </div>

            </div>

            <div className="quick-actions">

              <Link
                to="/projects"
                className="quick-action-card"
              >
                <div className="quick-action-icon purple">
                  ◈
                </div>

                <div>
                  <h3>
                    Find a Project
                  </h3>

                  <p>
                    Explore ready-made projects
                    from student developers.
                  </p>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </Link>

              <Link
                to="/requests"
                className="quick-action-card"
              >
                <div className="quick-action-icon blue">
                  +
                </div>

                <div>
                  <h3>
                    Post a Request
                  </h3>

                  <p>
                    Tell sellers exactly what
                    project you need.
                  </p>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </Link>

              <button
                className="quick-action-card"
                onClick={() =>
                  setActiveMenu("Profile")
                }
              >
                <div className="quick-action-icon green">
                  ◎
                </div>

                <div>
                  <h3>
                    Complete Profile
                  </h3>

                  <p>
                    Add your skills and academic
                    information.
                  </p>
                </div>

                <span className="quick-arrow">
                  →
                </span>
              </button>

            </div>

          </section>

          {/* RECENT ACTIVITY */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <span>
                  ACTIVITY
                </span>

                <h2>
                  Recent activity
                </h2>

              </div>

              <button>
                View all
              </button>

            </div>

            <div className="activity-card">

              <div className="empty-state">

                <div className="empty-icon">
                  ◌
                </div>

                <h3>
                  No activity yet
                </h3>

                <p>
                  Once you browse projects,
                  create requests or place an
                  order, your activity will
                  appear here.
                </p>

                <Link
                  to="/projects"
                  className="empty-action"
                >
                  Explore Projects →
                </Link>

              </div>

            </div>

          </section>

          {/* ACCOUNT */}

          <section className="account-preview">

            <div className="account-avatar-large">
              {userInitial}
            </div>

            <div className="account-preview-info">

              <span>
                SIGNED IN AS
              </span>

              <h3>
                {userName}
              </h3>

              <p>
                {userEmail}
              </p>

            </div>

            <div className="account-role">
              {userRole}
            </div>

          </section>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;

