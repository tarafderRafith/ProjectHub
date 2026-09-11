
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

interface BuyerOrder {
  id: number;
  projectId: number;
  projectTitle: string;
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
  projectPrice: number;
  status: string;
  buyerMessage: string | null;
  deliveryNote?: string | null;
  githubLink?: string | null;
  deliveryLink?: string | null;
  revisionNote?: string | null;
  expectedDeliveryDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SellerOrder {
  id: number;
  projectId: number;
  projectTitle: string;
  buyerId: number;
  buyerName: string;
  buyerUsername: string;
  projectPrice: number;
  sellerAmount: number;
  status: string;
  buyerMessage: string | null;
  deliveryNote: string | null;
  githubLink?: string | null;
  deliveryLink?: string | null;
  revisionNote?: string | null;
  expectedDeliveryDate: string | null;
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

  const [buyerOrders, setBuyerOrders] =
    useState<BuyerOrder[]>([]);

  const [sellerOrders, setSellerOrders] =
    useState<SellerOrder[]>([]);

  const [projectsLoading, setProjectsLoading] =
    useState(false);

  const [ordersLoading, setOrdersLoading] =
    useState(false);

  const [projectsError, setProjectsError] =
    useState("");

  const [ordersError, setOrdersError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [, setError] =
    useState("");

  const [deletingProjectId, setDeletingProjectId] =
    useState<number | null>(null);

  const [actionOrderId, setActionOrderId] =
    useState<number | null>(null);

  // ==========================================
  // DELIVERY FORM DATA
  // ==========================================

  const [deliveryNotes, setDeliveryNotes] =
    useState<Record<number, string>>({});

  const [githubLinks, setGithubLinks] =
    useState<Record<number, string>>({});

  const [deliveryLinks, setDeliveryLinks] =
    useState<Record<number, string>>({});

  // ==========================================
  // REVISION DATA
  // ==========================================

  const [revisionNotes, setRevisionNotes] =
    useState<Record<number, string>>({});

  const [revisionOpen, setRevisionOpen] =
    useState<Record<number, boolean>>({});

  const getToken = () => {
    return (
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token")
    );
  };

  const getApiResult = async (
    response: Response
  ): Promise<any> => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  // ==========================================
  // LOAD SELLER PROJECTS
  // ==========================================

  const loadSellerProjects = async () => {
    const token = getToken();

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

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load your projects."
        );
      }

      if (Array.isArray(result)) {
        setSellerProjects(result);
      } else {
        setSellerProjects([]);
      }
    } catch (error) {
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
      setProjectsLoading(false);
    }
  };

  // ==========================================
  // LOAD BUYER ORDERS
  // ==========================================

  const loadBuyerOrders = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await fetch(
        "http://localhost:5038/api/orders/my-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load your orders."
        );
      }

      if (Array.isArray(result)) {
        setBuyerOrders(result);
      } else {
        setBuyerOrders([]);
      }
    } catch (error) {
      console.error(
        "Failed to load buyer orders:",
        error
      );

      setOrdersError(
        error instanceof Error
          ? error.message
          : "Unable to load your orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  // ==========================================
  // LOAD SELLER ORDERS
  // ==========================================

  const loadSellerOrders = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const response = await fetch(
        "http://localhost:5038/api/orders/seller-orders",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load seller orders."
        );
      }

      if (Array.isArray(result)) {
        setSellerOrders(result);
      } else {
        setSellerOrders([]);
      }
    } catch (error) {
      console.error(
        "Failed to load seller orders:",
        error
      );

      setOrdersError(
        error instanceof Error
          ? error.message
          : "Unable to load seller orders."
      );
    } finally {
      setOrdersLoading(false);
    }
  };

  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    let isMounted = true;

    const loadUser = async () => {
      const token = getToken();

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

        const role =
          String(
            currentUser.role ?? ""
          ).toLowerCase();

        if (role === "seller") {
          await Promise.all([
            loadSellerProjects(),
            loadSellerOrders(),
          ]);
        } else {
          await loadBuyerOrders();
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

  // ==========================================
  // USER INFORMATION
  // ==========================================

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
    String(userRole).toLowerCase() ===
    "seller";

  // ==========================================
  // ACTIVE ORDERS
  // ==========================================

  const isOrderActive = (
    status: string
  ) => {
    const normalized =
      String(status || "")
        .toLowerCase()
        .trim();

    return ![
      "completed",
      "cancelled",
      "payment released",
    ].includes(normalized);
  };

  const activeOrders = isSeller
    ? sellerOrders.filter(
        (order) =>
          isOrderActive(order.status)
      ).length
    : buyerOrders.filter(
        (order) =>
          isOrderActive(order.status)
      ).length;

  // ==========================================
  // SELLER ORDER STATISTICS
  // ==========================================

  const sellerWaitingOrders =
    sellerOrders.filter(
      (order) =>
        order.status === "Payment Held"
    ).length;

  const sellerWorkingOrders =
    sellerOrders.filter(
      (order) =>
        order.status === "Seller Working" ||
        order.status === "Revision Requested"
    ).length;

  const sellerSubmittedOrders =
    sellerOrders.filter(
      (order) =>
        order.status === "Submitted" ||
        order.status === "Buyer Review"
    ).length;

  const sellerCompletedOrders =
    sellerOrders.filter(
      (order) =>
        order.status === "Completed" ||
        order.status === "Payment Released"
    ).length;

  // ==========================================
  // SCROLL TO ORDERS
  // ==========================================

  const scrollToOrders = () => {
    setActiveMenu("Orders");

    setTimeout(() => {
      const ordersSection =
        document.getElementById(
          "dashboard-orders"
        );

      if (ordersSection) {
        ordersSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 50);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "projecthub_token"
    );

    sessionStorage.removeItem(
      "projecthub_token"
    );

    navigate("/login");
  };

  // ==========================================
  // DELETE PROJECT
  // ==========================================

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

    const token = getToken();

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

      const result =
        await getApiResult(response);

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

  // ==========================================
  // SELLER: START WORK
  // ==========================================

  const handleStartWork = async (
    orderId: number
  ) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionOrderId(orderId);

      const response = await fetch(
        `http://localhost:5038/api/orders/${orderId}/start-work`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to start work."
        );
      }

      setSellerOrders(
        (orders) =>
          orders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status:
                      "Seller Working",
                    updatedAt:
                      new Date().toISOString(),
                  }
                : order
          )
      );

      window.alert(
        "Work started successfully."
      );
    } catch (error) {
      console.error(
        "Failed to start work:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to start work."
      );
    } finally {
      setActionOrderId(null);
    }
  };

  // ==========================================
  // SELLER: SUBMIT / DELIVER WORK
  // ==========================================

  const handleSubmitWork = async (
    orderId: number
  ) => {
    const deliveryNote =
      deliveryNotes[orderId]?.trim() || "";

    const githubLink =
      githubLinks[orderId]?.trim() || "";

    const deliveryLink =
      deliveryLinks[orderId]?.trim() || "";

    if (!githubLink) {
      window.alert(
        "Please provide the GitHub repository link."
      );
      return;
    }

    if (!deliveryLink) {
      window.alert(
        "Please provide the delivery link."
      );
      return;
    }

    if (!deliveryNote) {
      window.alert(
        "Please write a delivery message before submitting the work."
      );
      return;
    }

    try {
      new URL(githubLink);
    } catch {
      window.alert(
        "Please enter a valid GitHub repository URL."
      );
      return;
    }

    try {
      new URL(deliveryLink);
    } catch {
      window.alert(
        "Please enter a valid delivery URL."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionOrderId(orderId);

      const response = await fetch(
        `http://localhost:5038/api/orders/${orderId}/submit`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            deliveryNote,
            githubLink,
            deliveryLink,
          }),
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to submit the work."
        );
      }

      setSellerOrders(
        (orders) =>
          orders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status:
                      "Submitted",
                    deliveryNote,
                    githubLink,
                    deliveryLink,
                    revisionNote: null,
                    updatedAt:
                      new Date().toISOString(),
                  }
                : order
          )
      );

      setDeliveryNotes(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[orderId];

          return updated;
        }
      );

      setGithubLinks(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[orderId];

          return updated;
        }
      );

      setDeliveryLinks(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[orderId];

          return updated;
        }
      );

      window.alert(
        "Work delivered successfully.\n\nThe buyer can now review your project."
      );
    } catch (error) {
      console.error(
        "Failed to submit work:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to submit the work."
      );
    } finally {
      setActionOrderId(null);
    }
  };

  // ==========================================
  // BUYER: REQUEST REVISION
  // ==========================================

  const handleRequestRevision = async (
    orderId: number
  ) => {
    const revisionNote =
      revisionNotes[orderId]?.trim();

    if (!revisionNote) {
      window.alert(
        "Please explain what changes you need from the seller."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionOrderId(orderId);

      const response = await fetch(
        `http://localhost:5038/api/orders/${orderId}/request-revision`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            revisionNote,
          }),
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to request revision."
        );
      }

      setBuyerOrders(
        (orders) =>
          orders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status:
                      "Revision Requested",
                    revisionNote,
                    updatedAt:
                      new Date().toISOString(),
                  }
                : order
          )
      );

      setRevisionNotes(
        (current) => {
          const updated = {
            ...current,
          };

          delete updated[orderId];

          return updated;
        }
      );

      setRevisionOpen(
        (current) => ({
          ...current,
          [orderId]: false,
        })
      );

      window.alert(
        "Revision request sent to the seller."
      );
    } catch (error) {
      console.error(
        "Failed to request revision:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to request revision."
      );
    } finally {
      setActionOrderId(null);
    }
  };

  // ==========================================
  // BUYER: REVIEW WORK
  // ==========================================

  const handleReviewWork = async (
    orderId: number
  ) => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionOrderId(orderId);

      const response = await fetch(
        `http://localhost:5038/api/orders/${orderId}/review`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to review the work."
        );
      }

      setBuyerOrders(
        (orders) =>
          orders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status:
                      "Buyer Review",
                    updatedAt:
                      new Date().toISOString(),
                  }
                : order
          )
      );

      window.alert(
        "Order moved to buyer review."
      );
    } catch (error) {
      console.error(
        "Failed to review work:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to review the work."
      );
    } finally {
      setActionOrderId(null);
    }
  };

  // ==========================================
  // BUYER: COMPLETE ORDER
  // ==========================================

  const handleCompleteOrder = async (
    orderId: number
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to complete this order?\n\nAfter completion, the seller payout will become ready for release by ProjectHub."
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setActionOrderId(orderId);

      const response = await fetch(
        `http://localhost:5038/api/orders/${orderId}/complete`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await getApiResult(response);

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to complete the order."
        );
      }

      setBuyerOrders(
        (orders) =>
          orders.map(
            (order) =>
              order.id === orderId
                ? {
                    ...order,
                    status:
                      "Completed",
                    updatedAt:
                      new Date().toISOString(),
                  }
                : order
          )
      );

      window.alert(
        "Order completed successfully.\n\nThe seller payout is now ready for ProjectHub admin release."
      );
    } catch (error) {
      console.error(
        "Failed to complete order:",
        error
      );

      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to complete the order."
      );
    } finally {
      setActionOrderId(null);
    }
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (
    status: string
  ) => {
    const normalized =
      String(status || "")
        .toLowerCase();

    if (
      normalized.includes(
        "payment pending"
      )
    ) {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (
      normalized.includes(
        "pending verification"
      )
    ) {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (
      normalized.includes(
        "held"
      )
    ) {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (
      normalized.includes(
        "working"
      )
    ) {
      return {
        background: "#e0e7ff",
        color: "#4338ca",
      };
    }

    if (
      normalized.includes(
        "revision"
      )
    ) {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    if (
      normalized.includes(
        "submitted"
      )
    ) {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (
      normalized.includes(
        "review"
      )
    ) {
      return {
        background: "#ede9fe",
        color: "#6d28d9",
      };
    }

    if (
      normalized.includes(
        "completed"
      )
    ) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      normalized.includes(
        "released"
      )
    ) {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (
      normalized.includes(
        "cancelled"
      )
    ) {
      return {
        background: "#fee2e2",
        color: "#991b1b",
      };
    }

    return {
      background: "#f1f5f9",
      color: "#475569",
    };
  };

  // ==========================================
  // SELLER ACTION AREA
  // ==========================================

  const renderSellerOrderAction = (
    order: SellerOrder
  ) => {
    const isActionRunning =
      actionOrderId === order.id;

    if (order.status === "Payment Held") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "16px",
            borderRadius: "14px",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
          }}
        >
          <div
            style={{
              marginBottom: "12px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#1e3a8a",
                fontSize: "14px",
                marginBottom: "5px",
              }}
            >
              Payment verified — ready to start
            </strong>

            <span
              style={{
                color: "#475569",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              ProjectHub has verified the
              buyer's payment. You can now
              start working on this project.
            </span>
          </div>

          <button
            type="button"
            className="dashboard-primary-button"
            disabled={isActionRunning}
            onClick={() =>
              handleStartWork(order.id)
            }
          >
            {isActionRunning
              ? "Starting..."
              : "Start Work →"}
          </button>
        </div>
      );
    }

    if (
      order.status === "Seller Working" ||
      order.status === "Revision Requested"
    ) {
      const isRevision =
        order.status === "Revision Requested";

      return (
        <div
          style={{
            marginTop: "18px",
            padding: "18px",
            borderRadius: "14px",
            background: isRevision
              ? "#fff7ed"
              : "#eef2ff",
            border: isRevision
              ? "1px solid #fed7aa"
              : "1px solid #c7d2fe",
          }}
        >
          {isRevision && (
            <div
              style={{
                marginBottom: "14px",
                padding: "13px 14px",
                borderRadius: "10px",
                background: "#ffedd5",
                color: "#9a3412",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              <strong>
                Revision requested
              </strong>

              {order.revisionNote && (
                <div
                  style={{
                    marginTop: "5px",
                  }}
                >
                  Buyer says:{" "}
                  {order.revisionNote}
                </div>
              )}
            </div>
          )}

          <div
            style={{
              marginBottom: "14px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: isRevision
                  ? "#9a3412"
                  : "#3730a3",
                fontSize: "15px",
                marginBottom: "5px",
              }}
            >
              {isRevision
                ? "Update your work and deliver again"
                : "Deliver your completed work"}
            </strong>

            <span
              style={{
                color: "#475569",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              Provide both your GitHub repository
              and the link where the buyer can
              access the completed files.
            </span>
          </div>

          {/* GITHUB LINK */}

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              GitHub Repository Link
            </label>

            <input
              type="url"
              value={
                githubLinks[order.id] || ""
              }
              onChange={(event) =>
                setGithubLinks(
                  (current) => ({
                    ...current,
                    [order.id]:
                      event.target.value,
                  })
                )
              }
              placeholder="https://github.com/username/project"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "10px",
                fontFamily: "inherit",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* DELIVERY LINK */}

          <div
            style={{
              marginBottom: "10px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Delivery Link
            </label>

            <input
              type="url"
              value={
                deliveryLinks[order.id] || ""
              }
              onChange={(event) =>
                setDeliveryLinks(
                  (current) => ({
                    ...current,
                    [order.id]:
                      event.target.value,
                  })
                )
              }
              placeholder="https://drive.google.com/..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "10px",
                fontFamily: "inherit",
                fontSize: "14px",
                outline: "none",
              }}
            />

            <small
              style={{
                display: "block",
                marginTop: "5px",
                color: "#64748b",
                fontSize: "11px",
              }}
            >
              Google Drive, OneDrive, Dropbox,
              ZIP hosting, or another accessible
              file link.
            </small>
          </div>

          {/* DELIVERY MESSAGE */}

          <div
            style={{
              marginBottom: "12px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                color: "#334155",
                marginBottom: "6px",
              }}
            >
              Delivery Message
            </label>

            <textarea
              value={
                deliveryNotes[
                  order.id
                ] || ""
              }
              onChange={(event) =>
                setDeliveryNotes(
                  (current) => ({
                    ...current,
                    [order.id]:
                      event.target.value,
                  })
                )
              }
              placeholder="Write a message for the buyer. Example: The project is completed and all files are included in the delivery link."
              rows={4}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                border:
                  "1px solid #cbd5e1",
                borderRadius: "10px",
                resize: "vertical",
                fontFamily: "inherit",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          <button
            type="button"
            className="dashboard-primary-button"
            disabled={isActionRunning}
            onClick={() =>
              handleSubmitWork(order.id)
            }
          >
            {isActionRunning
              ? "Delivering..."
              : isRevision
              ? "Resubmit Work →"
              : "Deliver Work →"}
          </button>
        </div>
      );
    }

    if (order.status === "Submitted") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "15px 16px",
            borderRadius: "14px",
            background: "#fffbeb",
            border: "1px solid #fde68a",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#92400e",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            ✓ Project delivered
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Your completed project has been
            delivered to the buyer. Wait for
            the buyer's review.
          </span>
        </div>
      );
    }

    if (order.status === "Buyer Review") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "15px 16px",
            borderRadius: "14px",
            background: "#f5f3ff",
            border: "1px solid #ddd6fe",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#6d28d9",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            Buyer is reviewing your work
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            The buyer is reviewing the
            submitted project. No action is
            required from you right now.
          </span>
        </div>
      );
    }

    if (order.status === "Completed") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "15px 16px",
            borderRadius: "14px",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#166534",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            ✓ Order completed
          </strong>

          <span
            style={{
              color: "#475569",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            The buyer has completed the
            order. Your seller payout is now
            ready for ProjectHub admin release.
          </span>
        </div>
      );
    }

    if (order.status === "Payment Released") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "15px 16px",
            borderRadius: "14px",
            background: "#f0fdf4",
            border: "1px solid #86efac",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#166534",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            ✓ Payment released
          </strong>

          <span
            style={{
              color: "#475569",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            ProjectHub has released your
            seller payout of{" "}
            <strong>
              ৳
              {Number(
                order.sellerAmount
              ).toLocaleString()}
            </strong>
            .
          </span>
        </div>
      );
    }

    if (order.status === "Cancelled") {
      return (
        <div
          style={{
            marginTop: "18px",
            padding: "15px 16px",
            borderRadius: "14px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
          }}
        >
          <strong
            style={{
              display: "block",
              color: "#991b1b",
              fontSize: "14px",
              marginBottom: "5px",
            }}
          >
            Order cancelled
          </strong>

          <span
            style={{
              color: "#64748b",
              fontSize: "13px",
            }}
          >
            This order is no longer active.
          </span>
        </div>
      );
    }

    return null;
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

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
            <span
              style={{
                color: "#7c3aed",
              }}
            >
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

      {/* ======================================
          SIDEBAR
      ====================================== */}

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
            type="button"
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
            type="button"
            className={`sidebar-link ${
              activeMenu === "Orders"
                ? "active"
                : ""
            }`}
            onClick={scrollToOrders}
          >
            <span>▣</span>
            My Orders
          </button>

          <button
            type="button"
            className={`sidebar-link messages-link ${
              activeMenu === "Messages"
                ? "active"
                : ""
            }`}
            onClick={() => {
              setActiveMenu("Messages");
              navigate("/messages");
            }}
          >
            <span>▱</span>
            Messages
            <small>!</small>
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
            type="button"
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

      {/* ======================================
          MAIN DASHBOARD
      ====================================== */}

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
              type="button"
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
                  {activeOrders}
                </strong>
              </div>

              <small>
                {activeOrders === 0
                  ? "No active orders"
                  : "Orders currently in progress"}
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

          {/* SELLER CREATE PROJECT */}

          {isSeller && (
            <section className="seller-create-section">
              <div className="seller-create-content">
                <div>
                  <span className="seller-create-eyebrow">SELLER WORKSPACE</span>
                  <h2>Ready to put a project on the marketplace?</h2>
                  <p>
                    Create a project listing and make it available for buyers to discover and purchase.
                  </p>
                </div>

                <div className="seller-create-actions">
                  <Link
                    to="/seller/projects/create"
                    className="dashboard-primary-button seller-create-button"
                  >
                    + Create Project
                  </Link>
                  <Link
                    to="/projects"
                    className="dashboard-secondary-button seller-browse-button"
                  >
                    Browse Marketplace
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* SELLER PROJECTS */}

          {/* SELLER PROJECTS */}

          {isSeller && (
            <section className="dashboard-section seller-projects-section">

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
                    display:
                      "flex",
                    gap:
                      "10px",
                    alignItems:
                      "center",
                    flexWrap:
                      "wrap",
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
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(280px, 1fr))",
                    gap:
                      "20px",
                  }}
                >

                  {sellerProjects.map(
                    (project) => (
                      <div
                        key={project.id}
                        className="seller-project-card"
                        style={{
                          border:
                            "1px solid #e2e8f0",
                          borderRadius:
                            "18px",
                          padding:
                            "22px",
                          background:
                            "#ffffff",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "flex-start",
                            gap:
                              "12px",
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
                                fontWeight:
                                  700,
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
                              flexShrink:
                                0,
                              fontSize:
                                "11px",
                              fontWeight:
                                700,
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
                              {Number(
                                project.price
                              ).toLocaleString()}
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
                              flex:
                                1,
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
                              flex:
                                1,
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

          {/* SELLER ORDER SNAPSHOT */}

          {isSeller && (
            <section
              className="dashboard-section"
              style={{
                marginTop: "24px",
              }}
            >

              <div className="section-heading">

                <div>

                  <span>
                    ORDER PIPELINE
                  </span>

                  <h2>
                    Seller workflow
                  </h2>

                </div>

                <button
                  type="button"
                  onClick={scrollToOrders}
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    color:
                      "#7c3aed",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Manage orders →
                </button>

              </div>

              <div
                style={{
                  display:
                    "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(170px, 1fr))",
                  gap:
                    "14px",
                }}
              >

                <div
                  style={{
                    padding:
                      "18px",
                    border:
                      "1px solid #dbeafe",
                    borderRadius:
                      "16px",
                    background:
                      "#eff6ff",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#64748b",
                      fontSize:
                        "12px",
                      marginBottom:
                        "6px",
                    }}
                  >
                    READY TO START
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      color:
                        "#1d4ed8",
                      fontSize:
                        "25px",
                    }}
                  >
                    {sellerWaitingOrders}
                  </strong>

                  <small
                    style={{
                      color:
                        "#475569",
                    }}
                  >
                    Payment held
                  </small>
                </div>

                <div
                  style={{
                    padding:
                      "18px",
                    border:
                      "1px solid #c7d2fe",
                    borderRadius:
                      "16px",
                    background:
                      "#eef2ff",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#64748b",
                      fontSize:
                        "12px",
                      marginBottom:
                        "6px",
                    }}
                  >
                    WORKING
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      color:
                        "#4338ca",
                      fontSize:
                        "25px",
                    }}
                  >
                    {sellerWorkingOrders}
                  </strong>

                  <small
                    style={{
                      color:
                        "#475569",
                    }}
                  >
                    In progress
                  </small>
                </div>

                <div
                  style={{
                    padding:
                      "18px",
                    border:
                      "1px solid #fde68a",
                    borderRadius:
                      "16px",
                    background:
                      "#fffbeb",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#64748b",
                      fontSize:
                        "12px",
                      marginBottom:
                        "6px",
                    }}
                  >
                    REVIEW
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      color:
                        "#92400e",
                      fontSize:
                        "25px",
                    }}
                  >
                    {sellerSubmittedOrders}
                  </strong>

                  <small
                    style={{
                      color:
                        "#475569",
                    }}
                  >
                    With buyer
                  </small>
                </div>

                <div
                  style={{
                    padding:
                      "18px",
                    border:
                      "1px solid #bbf7d0",
                    borderRadius:
                      "16px",
                    background:
                      "#f0fdf4",
                  }}
                >
                  <span
                    style={{
                      display:
                        "block",
                      color:
                        "#64748b",
                      fontSize:
                        "12px",
                      marginBottom:
                        "6px",
                    }}
                  >
                    COMPLETED
                  </span>

                  <strong
                    style={{
                      display:
                        "block",
                      color:
                        "#166534",
                      fontSize:
                        "25px",
                    }}
                  >
                    {sellerCompletedOrders}
                  </strong>

                  <small
                    style={{
                      color:
                        "#475569",
                    }}
                  >
                    Finished orders
                  </small>
                </div>

              </div>

            </section>
          )}

          {/* ORDERS */}

          <section
            id="dashboard-orders"
            className="dashboard-section"
          >

            <div className="section-heading">

              <div>

                <span>
                  {isSeller
                    ? "SELLER ORDERS"
                    : "MY ORDERS"}
                </span>

                <h2>
                  {isSeller
                    ? "Orders from buyers"
                    : "My project orders"}
                </h2>

              </div>

              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                {isSeller
                  ? `${sellerOrders.length} total order${
                      sellerOrders.length === 1
                        ? ""
                        : "s"
                    }`
                  : `${buyerOrders.length} total order${
                      buyerOrders.length === 1
                        ? ""
                        : "s"
                    }`}
              </span>

            </div>

            {ordersLoading ? (
              <div className="activity-card">

                <div className="empty-state">

                  <div className="empty-icon">
                    ◌
                  </div>

                  <h3>
                    Loading orders...
                  </h3>

                  <p>
                    Please wait while we load
                    your orders.
                  </p>

                </div>

              </div>
            ) : ordersError ? (
              <div className="activity-card">

                <div className="empty-state">

                  <div className="empty-icon">
                    !
                  </div>

                  <h3>
                    Unable to load orders
                  </h3>

                  <p>
                    {ordersError}
                  </p>

                </div>

              </div>
            ) : isSeller ? (

              sellerOrders.length === 0 ? (
                <div className="activity-card">

                  <div className="empty-state">

                    <div className="empty-icon">
                      ▣
                    </div>

                    <h3>
                      No orders yet
                    </h3>

                    <p>
                      When someone purchases one
                      of your projects, the order
                      will appear here.
                    </p>

                    <Link
                      to="/projects"
                      className="empty-action"
                    >
                      View Marketplace →
                    </Link>

                  </div>

                </div>
              ) : (
                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "16px",
                  }}
                >

                  {sellerOrders.map(
                    (order) => {
                      const statusStyle =
                        getStatusStyle(
                          order.status
                        );

                      return (
                        <div
                          key={order.id}
                          style={{
                            border:
                              "1px solid #e2e8f0",
                            borderRadius:
                              "18px",
                            padding:
                              "20px",
                            background:
                              "#ffffff",
                          }}
                        >

                          {/* ORDER HEADER */}

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "flex-start",
                              gap:
                                "16px",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    700,
                                  color:
                                    "#7c3aed",
                                  marginBottom:
                                    "6px",
                                  textTransform:
                                    "uppercase",
                                }}
                              >
                                Order #
                                {order.id}
                              </span>

                              <h3
                                style={{
                                  margin:
                                    "0 0 7px",
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "19px",
                                }}
                              >
                                {order.projectTitle}
                              </h3>

                              <p
                                style={{
                                  margin:
                                    0,
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                Buyer:{" "}
                                <strong
                                  style={{
                                    color:
                                      "#334155",
                                  }}
                                >
                                  {order.buyerName}
                                </strong>{" "}
                                @{order.buyerUsername}
                              </p>

                            </div>

                            <span
                              style={{
                                ...statusStyle,
                                padding:
                                  "7px 12px",
                                borderRadius:
                                  "999px",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  700,
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {order.status}
                            </span>

                          </div>

                          {/* ORDER DETAILS */}

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(130px, 1fr))",
                              gap:
                                "14px",
                              marginTop:
                                "18px",
                              paddingTop:
                                "18px",
                              borderTop:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Project Value
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "17px",
                                }}
                              >
                                ৳
                                {Number(
                                  order.projectPrice
                                ).toLocaleString()}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Your Earnings
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#16a34a",
                                  fontSize:
                                    "17px",
                                }}
                              >
                                ৳
                                {Number(
                                  order.sellerAmount
                                ).toLocaleString()}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Expected Delivery
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#334155",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {order.expectedDeliveryDate
                                  ? new Date(
                                      order.expectedDeliveryDate
                                    ).toLocaleDateString()
                                  : "Not specified"}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Order Date
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#334155",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}
                              </strong>

                            </div>

                          </div>

                          {/* BUYER MESSAGE */}

                          {order.buyerMessage && (
                            <div
                              style={{
                                marginTop:
                                  "16px",
                                padding:
                                  "13px 15px",
                                borderRadius:
                                  "12px",
                                background:
                                  "#f8fafc",
                                color:
                                  "#475569",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.6,
                              }}
                            >
                              <strong>
                                Buyer message:
                              </strong>{" "}
                              {order.buyerMessage}
                            </div>
                          )}

                          {/* REVISION NOTE */}

                          {order.revisionNote &&
                            order.status ===
                              "Revision Requested" && (
                            <div
                              style={{
                                marginTop:
                                  "12px",
                                padding:
                                  "13px 15px",
                                borderRadius:
                                  "12px",
                                background:
                                  "#fff7ed",
                                border:
                                  "1px solid #fed7aa",
                                color:
                                  "#9a3412",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.6,
                              }}
                            >
                              <strong>
                                Buyer revision request:
                              </strong>{" "}
                              {order.revisionNote}
                            </div>
                          )}

                          {/* DELIVERY INFO */}

                          {order.deliveryNote && (
                            <div
                              style={{
                                marginTop:
                                  "12px",
                                padding:
                                  "15px",
                                borderRadius:
                                  "12px",
                                background:
                                  "#f0fdf4",
                                border:
                                  "1px solid #bbf7d0",
                                color:
                                  "#166534",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.6,
                              }}
                            >
                              <strong
                                style={{
                                  display:
                                    "block",
                                  marginBottom:
                                    "8px",
                                }}
                              >
                                Project Delivery
                              </strong>

                              <div>
                                <strong>
                                  Message:
                                </strong>{" "}
                                {order.deliveryNote}
                              </div>

                              {order.githubLink && (
                                <div
                                  style={{
                                    marginTop:
                                      "7px",
                                  }}
                                >
                                  <strong>
                                    GitHub:
                                  </strong>{" "}
                                  <a
                                    href={
                                      order.githubLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color:
                                        "#2563eb",
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    Open Repository →
                                  </a>
                                </div>
                              )}

                              {order.deliveryLink && (
                                <div
                                  style={{
                                    marginTop:
                                      "7px",
                                  }}
                                >
                                  <strong>
                                    Delivery:
                                  </strong>{" "}
                                  <a
                                    href={
                                      order.deliveryLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      color:
                                        "#2563eb",
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    Open Delivery Files →
                                  </a>
                                </div>
                              )}

                            </div>
                          )}

                          {/* SELLER ACTION */}

                          {renderSellerOrderAction(
                            order
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )

            ) : (

              /* =================================
                 BUYER ORDERS
              ================================= */

              buyerOrders.length === 0 ? (
                <div className="activity-card">

                  <div className="empty-state">

                    <div className="empty-icon">
                      ▣
                    </div>

                    <h3>
                      You have no orders yet
                    </h3>

                    <p>
                      Browse the marketplace and
                      purchase a project to create
                      your first order.
                    </p>

                    <Link
                      to="/projects"
                      className="empty-action"
                    >
                      Explore Projects →
                    </Link>

                  </div>

                </div>
              ) : (
                <div
                  style={{
                    display:
                      "grid",
                    gap:
                      "16px",
                  }}
                >

                  {buyerOrders.map(
                    (order) => {
                      const statusStyle =
                        getStatusStyle(
                          order.status
                        );

                      const isRevisionFormOpen =
                        revisionOpen[
                          order.id
                        ] === true;

                      return (
                        <div
                          key={order.id}
                          style={{
                            border:
                              "1px solid #e2e8f0",
                            borderRadius:
                              "18px",
                            padding:
                              "20px",
                            background:
                              "#ffffff",
                          }}
                        >

                          {/* ORDER HEADER */}

                          <div
                            style={{
                              display:
                                "flex",
                              justifyContent:
                                "space-between",
                              alignItems:
                                "flex-start",
                              gap:
                                "16px",
                              flexWrap:
                                "wrap",
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  fontSize:
                                    "12px",
                                  fontWeight:
                                    700,
                                  color:
                                    "#7c3aed",
                                  marginBottom:
                                    "6px",
                                  textTransform:
                                    "uppercase",
                                }}
                              >
                                Order #
                                {order.id}
                              </span>

                              <h3
                                style={{
                                  margin:
                                    "0 0 7px",
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "19px",
                                }}
                              >
                                {order.projectTitle}
                              </h3>

                              <p
                                style={{
                                  margin:
                                    0,
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                Seller:{" "}
                                <strong
                                  style={{
                                    color:
                                      "#334155",
                                  }}
                                >
                                  {order.sellerName}
                                </strong>{" "}
                                @{order.sellerUsername}
                              </p>

                            </div>

                            <span
                              style={{
                                ...statusStyle,
                                padding:
                                  "7px 12px",
                                borderRadius:
                                  "999px",
                                fontSize:
                                  "12px",
                                fontWeight:
                                  700,
                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {order.status}
                            </span>

                          </div>

                          {/* ORDER DETAILS */}

                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(130px, 1fr))",
                              gap:
                                "14px",
                              marginTop:
                                "18px",
                              paddingTop:
                                "18px",
                              borderTop:
                                "1px solid #e2e8f0",
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Project Price
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#0f172a",
                                  fontSize:
                                    "17px",
                                }}
                              >
                                ৳
                                {Number(
                                  order.projectPrice
                                ).toLocaleString()}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "12px",
                                  marginBottom:
                                    "4px",
                                }}
                              >
                                Order Date
                              </span>

                              <strong
                                style={{
                                  color:
                                    "#334155",
                                  fontSize:
                                    "14px",
                                }}
                              >
                                {new Date(
                                  order.createdAt
                                ).toLocaleDateString()}
                              </strong>

                            </div>

                          </div>

                          {/* BUYER MESSAGE */}

                          {order.buyerMessage && (
                            <div
                              style={{
                                marginTop:
                                  "16px",
                                padding:
                                  "13px 15px",
                                borderRadius:
                                  "12px",
                                background:
                                  "#f8fafc",
                                color:
                                  "#475569",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.6,
                              }}
                            >
                              <strong>
                                Your message:
                              </strong>{" "}
                              {order.buyerMessage}
                            </div>
                          )}

                          {/* REVISION REQUEST STATUS */}

                          {order.status ===
                            "Revision Requested" && (
                            <div
                              style={{
                                marginTop:
                                  "16px",
                                padding:
                                  "14px 15px",
                                borderRadius:
                                  "12px",
                                background:
                                  "#fff7ed",
                                border:
                                  "1px solid #fed7aa",
                                color:
                                  "#9a3412",
                                fontSize:
                                  "13px",
                                lineHeight:
                                  1.6,
                              }}
                            >
                              <strong>
                                Revision requested
                              </strong>

                              <div
                                style={{
                                  marginTop:
                                    "5px",
                                }}
                              >
                                The seller has been
                                asked to update the
                                project.
                              </div>
                            </div>
                          )}

                          {/* PROJECT DELIVERED */}

                          {order.deliveryNote &&
                            (order.status ===
                              "Submitted" ||
                              order.status ===
                                "Buyer Review" ||
                              order.status ===
                                "Completed" ||
                              order.status ===
                                "Payment Released") && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "17px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#f0fdf4",
                                border:
                                  "1px solid #bbf7d0",
                              }}
                            >

                              <div
                                style={{
                                  display:
                                    "flex",
                                  alignItems:
                                    "center",
                                  gap:
                                    "9px",
                                  marginBottom:
                                    "10px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize:
                                      "20px",
                                  }}
                                >
                                  📦
                                </span>

                                <strong
                                  style={{
                                    color:
                                      "#166534",
                                    fontSize:
                                      "16px",
                                  }}
                                >
                                  Project Delivered
                                </strong>

                              </div>

                              <p
                                style={{
                                  margin:
                                    "0 0 12px",
                                  color:
                                    "#475569",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.6,
                                }}
                              >
                                The seller has
                                delivered the
                                completed project.
                              </p>

                              <div
                                style={{
                                  padding:
                                    "12px 14px",
                                  borderRadius:
                                    "10px",
                                  background:
                                    "#ffffff",
                                  color:
                                    "#475569",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.6,
                                  marginBottom:
                                    "12px",
                                }}
                              >
                                <strong>
                                  Delivery Message
                                </strong>

                                <div
                                  style={{
                                    marginTop:
                                      "5px",
                                  }}
                                >
                                  {
                                    order.deliveryNote
                                  }
                                </div>
                              </div>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  flexWrap:
                                    "wrap",
                                  gap:
                                    "10px",
                                }}
                              >

                                {order.githubLink && (
                                  <a
                                    href={
                                      order.githubLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dashboard-secondary-button"
                                    style={{
                                      textDecoration:
                                        "none",
                                    }}
                                  >
                                    GitHub Repository →
                                  </a>
                                )}

                                {order.deliveryLink && (
                                  <a
                                    href={
                                      order.deliveryLink
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="dashboard-primary-button"
                                    style={{
                                      textDecoration:
                                        "none",
                                    }}
                                  >
                                    Open Delivery Files →
                                  </a>
                                )}

                              </div>

                              <div
                                style={{
                                  marginTop:
                                    "12px",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "11px",
                                }}
                              >
                                Delivered:{" "}
                                {new Date(
                                  order.updatedAt
                                ).toLocaleString()}
                              </div>

                            </div>
                          )}

                          {/* BUYER REVIEW */}

                          {order.status ===
                            "Submitted" && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "15px 16px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#fffbeb",
                                border:
                                  "1px solid #fde68a",
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#92400e",
                                  fontSize:
                                    "14px",
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                Review the delivered work
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "0 0 12px",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                Check both the GitHub
                                repository and delivery
                                files. If changes are
                                needed, request a revision.
                              </p>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  flexWrap:
                                    "wrap",
                                  gap:
                                    "10px",
                                }}
                              >

                                <button
                                  type="button"
                                  className="dashboard-secondary-button"
                                  onClick={() =>
                                    setRevisionOpen(
                                      (current) => ({
                                        ...current,
                                        [order.id]:
                                          !current[
                                            order.id
                                          ],
                                      })
                                    )
                                  }
                                >
                                  {isRevisionFormOpen
                                    ? "Cancel Revision"
                                    : "Request Revision"}
                                </button>

                                <button
                                  type="button"
                                  className="dashboard-primary-button"
                                  disabled={
                                    actionOrderId ===
                                    order.id
                                  }
                                  onClick={() =>
                                    handleReviewWork(
                                      order.id
                                    )
                                  }
                                >
                                  {actionOrderId ===
                                  order.id
                                    ? "Processing..."
                                    : "Review Work →"}
                                </button>

                              </div>

                              {isRevisionFormOpen && (
                                <div
                                  style={{
                                    marginTop:
                                      "14px",
                                  }}
                                >

                                  <textarea
                                    value={
                                      revisionNotes[
                                        order.id
                                      ] || ""
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      setRevisionNotes(
                                        (current) => ({
                                          ...current,
                                          [order.id]:
                                            event
                                              .target
                                              .value,
                                        })
                                      )
                                    }
                                    placeholder="Tell the seller what needs to be changed..."
                                    rows={4}
                                    style={{
                                      width:
                                        "100%",
                                      boxSizing:
                                        "border-box",
                                      padding:
                                        "12px",
                                      border:
                                        "1px solid #cbd5e1",
                                      borderRadius:
                                        "10px",
                                      resize:
                                        "vertical",
                                      fontFamily:
                                        "inherit",
                                      fontSize:
                                        "14px",
                                      outline:
                                        "none",
                                      marginBottom:
                                        "10px",
                                    }}
                                  />

                                  <button
                                    type="button"
                                    className="dashboard-primary-button"
                                    disabled={
                                      actionOrderId ===
                                      order.id
                                    }
                                    onClick={() =>
                                      handleRequestRevision(
                                        order.id
                                      )
                                    }
                                  >
                                    {actionOrderId ===
                                    order.id
                                      ? "Sending..."
                                      : "Send Revision Request →"}
                                  </button>

                                </div>
                              )}

                            </div>
                          )}

                          {/* BUYER REVIEW */}

                          {order.status ===
                            "Buyer Review" && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "15px 16px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#f5f3ff",
                                border:
                                  "1px solid #ddd6fe",
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#6d28d9",
                                  fontSize:
                                    "14px",
                                  marginBottom:
                                    "6px",
                                }}
                              >
                                Final review
                              </strong>

                              <p
                                style={{
                                  margin:
                                    "0 0 12px",
                                  color:
                                    "#64748b",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                If everything is
                                correct, complete
                                the order. The seller
                                payout will then become
                                ready for admin release.
                              </p>

                              <div
                                style={{
                                  display:
                                    "flex",
                                  flexWrap:
                                    "wrap",
                                  gap:
                                    "10px",
                                }}
                              >

                                <button
                                  type="button"
                                  className="dashboard-secondary-button"
                                  onClick={() =>
                                    setRevisionOpen(
                                      (current) => ({
                                        ...current,
                                        [order.id]:
                                          !current[
                                            order.id
                                          ],
                                      })
                                    )
                                  }
                                >
                                  {isRevisionFormOpen
                                    ? "Cancel Revision"
                                    : "Request Revision"}
                                </button>

                                <button
                                  type="button"
                                  className="dashboard-primary-button"
                                  disabled={
                                    actionOrderId ===
                                    order.id
                                  }
                                  onClick={() =>
                                    handleCompleteOrder(
                                      order.id
                                    )
                                  }
                                >
                                  {actionOrderId ===
                                  order.id
                                    ? "Completing..."
                                    : "Complete Order ✓"}
                                </button>

                              </div>

                              {isRevisionFormOpen && (
                                <div
                                  style={{
                                    marginTop:
                                      "14px",
                                  }}
                                >

                                  <textarea
                                    value={
                                      revisionNotes[
                                        order.id
                                      ] || ""
                                    }
                                    onChange={(
                                      event
                                    ) =>
                                      setRevisionNotes(
                                        (current) => ({
                                          ...current,
                                          [order.id]:
                                            event
                                              .target
                                              .value,
                                        })
                                      )
                                    }
                                    placeholder="Tell the seller what needs to be changed..."
                                    rows={4}
                                    style={{
                                      width:
                                        "100%",
                                      boxSizing:
                                        "border-box",
                                      padding:
                                        "12px",
                                      border:
                                        "1px solid #cbd5e1",
                                      borderRadius:
                                        "10px",
                                      resize:
                                        "vertical",
                                      fontFamily:
                                        "inherit",
                                      fontSize:
                                        "14px",
                                      outline:
                                        "none",
                                      marginBottom:
                                        "10px",
                                    }}
                                  />

                                  <button
                                    type="button"
                                    className="dashboard-primary-button"
                                    disabled={
                                      actionOrderId ===
                                      order.id
                                    }
                                    onClick={() =>
                                      handleRequestRevision(
                                        order.id
                                      )
                                    }
                                  >
                                    {actionOrderId ===
                                    order.id
                                      ? "Sending..."
                                      : "Send Revision Request →"}
                                  </button>

                                </div>
                              )}

                            </div>
                          )}

                          {/* COMPLETED */}

                          {order.status ===
                            "Completed" && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "15px 16px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#f0fdf4",
                                border:
                                  "1px solid #bbf7d0",
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#166534",
                                  fontSize:
                                    "14px",
                                  marginBottom:
                                    "5px",
                                }}
                              >
                                ✓ Order completed
                              </strong>

                              <span
                                style={{
                                  color:
                                    "#475569",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                The seller payout is
                                now ready for ProjectHub
                                admin release.
                              </span>

                            </div>
                          )}

                          {/* PAYMENT RELEASED */}

                          {order.status ===
                            "Payment Released" && (
                            <div
                              style={{
                                marginTop:
                                  "18px",
                                padding:
                                  "15px 16px",
                                borderRadius:
                                  "14px",
                                background:
                                  "#f0fdf4",
                                border:
                                  "1px solid #86efac",
                              }}
                            >

                              <strong
                                style={{
                                  display:
                                    "block",
                                  color:
                                    "#166534",
                                  fontSize:
                                    "14px",
                                  marginBottom:
                                    "5px",
                                }}
                              >
                                ✓ Transaction completed
                              </strong>

                              <span
                                style={{
                                  color:
                                    "#475569",
                                  fontSize:
                                    "13px",
                                  lineHeight:
                                    1.5,
                                }}
                              >
                                ProjectHub has released
                                the seller payment and
                                completed this order.
                              </span>

                            </div>
                          )}

                        </div>
                      );
                    }
                  )}

                </div>
              )
            )}

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

          {/* ACTIVITY */}

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

              <button
                type="button"
                onClick={scrollToOrders}
                style={{
                  border: "none",
                  background:
                    "transparent",
                  color:
                    "#7c3aed",
                  fontWeight: 700,
                  cursor:
                    "pointer",
                }}
              >
                View orders
              </button>

            </div>

            <div className="activity-card">

              <div className="empty-state">

                <div className="empty-icon">
                  ◌
                </div>

                <h3>
                  {activeOrders > 0
                    ? `${activeOrders} active order${
                        activeOrders === 1
                          ? ""
                          : "s"
                      }`
                    : "No recent activity"}
                </h3>

                <p>
                  {activeOrders > 0
                    ? "Your active orders are shown in the orders section above."
                    : "Once you browse projects, create requests or place an order, your activity will appear here."}
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
