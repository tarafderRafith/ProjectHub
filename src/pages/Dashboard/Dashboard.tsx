import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Dashboard.css";

import {
  getCurrentUser,
  type CurrentUser,
} from "../../services/authService";

interface SellerProject {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string;
  course: string;
  university: string;
  price: number;
  deliveryDays: number;
  deliverables: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isApproved: boolean;
  sellerId: number;
  createdAt: string;
  updatedAt: string;
}

function Dashboard() {
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] =
    useState("Overview");

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [sellerProjects, setSellerProjects] =
    useState<SellerProject[]>([]);

  const [projectsLoading, setProjectsLoading] =
    useState(false);

  const [projectsError, setProjectsError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [, setError] =
    useState("");

  const [deletingProjectId, setDeletingProjectId] =
    useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSellerProjects = async () => {
      const token =
        localStorage.getItem(
          "projecthub_token"
        ) ||
        sessionStorage.getItem(
          "projecthub_token"
        );

      if (!token) {
        return;
      }

      try {
        setProjectsLoading(true);
        setProjectsError("");

        const response = await fetch(
          "http://localhost:5038/api/seller/projects",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const result:
          | SellerProject[]
          | { message?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "message" in result && result.message
              ? result.message
              : "Unable to load your projects."
          );
        }

        if (isMounted) {
          setSellerProjects(
            result as SellerProject[]
          );
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Failed to load seller projects:",
          error
        );

        setProjectsError(
          error instanceof Error
            ? error.message
            : "Unable to load your projects."
        );
      } finally {
        if (isMounted) {
          setProjectsLoading(false);
        }
      }
    };

    const loadUser = async () => {
      const token =
        localStorage.getItem(
          "projecthub_token"
        ) ||
        sessionStorage.getItem(
          "projecthub_token"
        );

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);

        const currentUser =
          await getCurrentUser();

        if (!isMounted) {
          return;
        }

        setUser(currentUser);
        setError("");

        if (
          currentUser.role.toLowerCase() ===
          "seller"
        ) {
          await loadSellerProjects();
        }
      } catch (error) {
        if (!isMounted) {
          return;
        }

        console.error(
          "Failed to load current user:",
          error
        );

        localStorage.removeItem(
          "projecthub_token"
        );

        sessionStorage.removeItem(
          "projecthub_token"
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your account."
        );

        navigate("/login");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const userName =
    user?.fullName ||
    "ProjectHub User";

  const userEmail =
    user?.email ||
    "user@example.com";

  const userRole =
    user?.role ||
    "Buyer";

  const firstName =
    userName.split(" ")[0];

  const userInitial =
    userName
      .charAt(0)
      .toUpperCase();

  const isSeller =
    userRole.toLowerCase() ===
    "seller";

  const handleLogout = () => {
    localStorage.removeItem(
      "projecthub_token"
    );

    sessionStorage.removeItem(
      "projecthub_token"
    );

    navigate("/login");
  };

  const handleDeleteProject = async (
    projectId: number,
    projectTitle: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectTitle}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem(
        "projecthub_token"
      ) ||
      sessionStorage.getItem(
        "projecthub_token"
      );

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setDeletingProjectId(projectId);

      const response = await fetch(
        `http://localhost:5038/api/Projects/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      let result:
        | { message?: string }
        | null = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
          "Unable to delete the project."
        );
      }

      setSellerProjects(
        (currentProjects) =>
          currentProjects.filter(
            (project) =>
              project.id !== projectId
          )
      );

      window.alert(
        "Project deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete project:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete the project."
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="dashboard-page">
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            Project
            <span style={{ color: "#7c3aed" }}>
              Hub
            </span>
          </div>

          <p
            style={{
              margin: 0,
              color: "#64748b",
            }}
          >
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="dashboard-page">

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

          <Link
            to="/profile"
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
          </Link>

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

      <section className="dashboard-main">

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

        <div className="dashboard-content">

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

          <section className="dashboard-stats">

            <div className="stat-card">

              <div className="stat-icon purple">
                ◈
              </div>

              <div>
                <span>
                  {isSeller
                    ? "My Projects"
                    : "Saved Projects"}
                </span>

                <strong>
                  {isSeller
                    ? sellerProjects.length
                    : "0"}
                </strong>
              </div>

              <small>
                {isSeller
                  ? "Projects you've listed"
                  : "+0 this month"}
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

          {isSeller && (
            <section className="dashboard-section">

              <div className="section-heading">

                <div>

                  <span>
                    SELLER WORKSPACE
                  </span>

                  <h2>
                    My Projects
                  </h2>

                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >

                  <Link
                    to="/projects"
                    className="dashboard-secondary-button"
                  >
                    Browse Marketplace
                  </Link>

                  <Link
                    to="/seller/projects/create"
                    className="dashboard-primary-button"
                  >
                    + Create Project
                  </Link>

                </div>

              </div>

              {projectsLoading ? (
                <div className="activity-card">

                  <div className="empty-state">

                    <div className="empty-icon">
                      ◌
                    </div>

                    <h3>
                      Loading your projects...
                    </h3>

                    <p>
                      Please wait while we load
                      your seller projects.
                    </p>

                  </div>

                </div>
              ) : projectsError ? (
                <div className="activity-card">

                  <div className="empty-state">

                    <div className="empty-icon">
                      !
                    </div>

                    <h3>
                      Unable to load projects
                    </h3>

                    <p>
                      {projectsError}
                    </p>

                  </div>

                </div>
              ) : sellerProjects.length === 0 ? (
                <div className="activity-card">

                  <div className="empty-state">

                    <div className="empty-icon">
                      ◈
                    </div>

                    <h3>
                      You haven't listed a project yet
                    </h3>

                    <p>
                      Once you create a project,
                      it will appear here for you
                      to manage.
                    </p>

                  </div>

                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {sellerProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        style={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius: "18px",
                          padding: "22px",
                          background: "#ffffff",
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap: "12px",
                            marginBottom:
                              "16px",
                          }}
                        >

                          <div>

                            <span
                              style={{
                                display:
                                  "inline-block",
                                fontSize:
                                  "12px",
                                fontWeight: 700,
                                color:
                                  "#7c3aed",
                                marginBottom:
                                  "8px",
                                textTransform:
                                  "uppercase",
                              }}
                            >
                              {project.category}
                            </span>

                            <h3
                              style={{
                                margin:
                                  "0 0 8px",
                                fontSize:
                                  "19px",
                                lineHeight:
                                  "1.35",
                                color:
                                  "#0f172a",
                              }}
                            >
                              {project.title}
                            </h3>

                          </div>

                          <span
                            style={{
                              flexShrink: 0,
                              fontSize:
                                "11px",
                              fontWeight: 700,
                              padding:
                                "6px 9px",
                              borderRadius:
                                "999px",
                              background:
                                project.isApproved
                                  ? "#dcfce7"
                                  : "#fef3c7",
                              color:
                                project.isApproved
                                  ? "#166534"
                                  : "#92400e",
                            }}
                          >
                            {project.isApproved
                              ? "Approved"
                              : "Pending"}
                          </span>

                        </div>

                        <p
                          style={{
                            margin:
                              "0 0 18px",
                            color:
                              "#64748b",
                            fontSize:
                              "14px",
                            lineHeight:
                              "1.6",
                            display:
                              "-webkit-box",
                            WebkitLineClamp:
                              3,
                            WebkitBoxOrient:
                              "vertical",
                            overflow:
                              "hidden",
                          }}
                        >
                          {project.description}
                        </p>

                        <div
                          style={{
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap:
                              "8px",
                            marginBottom:
                              "18px",
                          }}
                        >
                          {project.technologies
                            .split(",")
                            .map(
                              (
                                technology
                              ) => (
                                <span
                                  key={
                                    technology
                                  }
                                  style={{
                                    padding:
                                      "6px 9px",
                                    borderRadius:
                                      "8px",
                                    background:
                                      "#f1f5f9",
                                    color:
                                      "#475569",
                                    fontSize:
                                      "12px",
                                    fontWeight:
                                      600,
                                  }}
                                >
                                  {technology.trim()}
                                </span>
                              )
                            )}
                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "space-between",
                            gap:
                              "12px",
                            paddingTop:
                              "16px",
                            borderTop:
                              "1px solid #e2e8f0",
                          }}
                        >

                          <div>

                            <span
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "12px",
                                color:
                                  "#64748b",
                                marginBottom:
                                  "3px",
                              }}
                            >
                              Project price
                            </span>

                            <strong
                              style={{
                                fontSize:
                                  "21px",
                                color:
                                  "#0f172a",
                              }}
                            >
                              ৳
                              {project.price.toLocaleString()}
                            </strong>

                          </div>

                          <div
                            style={{
                              textAlign:
                                "right",
                            }}
                          >

                            <span
                              style={{
                                display:
                                  "block",
                                fontSize:
                                  "12px",
                                color:
                                  "#64748b",
                                marginBottom:
                                  "3px",
                              }}
                            >
                              Delivery
                            </span>

                            <strong
                              style={{
                                fontSize:
                                  "14px",
                                color:
                                  "#334155",
                              }}
                            >
                              {
                                project.deliveryDays
                              }{" "}
                              {project.deliveryDays ===
                              1
                                ? "day"
                                : "days"}
                            </strong>

                          </div>

                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "10px",
                            marginTop:
                              "18px",
                          }}
                        >

                          <Link
                            to={`/projects/${project.id}`}
                            className="dashboard-primary-button"
                            style={{
                              flex: 1,
                              justifyContent:
                                "center",
                              textDecoration:
                                "none",
                            }}
                          >
                            View
                          </Link>

                          <button
                            type="button"
                            className="dashboard-secondary-button"
                            style={{
                              flex: 1,
                              border:
                                "1px solid #e2e8f0",
                              cursor:
                                "pointer",
                            }}
                            onClick={() =>
                              navigate(
                                `/seller/projects/${project.id}/edit`
                              )
                            }
                          >
                            Edit
                          </button>

                        </div>

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            marginTop:
                              "14px",
                          }}
                        >

                          <span
                            style={{
                              fontSize:
                                "12px",
                              fontWeight:
                                600,
                              color:
                                project.isAvailable
                                  ? "#16a34a"
                                  : "#dc2626",
                            }}
                          >
                            ●{" "}
                            {project.isAvailable
                              ? "Available"
                              : "Unavailable"}
                          </span>

                          <button
                            type="button"
                            disabled={
                              deletingProjectId ===
                              project.id
                            }
                            style={{
                              border:
                                "none",
                              background:
                                "transparent",
                              color:
                                deletingProjectId ===
                                project.id
                                  ? "#94a3b8"
                                  : "#dc2626",
                              fontSize:
                                "12px",
                              fontWeight:
                                700,
                              cursor:
                                deletingProjectId ===
                                project.id
                                  ? "not-allowed"
                                  : "pointer",
                              padding:
                                "6px",
                            }}
                            onClick={() =>
                              handleDeleteProject(
                                project.id,
                                project.title
                              )
                            }
                          >
                            {deletingProjectId ===
                            project.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </div>
                    )
                  )}
                </div>
              )}

            </section>
          )}

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

              <Link
                to="/profile"
                className="quick-action-card"
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

              </Link>

            </div>

          </section>

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