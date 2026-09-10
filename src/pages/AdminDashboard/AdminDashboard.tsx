import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import AdminProjectApproval from "../../components/admin/AdminProjectApproval";

interface PendingPayment {
  id: number;
  orderId: number;
  projectId: number;
  projectTitle: string;
  buyerName: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  submittedAt: string | null;
}

interface AdminProject {
  id: number;
  title: string;
  description?: string;
  category?: string;
  technologies?: string;
  course?: string;
  university?: string;
  price?: number;
  deliveryDays?: number;
  deliverables?: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
  isApproved?: boolean;
  sellerId?: number;
  sellerName?: string;
  sellerUsername?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  contactNumber: string;
  role: string;
  university: string;
  department: string;
  studentId: string | null;
  semester: string;
  graduationYear: number;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const API_URL = "http://localhost:5038/api";
const USERS_PER_PAGE = 10;

function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingPayments, setPendingPayments] =
    useState<PendingPayment[]>([]);

  const [projects, setProjects] =
    useState<AdminProject[]>([]);

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [userSearch, setUserSearch] =
    useState("");

  const [userFilter, setUserFilter] =
    useState("all");

  const [currentUserPage, setCurrentUserPage] =
    useState(1);

  const [expandedUserId, setExpandedUserId] =
    useState<number | null>(null);

  const getToken = () => {
    return (
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token")
    );
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        paymentsResponse,
        projectsResponse,
        usersResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/admin/payments/pending`,
          {
            headers,
          }
        ),

        fetch(
          `${API_URL}/admin/projects`,
          {
            headers,
          }
        ),

        fetch(
          `${API_URL}/admin/users`,
          {
            headers,
          }
        ),
      ]);

      if (
        paymentsResponse.status === 401 ||
        projectsResponse.status === 401 ||
        usersResponse.status === 401
      ) {
        sessionStorage.removeItem(
          "projecthub_token"
        );

        localStorage.removeItem(
          "projecthub_token"
        );

        navigate("/login");
        return;
      }

      if (
        paymentsResponse.status === 403 ||
        projectsResponse.status === 403 ||
        usersResponse.status === 403
      ) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
        return;
      }

      const paymentsData =
        await paymentsResponse.json();

      const projectsData =
        await projectsResponse.json();

      const usersData =
        await usersResponse.json();

      if (!paymentsResponse.ok) {
        throw new Error(
          paymentsData.message ||
            "Unable to load payments."
        );
      }

      if (!projectsResponse.ok) {
        throw new Error(
          projectsData.message ||
            "Unable to load projects."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message ||
            "Unable to load users."
        );
      }

      setPendingPayments(
        Array.isArray(paymentsData)
          ? paymentsData
          : []
      );

      setProjects(
        Array.isArray(projectsData)
          ? projectsData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalProjects =
    projects.length;

  const pendingProjects =
    projects.filter(
      (project) =>
        project.isApproved === false
    );

  const approvedProjects =
    projects.filter(
      (project) =>
        project.isApproved === true
    );

  const unavailableProjects =
    projects.filter(
      (project) =>
        project.isAvailable === false
    );

  const verifiedUsers =
    users.filter(
      (user) =>
        user.isVerified
    );

  const unverifiedUsers =
    users.filter(
      (user) =>
        !user.isVerified &&
        user.role.toLowerCase() !==
          "admin"
    );

  const activeUsers =
    users.filter(
      (user) =>
        user.isActive
    );

  

  const buyers =
    users.filter(
      (user) =>
        user.role.toLowerCase() ===
        "buyer"
    );

  const sellers =
    users.filter(
      (user) =>
        user.role.toLowerCase() ===
        "seller"
    );

  const filteredUsers = useMemo(() => {
    const search =
      userSearch
        .trim()
        .toLowerCase();

    return users.filter(
      (user) => {
        const matchesSearch =
          !search ||
          user.fullName
            .toLowerCase()
            .includes(search) ||
          user.username
            .toLowerCase()
            .includes(search) ||
          user.email
            .toLowerCase()
            .includes(search) ||
          (user.studentId || "")
            .toLowerCase()
            .includes(search);

        const matchesFilter =
          userFilter === "all" ||
          (userFilter === "verified" &&
            user.isVerified) ||
          (userFilter === "unverified" &&
            !user.isVerified &&
            user.role.toLowerCase() !==
              "admin") ||
          (userFilter === "active" &&
            user.isActive) ||
          (userFilter === "inactive" &&
            !user.isActive) ||
          (userFilter === "buyer" &&
            user.role.toLowerCase() ===
              "buyer") ||
          (userFilter === "seller" &&
            user.role.toLowerCase() ===
              "seller");

        return (
          matchesSearch &&
          matchesFilter
        );
      }
    );
  }, [
    users,
    userSearch,
    userFilter,
  ]);

  const totalUserPages =
    Math.max(
      1,
      Math.ceil(
        filteredUsers.length /
          USERS_PER_PAGE
      )
    );

  const paginatedUsers =
    filteredUsers.slice(
      (currentUserPage - 1) *
        USERS_PER_PAGE,
      currentUserPage *
        USERS_PER_PAGE
    );

  const userStart =
    filteredUsers.length === 0
      ? 0
      : (currentUserPage - 1) *
          USERS_PER_PAGE +
        1;

  const userEnd =
    Math.min(
      currentUserPage *
        USERS_PER_PAGE,
      filteredUsers.length
    );

  const getPageNumbers = () => {
    const pages: (
      | number
      | string
    )[] = [];

    if (totalUserPages <= 7) {
      for (
        let i = 1;
        i <= totalUserPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (currentUserPage > 3) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      currentUserPage - 1
    );

    const end = Math.min(
      totalUserPages - 1,
      currentUserPage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      currentUserPage <
      totalUserPages - 2
    ) {
      pages.push("...");
    }

    pages.push(totalUserPages);

    return pages;
  };

  useEffect(() => {
    setCurrentUserPage(1);
  }, [userSearch, userFilter]);

  useEffect(() => {
    if (
      currentUserPage >
      totalUserPages
    ) {
      setCurrentUserPage(
        totalUserPages
      );
    }
  }, [
    currentUserPage,
    totalUserPages,
  ]);

  const handleUserAction = async (
    userId: number,
    action:
      | "verify"
      | "unverify"
      | "toggle-status"
  ) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const user = users.find(
        (item) =>
          item.id === userId
      );

      if (!user) {
        return;
      }

      if (
        action ===
        "toggle-status"
      ) {
        const confirmed =
          window.confirm(
            user.isActive
              ? `Are you sure you want to deactivate ${user.fullName}?`
              : `Activate ${user.fullName}'s account?`
          );

        if (!confirmed) {
          return;
        }
      }

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update user."
        );
      }

      await loadDashboard();

      setExpandedUserId(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user."
      );
    }
  };

  const toggleUserDetails = (
    userId: number
  ) => {
    setExpandedUserId(
      expandedUserId === userId
        ? null
        : userId
    );
  };

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getInitials = (
    name: string
  ) => {
    return name
      .split(" ")
      .map(
        (part) =>
          part.charAt(0)
      )
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="admin-page">

        <aside className="admin-sidebar">

          <div className="admin-brand">
            <span>
              PROJECT
            </span>
            HUB
          </div>

          <div className="admin-sidebar-loading">
            Loading...
          </div>

        </aside>

        <main className="admin-main">

          <div className="admin-loading-screen">

            <div className="admin-loader"></div>

            <p>
              Loading admin
              control center...
            </p>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="admin-page">

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="admin-sidebar">

        <div className="admin-brand">
          <span>
            PROJECT
          </span>
          HUB
        </div>

        <div className="admin-sidebar-badge">
          ADMIN CONTROL
        </div>

        <nav className="admin-nav">

          <a
            href="#admin-overview"
            className="admin-nav-item active"
          >
            <span className="admin-nav-icon">
              ◈
            </span>

            <span>
              Overview
            </span>
          </a>

          <a
            href="#admin-payments"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              $
            </span>

            <span>
              Payments
            </span>

            {pendingPayments.length >
              0 && (
              <span className="admin-nav-count">
                {pendingPayments.length}
              </span>
            )}
          </a>

          <a
            href="#admin-project-overview"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              □
            </span>

            <span>
              Projects
            </span>

            {pendingProjects.length >
              0 && (
              <span className="admin-nav-count">
                {pendingProjects.length}
              </span>
            )}
          </a>

          <a
            href="#admin-orders"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ≡
            </span>

            <span>
              Orders
            </span>

            <span className="admin-nav-soon">
              SOON
            </span>
          </a>

          <a
            href="#admin-users"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ◎
            </span>

            <span>
              Users
            </span>
          </a>

          <a
            href="#admin-disputes"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              !
            </span>

            <span>
              Disputes
            </span>

            <span className="admin-nav-soon">
              SOON
            </span>
          </a>

        </nav>

        <div className="admin-sidebar-bottom">

          <Link
            to="/"
            className="admin-back-link"
          >
            ← Marketplace
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={() => {
              sessionStorage.removeItem(
                "projecthub_token"
              );

              localStorage.removeItem(
                "projecthub_token"
              );

              navigate("/login");
            }}
          >
            Sign Out
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================== */}

      <main className="admin-main">

        {/* HEADER */}

        <header className="admin-header">

          <div>

            <span className="admin-eyebrow">
              PROJECTHUB / ADMIN
            </span>

            <h1>
              Control Center
            </h1>

            <p>
              Manage marketplace activity,
              members, projects and payments
              from one place.
            </p>

          </div>

          <div className="admin-header-actions">

            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadDashboard}
            >
              ↻ Refresh
            </button>

            <div className="admin-status-indicator">
              <span></span>
              System Online
            </div>

          </div>

        </header>

        {error && (
          <div className="admin-error">

            <strong>
              Error
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                setError("")
              }
            >
              ×
            </button>

          </div>
        )}

        {/* =========================
            OVERVIEW
        ========================== */}

        <section
          className="admin-section"
          id="admin-overview"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                SYSTEM OVERVIEW
              </span>

              <h2>
                Marketplace Snapshot
              </h2>

            </div>

            <span className="admin-live-label">
              LIVE DATA
            </span>

          </div>

          <div className="admin-stats-grid">

            <div className="admin-stat-card">

              <div className="admin-stat-top">
                <span>
                  USERS
                </span>

                <span className="admin-stat-icon">
                  ◎
                </span>
              </div>

              <strong>
                {users.length}
              </strong>

              <p>
                Registered members
              </p>

            </div>

            <div className="admin-stat-card">

              <div className="admin-stat-top">
                <span>
                  PROJECTS
                </span>

                <span className="admin-stat-icon">
                  □
                </span>
              </div>

              <strong>
                {totalProjects}
              </strong>

              <p>
                Marketplace listings
              </p>

            </div>

            <div className="admin-stat-card warning">

              <div className="admin-stat-top">
                <span>
                  PAYMENTS
                </span>

                <span className="admin-stat-icon">
                  $
                </span>
              </div>

              <strong>
                {pendingPayments.length}
              </strong>

              <p>
                Waiting for verification
              </p>

            </div>

            <div className="admin-stat-card danger">

              <div className="admin-stat-top">
                <span>
                  PROJECT REVIEW
                </span>

                <span className="admin-stat-icon">
                  !
                </span>
              </div>

              <strong>
                {pendingProjects.length}
              </strong>

              <p>
                Projects awaiting approval
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            COMMUNITY OVERVIEW
        ========================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                COMMUNITY
              </span>

              <h2>
                Member Overview
              </h2>

            </div>

          </div>

          <div className="admin-community-grid">

            <div className="admin-community-card">

              <div className="admin-community-number">
                {activeUsers.length}
              </div>

              <div>
                <strong>
                  Active Members
                </strong>

                <span>
                  Currently active accounts
                </span>
              </div>

            </div>

            <div className="admin-community-card">

              <div className="admin-community-number">
                {verifiedUsers.length}
              </div>

              <div>
                <strong>
                  Verified
                </strong>

                <span>
                  Approved member accounts
                </span>
              </div>

            </div>

            <div className="admin-community-card">

              <div className="admin-community-number">
                {sellers.length}
              </div>

              <div>
                <strong>
                  Sellers
                </strong>

                <span>
                  Members offering projects
                </span>
              </div>

            </div>

            <div className="admin-community-card">

              <div className="admin-community-number">
                {buyers.length}
              </div>

              <div>
                <strong>
                  Buyers
                </strong>

                <span>
                  Members purchasing projects
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* =========================
            ADMIN ATTENTION
        ========================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                ATTENTION REQUIRED
              </span>

              <h2>
                Admin Queue
              </h2>

            </div>

          </div>

          <div className="admin-attention-grid">

            <a
              href="#admin-project-overview"
              className="admin-attention-card"
            >

              <div className="admin-attention-icon project">
                □
              </div>

              <div>

                <span>
                  PROJECTS
                </span>

                <strong>
                  {pendingProjects.length}
                </strong>

                <p>
                  Need approval
                </p>

              </div>

              <span className="admin-attention-arrow">
                →
              </span>

            </a>

            <a
              href="#admin-payments"
              className="admin-attention-card"
            >

              <div className="admin-attention-icon payment">
                $
              </div>

              <div>

                <span>
                  PAYMENTS
                </span>

                <strong>
                  {pendingPayments.length}
                </strong>

                <p>
                  Need verification
                </p>

              </div>

              <span className="admin-attention-arrow">
                →
              </span>

            </a>

            <a
              href="#admin-users"
              className="admin-attention-card"
            >

              <div className="admin-attention-icon user">
                ◎
              </div>

              <div>

                <span>
                  USERS
                </span>

                <strong>
                  {unverifiedUsers.length}
                </strong>

                <p>
                  Need verification
                </p>

              </div>

              <span className="admin-attention-arrow">
                →
              </span>

            </a>

            <div
              className="admin-attention-card disabled"
              id="admin-disputes"
            >

              <div className="admin-attention-icon dispute">
                !
              </div>

              <div>

                <span>
                  DISPUTES
                </span>

                <strong>
                  —
                </strong>

                <p>
                  Coming soon
                </p>

              </div>

              <span className="admin-attention-arrow">
                →
              </span>

            </div>

          </div>

        </section>

        {/* =========================
            PROJECT OVERVIEW
        ========================== */}

        <section
          className="admin-operation-section"
          id="admin-project-overview"
        >

          <div className="admin-section-header compact">

            <div>

              <span className="admin-section-label">
                MARKETPLACE
              </span>

              <h2>
                Project Overview
              </h2>

              <p>
                Current status of seller
                project listings and
                marketplace moderation.
              </p>

            </div>

          </div>

          <div className="admin-operation-grid">

            <div className="admin-operation-card">

              <span className="operation-number">
                {totalProjects}
              </span>

              <div>

                <strong>
                  Total Projects
                </strong>

                <small>
                  All submitted listings
                </small>

              </div>

            </div>

            <div className="admin-operation-card pending">

              <span className="operation-number">
                {pendingProjects.length}
              </span>

              <div>

                <strong>
                  Pending Review
                </strong>

                <small>
                  Awaiting admin approval
                </small>

              </div>

            </div>

            <div className="admin-operation-card approved">

              <span className="operation-number">
                {approvedProjects.length}
              </span>

              <div>

                <strong>
                  Approved
                </strong>

                <small>
                  Approved project listings
                </small>

              </div>

            </div>

            <div className="admin-operation-card hidden">

              <span className="operation-number">
                {unavailableProjects.length}
              </span>

              <div>

                <strong>
                  Hidden
                </strong>

                <small>
                  Currently unavailable
                </small>

              </div>

            </div>

          </div>

          {/* PROJECT APPROVAL CENTER */}

          <AdminProjectApproval
            projects={projects}
            onRefresh={loadDashboard}
          />

        </section>

        {/* =========================
            PAYMENTS
        ========================== */}

        <section
          className="admin-section"
          id="admin-payments"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                FINANCIAL CONTROL
              </span>

              <h2>
                Recent Pending Payments
              </h2>

            </div>

            <Link
              to="/admin"
              className="admin-section-link"
            >
              Payment Center →
            </Link>

          </div>

          {pendingPayments.length ===
          0 ? (

            <div className="admin-empty-card">

              <div className="admin-empty-icon">
                ✓
              </div>

              <strong>
                No pending payments
              </strong>

              <p>
                All submitted payments have
                been reviewed.
              </p>

            </div>

          ) : (

            <div className="admin-payment-list">

              {pendingPayments
                .slice(0, 5)
                .map(
                  (payment) => (
                    <div
                      className="admin-payment-row"
                      key={payment.id}
                    >

                      <div className="admin-payment-id">
                        #{payment.id}
                      </div>

                      <div className="admin-payment-info">

                        <strong>
                          {payment.projectTitle}
                        </strong>

                        <span>
                          Order #{payment.orderId}
                          {" · "}
                          {payment.buyerName}
                        </span>

                      </div>

                      <div className="admin-payment-method">

                        <span>
                          METHOD
                        </span>

                        <strong>
                          {payment.paymentMethod}
                        </strong>

                      </div>

                      <div className="admin-payment-amount">

                        <span>
                          AMOUNT
                        </span>

                        <strong>
                          ৳
                          {payment.amount.toLocaleString()}
                        </strong>

                      </div>

                      <div className="admin-payment-status">
                        Pending
                      </div>

                    </div>
                  )
                )}

            </div>

          )}

        </section>

        {/* =========================
            USERS
        ========================== */}

        <section
          className="admin-section"
          id="admin-users"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                COMMUNITY MANAGEMENT
              </span>

              <h2>
                User & Verification
              </h2>

              <p>
                Search, review and manage
                ProjectHub members.
              </p>

            </div>

            <div className="admin-user-header-stats">

              <span>
                {users.length} total
              </span>

              <span>
                {verifiedUsers.length} verified
              </span>

            </div>

          </div>

          {/* SEARCH + FILTER */}

          <div className="admin-user-toolbar">

            <div className="admin-user-search-area">

              <div className="admin-user-search">

                <span className="admin-search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  value={userSearch}
                  onChange={(event) =>
                    setUserSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search name, username, email or student ID..."
                />

                {userSearch && (
                  <button
                    type="button"
                    className="admin-search-clear"
                    onClick={() =>
                      setUserSearch("")
                    }
                  >
                    ×
                  </button>
                )}

              </div>

            </div>

            <div className="admin-user-filter">

              <select
                value={userFilter}
                onChange={(event) =>
                  setUserFilter(
                    event.target.value
                  )
                }
              >
                <option value="all">
                  All Members
                </option>

                <option value="unverified">
                  Unverified
                </option>

                <option value="verified">
                  Verified
                </option>

                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>

                <option value="buyer">
                  Buyers
                </option>

                <option value="seller">
                  Sellers
                </option>
              </select>

            </div>

          </div>

          {/* RESULT BAR */}

          <div className="admin-user-result-bar">

            <div className="admin-user-summary">

              <span>
                Showing
              </span>

              <strong>
                {userStart}–{userEnd}
              </strong>

              <span>
                of
              </span>

              <strong>
                {filteredUsers.length}
              </strong>

              <span>
                members
              </span>

            </div>

            {(userSearch ||
              userFilter !==
                "all") && (
              <button
                type="button"
                className="admin-clear-filter-button"
                onClick={() => {
                  setUserSearch("");
                  setUserFilter("all");
                }}
              >
                Clear filters
              </button>
            )}

          </div>

          {/* USER LIST */}

          {paginatedUsers.length ===
          0 ? (

            <div className="admin-empty-card">

              <div className="admin-empty-icon">
                ⌕
              </div>

              <strong>
                No members found
              </strong>

              <p>
                Try changing your search or
                filter.
              </p>

            </div>

          ) : (

            <div className="admin-user-list">

              {paginatedUsers.map(
                (user) => {

                  const isExpanded =
                    expandedUserId ===
                    user.id;

                  const isAdmin =
                    user.role.toLowerCase() ===
                    "admin";

                  return (
                    <div
                      key={user.id}
                      className={
                        isExpanded
                          ? "admin-user-card expanded"
                          : "admin-user-card"
                      }
                    >

                      {/* COMPACT ROW */}

                      <div className="admin-user-main">

                        <div className="admin-user-avatar">
                          {getInitials(
                            user.fullName
                          )}
                        </div>

                        <div className="admin-user-identity">

                          <strong>
                            {user.fullName}
                          </strong>

                          <span>
                            @{user.username}
                          </span>

                        </div>

                        <div className="admin-user-role">

                          <span>
                            ROLE
                          </span>

                          <strong>
                            {user.role}
                          </strong>

                        </div>

                        <div className="admin-user-university">

                          <span>
                            UNIVERSITY
                          </span>

                          <strong>
                            {user.university ||
                              "—"}
                          </strong>

                        </div>

                        <div className="admin-user-status">

                          {isAdmin ? (

                            <span className="admin-user-badge admin">
                              ADMIN
                            </span>

                          ) : user.isVerified ? (

                            <span className="admin-user-badge verified">
                              ✓ VERIFIED
                            </span>

                          ) : (

                            <span className="admin-user-badge unverified">
                              UNVERIFIED
                            </span>

                          )}

                          {!user.isActive &&
                            !isAdmin && (
                            <span className="admin-user-badge inactive">
                              INACTIVE
                            </span>
                          )}

                        </div>

                        <button
                          type="button"
                          className="admin-user-details-button"
                          onClick={() =>
                            toggleUserDetails(
                              user.id
                            )
                          }
                        >
                          {isExpanded
                            ? "Hide Details ↑"
                            : "View Details ↓"}
                        </button>

                      </div>

                      {/* EXPANDED DETAILS */}

                      {isExpanded && (

                        <div className="admin-user-expanded">

                          <div className="admin-user-expanded-grid">

                            <div className="admin-user-expanded-item">

                              <span>
                                EMAIL
                              </span>

                              <strong>
                                {user.email ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                CONTACT
                              </span>

                              <strong>
                                {user.contactNumber ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                STUDENT ID
                              </span>

                              <strong>
                                {user.studentId ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                DEPARTMENT
                              </span>

                              <strong>
                                {user.department ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                SEMESTER
                              </span>

                              <strong>
                                {user.semester ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                GRADUATION YEAR
                              </span>

                              <strong>
                                {user.graduationYear ||
                                  "—"}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                JOINED
                              </span>

                              <strong>
                                {formatDate(
                                  user.createdAt
                                )}
                              </strong>

                            </div>

                            <div className="admin-user-expanded-item">

                              <span>
                                LAST UPDATED
                              </span>

                              <strong>
                                {formatDate(
                                  user.updatedAt
                                )}
                              </strong>

                            </div>

                          </div>

                          {!isAdmin && (

                            <div className="admin-user-expanded-actions">

                              <div>

                                <span>
                                  ACCOUNT STATUS
                                </span>

                                <p>
                                  {user.isActive
                                    ? "This account is currently active."
                                    : "This account is currently inactive."}
                                </p>

                              </div>

                              <div className="admin-user-action-buttons">

                                {user.isVerified ? (

                                  <button
                                    type="button"
                                    className="admin-user-action unverify"
                                    onClick={() =>
                                      handleUserAction(
                                        user.id,
                                        "unverify"
                                      )
                                    }
                                  >
                                    Remove Verification
                                  </button>

                                ) : (

                                  <button
                                    type="button"
                                    className="admin-user-action verify"
                                    disabled={
                                      !user.isActive
                                    }
                                    onClick={() =>
                                      handleUserAction(
                                        user.id,
                                        "verify"
                                      )
                                    }
                                  >
                                    ✓ Verify Member
                                  </button>

                                )}

                                <button
                                  type="button"
                                  className={
                                    user.isActive
                                      ? "admin-user-action deactivate"
                                      : "admin-user-action activate"
                                  }
                                  onClick={() =>
                                    handleUserAction(
                                      user.id,
                                      "toggle-status"
                                    )
                                  }
                                >
                                  {user.isActive
                                    ? "Deactivate Account"
                                    : "Activate Account"}
                                </button>

                              </div>

                            </div>

                          )}

                        </div>

                      )}

                    </div>
                  );
                }
              )}

            </div>

          )}

          {/* PAGINATION */}

          {filteredUsers.length >
            USERS_PER_PAGE && (

            <div className="admin-user-pagination">

              <button
                type="button"
                className="admin-page-button previous"
                disabled={
                  currentUserPage === 1
                }
                onClick={() =>
                  setCurrentUserPage(
                    (page) =>
                      Math.max(
                        1,
                        page - 1
                      )
                  )
                }
              >
                ← Previous
              </button>

              <div className="admin-page-numbers">

                {getPageNumbers().map(
                  (page, index) =>
                    page === "..." ? (

                      <span
                        key={`ellipsis-${index}`}
                        className="admin-page-ellipsis"
                      >
                        …
                      </span>

                    ) : (

                      <button
                        type="button"
                        key={page}
                        className={
                          page ===
                          currentUserPage
                            ? "admin-page-button active"
                            : "admin-page-button"
                        }
                        onClick={() =>
                          setCurrentUserPage(
                            page as number
                          )
                        }
                      >
                        {page}
                      </button>

                    )
                )}

              </div>

              <button
                type="button"
                className="admin-page-button next"
                disabled={
                  currentUserPage ===
                  totalUserPages
                }
                onClick={() =>
                  setCurrentUserPage(
                    (page) =>
                      Math.min(
                        totalUserPages,
                        page + 1
                      )
                  )
                }
              >
                Next →
              </button>

            </div>

          )}

        </section>

        {/* =========================
            ORDERS
        ========================== */}

        <section
          className="admin-section"
          id="admin-orders"
        >

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                TRANSACTION CONTROL
              </span>

              <h2>
                Orders
              </h2>

              <p>
                Full order management will be
                connected here.
              </p>

            </div>

            <span className="admin-coming-soon">
              COMING SOON
            </span>

          </div>

          <div className="admin-roadmap-card">

            <div className="admin-roadmap-icon">
              ≡
            </div>

            <div>

              <strong>
                Order Management Center
              </strong>

              <p>
                Track active orders, payment
                status, delivery progress,
                buyer reviews and seller
                payouts from one place.
              </p>

            </div>

          </div>

        </section>

        {/* =========================
            ADMIN ROADMAP
        ========================== */}

        <section className="admin-section">

          <div className="admin-section-heading">

            <div>

              <span className="admin-section-label">
                PLATFORM ROADMAP
              </span>

              <h2>
                What's Coming Next
              </h2>

            </div>

          </div>

          <div className="admin-roadmap-grid">

            <div className="admin-roadmap-item active">

              <span>
                01
              </span>

              <div>

                <strong>
                  Project Approval
                </strong>

                <p>
                  Review and approve seller
                  listings.
                </p>

              </div>

              <b>
                ACTIVE
              </b>

            </div>

            <div className="admin-roadmap-item active">

              <span>
                02
              </span>

              <div>

                <strong>
                  Member Verification
                </strong>

                <p>
                  Verify and manage marketplace
                  members.
                </p>

              </div>

              <b>
                ACTIVE
              </b>

            </div>

            <div className="admin-roadmap-item active">

              <span>
                03
              </span>

              <div>

                <strong>
                  Payment Verification
                </strong>

                <p>
                  Review buyer payment
                  submissions.
                </p>

              </div>

              <b>
                ACTIVE
              </b>

            </div>

            <div className="admin-roadmap-item">

              <span>
                04
              </span>

              <div>

                <strong>
                  Order Management
                </strong>

                <p>
                  Monitor active marketplace
                  transactions.
                </p>

              </div>

              <b>
                SOON
              </b>

            </div>

            <div className="admin-roadmap-item">

              <span>
                05
              </span>

              <div>

                <strong>
                  Dispute Center
                </strong>

                <p>
                  Handle buyer and seller
                  disputes.
                </p>

              </div>

              <b>
                SOON
              </b>

            </div>

            <div className="admin-roadmap-item">

              <span>
                06
              </span>

              <div>

                <strong>
                  Platform Analytics
                </strong>

                <p>
                  Revenue, activity and
                  marketplace insights.
                </p>

              </div>

              <b>
                SOON
              </b>

            </div>

          </div>

        </section>

        {/* FOOTER */}

        <footer className="admin-footer">

          <span>
            PROJECTHUB ADMIN
          </span>

          <span>
            Marketplace Control Center
          </span>

          <span>
            v1.0
          </span>

        </footer>

      </main>

    </div>
  );
}

export default AdminDashboard;