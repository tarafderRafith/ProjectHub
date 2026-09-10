
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
  paymentStatus?: string;
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

interface FinancialSummary {
  totalReceived: number;
  pendingVerificationAmount: number;
  totalMoneyHeld: number;
  totalSellerAmount: number;
  waitingSellerAmount: number;
  readySellerAmount: number;
  releasedSellerAmount: number;
  platformEarnings: number;
  totalOrders: number;
  activeSellerPayouts: number;
  readyToReleaseCount: number;
  releasedPayoutCount: number;
  currency: string;
  commissionRate: number;
}

interface SellerPayout {
  id: number;
  orderId: number;
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
  projectId: number;
  projectTitle: string;
  orderStatus: string;
  projectPrice: number;
  commissionAmount: number;
  sellerAmount: number;
  payoutAmount: number;
  payoutStatus: string;
  adminNote: string | null;
  readyAt: string | null;
  releasedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface SellerFinancialSummary {
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
  totalOwed: number;
  waitingAmount: number;
  readyAmount: number;
  releasedAmount: number;
  totalOrders: number;
  waitingOrders: number;
  readyOrders: number;
  releasedOrders: number;
}

const API_URL = "http://localhost:5038/api";
const USERS_PER_PAGE = 10;

function AdminDashboard() {
  const navigate = useNavigate();

  const [pendingPayments, setPendingPayments] = useState<
    PendingPayment[]
  >([]);

  const [projects, setProjects] = useState<AdminProject[]>([]);

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [financialSummary, setFinancialSummary] =
    useState<FinancialSummary | null>(null);

  const [sellerPayouts, setSellerPayouts] =
    useState<SellerPayout[]>([]);

  const [sellerFinancialSummary, setSellerFinancialSummary] =
    useState<SellerFinancialSummary[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [userSearch, setUserSearch] = useState("");

  const [userFilter, setUserFilter] = useState("all");

  const [currentUserPage, setCurrentUserPage] = useState(1);

  const [expandedUserId, setExpandedUserId] =
    useState<number | null>(null);

  const [processingPaymentId, setProcessingPaymentId] =
    useState<number | null>(null);

  const [processingPayoutId, setProcessingPayoutId] =
    useState<number | null>(null);

  const getToken = () => {
    return (
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token")
    );
  };

  const readResponse = async (
    response: Response
  ): Promise<any> => {
    const text = await response.text();

    if (!text.trim()) {
      return null;
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        `Invalid JSON response from server (${response.status}).`
      );
    }
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
        financialResponse,
        payoutsResponse,
        sellersFinancialResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/admin/payments/pending`, {
          headers,
        }),

        fetch(`${API_URL}/admin/projects`, {
          headers,
        }),

        fetch(`${API_URL}/admin/users`, {
          headers,
        }),

        fetch(`${API_URL}/admin/financials/summary`, {
          headers,
        }),

        fetch(`${API_URL}/admin/financials/payouts`, {
          headers,
        }),

        fetch(`${API_URL}/admin/financials/sellers`, {
          headers,
        }),
      ]);

      const responses = [
        paymentsResponse,
        projectsResponse,
        usersResponse,
        financialResponse,
        payoutsResponse,
        sellersFinancialResponse,
      ];

      if (
        responses.some(
          (response) => response.status === 401
        )
      ) {
        sessionStorage.removeItem("projecthub_token");
        localStorage.removeItem("projecthub_token");

        navigate("/login");
        return;
      }

      if (
        responses.some(
          (response) => response.status === 403
        )
      ) {
        setError(
          "You do not have permission to access the admin dashboard."
        );
        return;
      }

      const [
        paymentsData,
        projectsData,
        usersData,
        financialData,
        payoutsData,
        sellersFinancialData,
      ] = await Promise.all([
        readResponse(paymentsResponse),
        readResponse(projectsResponse),
        readResponse(usersResponse),
        readResponse(financialResponse),
        readResponse(payoutsResponse),
        readResponse(sellersFinancialResponse),
      ]);

      if (!paymentsResponse.ok) {
        throw new Error(
          paymentsData?.message ||
            "Unable to load payments."
        );
      }

      if (!projectsResponse.ok) {
        throw new Error(
          projectsData?.message ||
            "Unable to load projects."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData?.message ||
            "Unable to load users."
        );
      }

      if (!financialResponse.ok) {
        throw new Error(
          financialData?.message ||
            "Unable to load financial data."
        );
      }

      if (!payoutsResponse.ok) {
        throw new Error(
          payoutsData?.message ||
            "Unable to load seller payouts."
        );
      }

      if (!sellersFinancialResponse.ok) {
        throw new Error(
          sellersFinancialData?.message ||
            "Unable to load seller financial data."
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

      if (
        !financialData ||
        typeof financialData !== "object" ||
        Array.isArray(financialData)
      ) {
        throw new Error(
          "Financial summary returned an empty or invalid response."
        );
      }

      setFinancialSummary(
        financialData as FinancialSummary
      );

      setSellerPayouts(
        Array.isArray(payoutsData)
          ? payoutsData
          : []
      );

      setSellerFinancialSummary(
        Array.isArray(sellersFinancialData)
          ? sellersFinancialData
          : []
      );
    } catch (err) {
      console.error(
        "Admin dashboard loading error:",
        err
      );

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

  const totalProjects = projects.length;

  const pendingProjects = projects.filter(
    (project) => project.isApproved === false
  );

  const approvedProjects = projects.filter(
    (project) => project.isApproved === true
  );

  const unavailableProjects = projects.filter(
    (project) => project.isAvailable === false
  );

  const verifiedUsers = users.filter(
    (user) => user.isVerified
  );

  const unverifiedUsers = users.filter(
    (user) =>
      !user.isVerified &&
      String(user.role || "").toLowerCase() !==
        "admin"
  );

  const activeUsers = users.filter(
    (user) => user.isActive
  );

  const buyers = users.filter(
    (user) =>
      String(user.role || "").toLowerCase() ===
      "buyer"
  );

  const sellers = users.filter(
    (user) =>
      String(user.role || "").toLowerCase() ===
      "seller"
  );

  const filteredUsers = useMemo(() => {
    const search = userSearch
      .trim()
      .toLowerCase();

    return users.filter((user) => {
      const role = String(
        user.role || ""
      ).toLowerCase();

      const fullName = user.fullName || "";
      const username = user.username || "";
      const email = user.email || "";
      const studentId = user.studentId || "";

      const matchesSearch =
        !search ||
        fullName.toLowerCase().includes(search) ||
        username.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        studentId.toLowerCase().includes(search);

      const matchesFilter =
        userFilter === "all" ||
        (userFilter === "verified" &&
          user.isVerified) ||
        (userFilter === "unverified" &&
          !user.isVerified &&
          role !== "admin") ||
        (userFilter === "active" &&
          user.isActive) ||
        (userFilter === "inactive" &&
          !user.isActive) ||
        (userFilter === "buyer" &&
          role === "buyer") ||
        (userFilter === "seller" &&
          role === "seller");

      return matchesSearch && matchesFilter;
    });
  }, [users, userSearch, userFilter]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length / USERS_PER_PAGE
    )
  );

  const paginatedUsers = filteredUsers.slice(
    (currentUserPage - 1) * USERS_PER_PAGE,
    currentUserPage * USERS_PER_PAGE
  );

  const userStart =
    filteredUsers.length === 0
      ? 0
      : (currentUserPage - 1) *
          USERS_PER_PAGE +
        1;

  const userEnd = Math.min(
    currentUserPage * USERS_PER_PAGE,
    filteredUsers.length
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

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

    for (let i = start; i <= end; i++) {
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
    if (currentUserPage > totalUserPages) {
      setCurrentUserPage(totalUserPages);
    }
  }, [currentUserPage, totalUserPages]);

  const handlePaymentAction = async (
    paymentId: number,
    action: "verify" | "reject"
  ) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const payment = pendingPayments.find(
        (item) => item.id === paymentId
      );

      if (!payment) {
        setError(
          "Payment could not be found."
        );
        return;
      }

      const actionText =
        action === "verify"
          ? "verify this payment"
          : "reject this payment";

      const confirmed = window.confirm(
        `Are you sure you want to ${actionText}?\n\nProject: ${payment.projectTitle}\nAmount: ${formatMoney(
          payment.amount
        )}\nTransaction ID: ${
          payment.transactionId ||
          "Not provided"
        }`
      );

      if (!confirmed) {
        return;
      }

      setProcessingPaymentId(paymentId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/payments/${paymentId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result =
        await readResponse(response);

      if (response.status === 401) {
        sessionStorage.removeItem(
          "projecthub_token"
        );

        localStorage.removeItem(
          "projecthub_token"
        );

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to manage payments."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Unable to ${action} payment.`
        );
      }

      await loadDashboard();
    } catch (err) {
      console.error(
        "Payment action error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update payment."
      );
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleReleasePayout = async (
    payoutId: number
  ) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const payout = sellerPayouts.find(
        (item) => item.id === payoutId
      );

      if (!payout) {
        setError(
          "Seller payout could not be found."
        );
        return;
      }

      const payoutStatus = String(
        payout.payoutStatus || "Waiting"
      )
        .trim()
        .toLowerCase();

      if (payoutStatus !== "ready") {
        if (payoutStatus === "waiting") {
          setError(
            "This payout is still waiting for the buyer to complete the order."
          );
        } else if (
          payoutStatus === "released"
        ) {
          setError(
            "This seller payout has already been released."
          );
        } else {
          setError(
            "This payout is not ready for release."
          );
        }

        return;
      }

      const payoutAmount = Number(
        payout.payoutAmount ||
          payout.sellerAmount ||
          0
      );

      const sellerName =
        payout.sellerName ||
        "Unknown Seller";

      const confirmed = window.confirm(
        `Release ${formatMoney(
          payoutAmount
        )} to ${sellerName}?\n\nOrder: #${
          payout.orderId
        }\nProject: ${
          payout.projectTitle ||
          "Untitled Project"
        }\nSeller: ${sellerName}\nSeller payout: ${formatMoney(
          payoutAmount
        )}\n\nThis will mark the payout as Released.`
      );

      if (!confirmed) {
        return;
      }

      setProcessingPayoutId(payoutId);
      setError("");

      const response = await fetch(
        `${API_URL}/admin/financials/payouts/${payoutId}/release`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result =
        await readResponse(response);

      if (response.status === 401) {
        sessionStorage.removeItem(
          "projecthub_token"
        );

        localStorage.removeItem(
          "projecthub_token"
        );

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to release seller payouts."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to release seller payout."
        );
      }

      await loadDashboard();
    } catch (err) {
      console.error(
        "Seller payout release error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to release seller payout."
      );
    } finally {
      setProcessingPayoutId(null);
    }
  };

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
        (item) => item.id === userId
      );

      if (!user) {
        return;
      }

      if (action === "toggle-status") {
        const confirmed = window.confirm(
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
        await readResponse(response);

      if (response.status === 401) {
        sessionStorage.removeItem(
          "projecthub_token"
        );

        localStorage.removeItem(
          "projecthub_token"
        );

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        throw new Error(
          "You do not have permission to manage users."
        );
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to update user."
        );
      }

      await loadDashboard();

      setExpandedUserId(null);
    } catch (err) {
      console.error(
        "User action error:",
        err
      );

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
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "—";
    }

    return parsedDate.toLocaleString(
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
    if (!name) {
      return "??";
    }

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formatMoney = (
    amount: number
  ) => {
    return `৳${Number(
      amount || 0
    ).toLocaleString("en-BD", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const financialStyles = `
    .ph-finance {
      width: 100%;
    }

    .ph-finance-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 28px;
    }

    .ph-finance-title p {
      max-width: 680px;
      margin: 10px 0 0;
      color: rgba(255,255,255,.58);
      line-height: 1.6;
    }

    .ph-commission {
      min-width: 150px;
      padding: 14px 18px;
      border: 1px solid rgba(255,255,255,.10);
      border-radius: 14px;
      background: rgba(255,255,255,.035);
      text-align: right;
    }

    .ph-commission span {
      display: block;
      font-size: 10px;
      letter-spacing: .13em;
      color: rgba(255,255,255,.42);
      margin-bottom: 4px;
    }

    .ph-commission strong {
      font-size: 25px;
      color: #fff;
    }

    .ph-money-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .ph-money-card {
      position: relative;
      min-height: 150px;
      padding: 22px;
      border: 1px solid rgba(255,255,255,.09);
      border-radius: 18px;
      background:
        linear-gradient(
          145deg,
          rgba(255,255,255,.055),
          rgba(255,255,255,.018)
        );
      overflow: hidden;
    }

    .ph-money-card::after {
      content: "";
      position: absolute;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      right: -35px;
      bottom: -40px;
      background: rgba(255,255,255,.025);
    }

    .ph-money-card.received {
      border-color: rgba(80,220,150,.18);
    }

    .ph-money-card.held {
      border-color: rgba(90,170,255,.18);
    }

    .ph-money-card.owed {
      border-color: rgba(255,190,80,.18);
    }

    .ph-money-card.earnings {
      border-color: rgba(190,110,255,.18);
    }

    .ph-money-label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: rgba(255,255,255,.45);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .13em;
    }

    .ph-money-icon {
      width: 30px;
      height: 30px;
      border-radius: 9px;
      display: grid;
      place-items: center;
      background: rgba(255,255,255,.055);
      color: rgba(255,255,255,.75);
      font-size: 14px;
    }

    .ph-money-value {
      display: block;
      margin-top: 22px;
      font-size: clamp(25px, 2.2vw, 34px);
      line-height: 1;
      letter-spacing: -.04em;
      color: #fff;
      font-weight: 800;
    }

    .ph-money-description {
      margin: 10px 0 0;
      color: rgba(255,255,255,.42);
      font-size: 12px;
    }

    .ph-finance-strip {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      margin-top: 14px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      overflow: hidden;
      background: rgba(255,255,255,.025);
    }

    .ph-strip-item {
      padding: 18px 20px;
      border-right: 1px solid rgba(255,255,255,.07);
    }

    .ph-strip-item:last-child {
      border-right: none;
    }

    .ph-strip-item span {
      display: block;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: .12em;
      color: rgba(255,255,255,.38);
      margin-bottom: 8px;
    }

    .ph-strip-item strong {
      display: block;
      font-size: 21px;
      color: #fff;
      margin-bottom: 4px;
    }

    .ph-strip-item small {
      color: rgba(255,255,255,.38);
      font-size: 11px;
    }

    .ph-finance-flow {
      margin-top: 28px;
      padding: 24px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      background: rgba(255,255,255,.025);
    }

    .ph-flow-heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .ph-flow-heading span {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .14em;
      color: rgba(255,255,255,.38);
    }

    .ph-flow-heading strong {
      font-size: 12px;
      color: rgba(255,255,255,.65);
    }

    .ph-flow-track {
      display: grid;
      grid-template-columns: 1fr 45px 1fr 45px 1fr 45px 1fr;
      align-items: center;
      gap: 0;
    }

    .ph-flow-step {
      min-height: 145px;
      padding: 20px;
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 16px;
      background: rgba(0,0,0,.16);
    }

    .ph-flow-number {
      display: inline-flex;
      width: 28px;
      height: 28px;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      background: rgba(255,255,255,.07);
      color: rgba(255,255,255,.65);
      font-size: 10px;
      font-weight: 800;
      margin-bottom: 18px;
    }

    .ph-flow-step strong {
      display: block;
      color: #fff;
      font-size: 15px;
      margin-bottom: 7px;
    }

    .ph-flow-step p {
      margin: 0;
      color: rgba(255,255,255,.40);
      font-size: 11px;
      line-height: 1.55;
    }

    .ph-flow-arrow {
      text-align: center;
      color: rgba(255,255,255,.25);
      font-size: 20px;
    }

    .ph-section-divider {
      height: 1px;
      background: rgba(255,255,255,.07);
      margin: 30px 0;
    }

    .ph-seller-panel {
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      overflow: hidden;
      background: rgba(255,255,255,.025);
    }

    .ph-seller-head,
    .ph-seller-row {
      display: grid;
      grid-template-columns: 2.1fr 1.1fr 1fr 1fr 1fr;
      align-items: center;
      gap: 15px;
    }

    .ph-seller-head {
      padding: 13px 20px;
      background: rgba(255,255,255,.035);
      border-bottom: 1px solid rgba(255,255,255,.07);
    }

    .ph-seller-head span {
      font-size: 9px;
      letter-spacing: .12em;
      color: rgba(255,255,255,.35);
      font-weight: 700;
    }

    .ph-seller-row {
      padding: 18px 20px;
      border-bottom: 1px solid rgba(255,255,255,.055);
      transition: background .2s ease;
    }

    .ph-seller-row:last-child {
      border-bottom: none;
    }

    .ph-seller-row:hover {
      background: rgba(255,255,255,.025);
    }

    .ph-seller {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .ph-avatar {
      width: 38px;
      height: 38px;
      flex: 0 0 38px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      background: rgba(255,255,255,.07);
      color: #fff;
      font-size: 11px;
      font-weight: 800;
    }

    .ph-seller-name {
      min-width: 0;
    }

    .ph-seller-name strong {
      display: block;
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ph-seller-name span {
      display: block;
      margin-top: 3px;
      color: rgba(255,255,255,.36);
      font-size: 11px;
    }

    .ph-seller-total strong {
      color: #fff;
      font-size: 16px;
    }

    .ph-seller-metric span {
      display: block;
      font-size: 9px;
      letter-spacing: .10em;
      color: rgba(255,255,255,.32);
      margin-bottom: 4px;
    }

    .ph-seller-metric strong {
      display: block;
      font-size: 13px;
      color: rgba(255,255,255,.78);
    }

    .ph-seller-metric small {
      display: block;
      margin-top: 3px;
      color: rgba(255,255,255,.32);
      font-size: 10px;
    }

    .ph-payout-panel {
      border: 1px solid rgba(255,255,255,.08);
      border-radius: 20px;
      overflow: hidden;
      background: rgba(255,255,255,.025);
    }

    .ph-payout-row {
      display: grid;
      grid-template-columns: .65fr 2.2fr 1fr 1fr 1fr 1.35fr;
      align-items: center;
      gap: 18px;
      padding: 17px 20px;
      border-bottom: 1px solid rgba(255,255,255,.055);
      transition: background .2s ease;
    }

    .ph-payout-row:last-child {
      border-bottom: none;
    }

    .ph-payout-row:hover {
      background: rgba(255,255,255,.025);
    }

    .ph-order span,
    .ph-payout-money span {
      display: block;
      font-size: 8px;
      font-weight: 700;
      letter-spacing: .11em;
      color: rgba(255,255,255,.32);
      margin-bottom: 5px;
    }

    .ph-order strong {
      color: #fff;
      font-size: 13px;
    }

    .ph-payout-project strong {
      display: block;
      color: #fff;
      font-size: 13px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ph-payout-project span {
      display: block;
      margin-top: 4px;
      color: rgba(255,255,255,.38);
      font-size: 10px;
    }

    .ph-payout-money strong {
      color: rgba(255,255,255,.78);
      font-size: 13px;
    }

    .ph-payout-money.seller strong {
      color: #fff;
      font-size: 15px;
    }

    .ph-status-area {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .ph-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: fit-content;
      min-width: 78px;
      padding: 7px 10px;
      border-radius: 999px;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: .05em;
    }

    .ph-status.waiting {
      color: #ffc76a;
      background: rgba(255,190,70,.09);
      border: 1px solid rgba(255,190,70,.15);
    }

    .ph-status.ready {
      color: #6fdcff;
      background: rgba(70,190,255,.09);
      border: 1px solid rgba(70,190,255,.15);
    }

    .ph-status.released {
      color: #71e3a5;
      background: rgba(70,220,140,.09);
      border: 1px solid rgba(70,220,140,.15);
    }

    .ph-release-button {
      border: 1px solid rgba(111,220,255,.28);
      background: rgba(70,190,255,.10);
      color: #73dcff;
      border-radius: 9px;
      padding: 8px 12px;
      font-size: 10px;
      font-weight: 800;
      cursor: pointer;
      transition:
        background .2s ease,
        border-color .2s ease,
        transform .2s ease;
    }

    .ph-release-button:hover:not(:disabled) {
      background: rgba(70,190,255,.17);
      border-color: rgba(111,220,255,.45);
      transform: translateY(-1px);
    }

    .ph-release-button:disabled {
      cursor: not-allowed;
      opacity: .55;
    }

    .ph-release-button.released {
      border-color: rgba(70,220,140,.15);
      background: rgba(70,220,140,.06);
      color: #71e3a5;
    }

    .ph-release-button.waiting {
      border-color: rgba(255,190,70,.12);
      background: rgba(255,190,70,.05);
      color: rgba(255,199,106,.65);
    }

    .ph-empty {
      padding: 48px 20px;
      text-align: center;
      color: rgba(255,255,255,.4);
    }

    .ph-empty-icon {
      width: 45px;
      height: 45px;
      margin: 0 auto 12px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      background: rgba(255,255,255,.05);
      color: rgba(255,255,255,.65);
    }

    .ph-empty strong {
      display: block;
      color: rgba(255,255,255,.8);
      font-size: 14px;
      margin-bottom: 5px;
    }

    .ph-empty p {
      margin: 0;
      font-size: 11px;
    }

    @media (max-width: 1050px) {
      .ph-money-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .ph-finance-strip {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .ph-strip-item:nth-child(2) {
        border-right: none;
      }

      .ph-strip-item:nth-child(-n+2) {
        border-bottom: 1px solid rgba(255,255,255,.07);
      }

      .ph-flow-track {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .ph-flow-arrow {
        transform: rotate(90deg);
      }

      .ph-seller-panel,
      .ph-payout-panel {
        overflow-x: auto;
      }

      .ph-seller-head,
      .ph-seller-row {
        min-width: 850px;
      }

      .ph-payout-row {
        min-width: 1080px;
      }
    }

    @media (max-width: 650px) {
      .ph-finance-header {
        flex-direction: column;
      }

      .ph-commission {
        width: 100%;
        text-align: left;
      }

      .ph-money-grid {
        grid-template-columns: 1fr;
      }

      .ph-finance-strip {
        grid-template-columns: 1fr;
      }

      .ph-strip-item {
        border-right: none !important;
        border-bottom: 1px solid rgba(255,255,255,.07);
      }

      .ph-strip-item:last-child {
        border-bottom: none;
      }

      .ph-finance-flow {
        padding: 16px;
      }
    }
  `;

  if (loading) {
    return (
      <div className="admin-page">
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span>PROJECT</span>
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
              Loading admin control center...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <style>{financialStyles}</style>

      {/* =========================
          SIDEBAR
      ========================== */}

      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>PROJECT</span>
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

            <span>Overview</span>
          </a>

          <a
            href="#admin-finance"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              ৳
            </span>

            <span>Finance</span>

            {financialSummary &&
              financialSummary.readyToReleaseCount >
                0 && (
                <span className="admin-nav-count">
                  {
                    financialSummary.readyToReleaseCount
                  }
                </span>
              )}
          </a>

          <a
            href="#admin-payments"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              $
            </span>

            <span>Payments</span>

            {pendingPayments.length > 0 && (
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

            <span>Projects</span>

            {pendingProjects.length > 0 && (
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

            <span>Orders</span>

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

            <span>Users</span>
          </a>

          <a
            href="#admin-disputes"
            className="admin-nav-item"
          >
            <span className="admin-nav-icon">
              !
            </span>

            <span>Disputes</span>

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
        <header className="admin-header">
          <div>
            <span className="admin-eyebrow">
              PROJECTHUB / ADMIN
            </span>

            <h1>Control Center</h1>

            <p>
              Manage marketplace activity,
              members, projects, payments
              and platform finances.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="admin-refresh-button"
              onClick={loadDashboard}
              disabled={loading}
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
            <strong>Error</strong>

            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
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
                <span>USERS</span>

                <span className="admin-stat-icon">
                  ◎
                </span>
              </div>

              <strong>{users.length}</strong>

              <p>Registered members</p>
            </div>

            <div className="admin-stat-card">
              <div className="admin-stat-top">
                <span>PROJECTS</span>

                <span className="admin-stat-icon">
                  □
                </span>
              </div>

              <strong>{totalProjects}</strong>

              <p>Marketplace listings</p>
            </div>

            <div className="admin-stat-card warning">
              <div className="admin-stat-top">
                <span>PAYMENTS</span>

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
                <span>PROJECT REVIEW</span>

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

        {/* =====================================================
            FINANCIAL CONTROL
        ====================================================== */}

        <section
          className="admin-section"
          id="admin-finance"
        >
          <div className="ph-finance">
            <div className="ph-finance-header">
              <div className="ph-finance-title">
                <span className="admin-section-label">
                  FINANCIAL CONTROL
                </span>

                <h2>Finance Center</h2>

                <p>
                  A clear view of ProjectHub money:
                  received from buyers, protected
                  for active orders, owed to sellers
                  and earned by the platform.
                </p>
              </div>

              {financialSummary && (
                <div className="ph-commission">
                  <span>
                    PLATFORM COMMISSION
                  </span>

                  <strong>
                    {financialSummary.commissionRate}%
                  </strong>
                </div>
              )}
            </div>

            <div className="ph-money-grid">
              <div className="ph-money-card received">
                <div className="ph-money-label">
                  <span>TOTAL RECEIVED</span>

                  <div className="ph-money-icon">
                    ↓
                  </div>
                </div>

                <strong className="ph-money-value">
                  {formatMoney(
                    financialSummary?.totalReceived ||
                      0
                  )}
                </strong>

                <p className="ph-money-description">
                  Verified buyer payments
                </p>
              </div>

              <div className="ph-money-card held">
                <div className="ph-money-label">
                  <span>MONEY HELD</span>

                  <div className="ph-money-icon">
                    ◉
                  </div>
                </div>

                <strong className="ph-money-value">
                  {formatMoney(
                    financialSummary?.totalMoneyHeld ||
                      0
                  )}
                </strong>

                <p className="ph-money-description">
                  Protected funds for active orders
                </p>
              </div>

              <div className="ph-money-card owed">
                <div className="ph-money-label">
                  <span>SELLER LIABILITY</span>

                  <div className="ph-money-icon">
                    →
                  </div>
                </div>

                <strong className="ph-money-value">
                  {formatMoney(
                    financialSummary?.totalSellerAmount ||
                      0
                  )}
                </strong>

                <p className="ph-money-description">
                  Total amount owed to sellers
                </p>
              </div>

              <div className="ph-money-card earnings">
                <div className="ph-money-label">
                  <span>PLATFORM EARNINGS</span>

                  <div className="ph-money-icon">
                    +
                  </div>
                </div>

                <strong className="ph-money-value">
                  {formatMoney(
                    financialSummary?.platformEarnings ||
                      0
                  )}
                </strong>

                <p className="ph-money-description">
                  Commission from released orders
                </p>
              </div>
            </div>

            <div className="ph-finance-strip">
              <div className="ph-strip-item">
                <span>
                  PENDING VERIFICATION
                </span>

                <strong>
                  {formatMoney(
                    financialSummary?.pendingVerificationAmount ||
                      0
                  )}
                </strong>

                <small>
                  Awaiting admin verification
                </small>
              </div>

              <div className="ph-strip-item">
                <span>
                  WAITING FOR SELLER
                </span>

                <strong>
                  {formatMoney(
                    financialSummary?.waitingSellerAmount ||
                      0
                  )}
                </strong>

                <small>
                  Seller work in progress
                </small>
              </div>

              <div className="ph-strip-item">
                <span>
                  READY TO RELEASE
                </span>

                <strong>
                  {formatMoney(
                    financialSummary?.readySellerAmount ||
                      0
                  )}
                </strong>

                <small>
                  {financialSummary?.readyToReleaseCount ||
                    0} payout(s) ready
                </small>
              </div>

              <div className="ph-strip-item">
                <span>ALREADY RELEASED</span>

                <strong>
                  {formatMoney(
                    financialSummary?.releasedSellerAmount ||
                      0
                  )}
                </strong>

                <small>
                  {financialSummary?.releasedPayoutCount ||
                    0} payout(s) completed
                </small>
              </div>
            </div>

            <div className="ph-finance-flow">
              <div className="ph-flow-heading">
                <span>
                  TRANSACTION LIFECYCLE
                </span>

                <strong>
                  Buyer → ProjectHub → Seller
                </strong>
              </div>

              <div className="ph-flow-track">
                <div className="ph-flow-step">
                  <span className="ph-flow-number">
                    01
                  </span>

                  <strong>
                    Buyer Payment
                  </strong>

                  <p>
                    Buyer submits the full
                    project amount to ProjectHub.
                  </p>
                </div>

                <div className="ph-flow-arrow">
                  →
                </div>

                <div className="ph-flow-step">
                  <span className="ph-flow-number">
                    02
                  </span>

                  <strong>
                    Payment Held
                  </strong>

                  <p>
                    Admin verifies the payment
                    and ProjectHub protects
                    the funds.
                  </p>
                </div>

                <div className="ph-flow-arrow">
                  →
                </div>

                <div className="ph-flow-step">
                  <span className="ph-flow-number">
                    03
                  </span>

                  <strong>
                    Seller Completion
                  </strong>

                  <p>
                    Seller completes the work
                    and buyer confirms delivery.
                  </p>
                </div>

                <div className="ph-flow-arrow">
                  →
                </div>

                <div className="ph-flow-step">
                  <span className="ph-flow-number">
                    04
                  </span>

                  <strong>
                    Seller Release
                  </strong>

                  <p>
                    Admin releases the seller
                    amount while ProjectHub
                    keeps its commission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            SELLER LIABILITY
        ====================================================== */}

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-section-label">
                SELLER LIABILITY
              </span>

              <h2>Seller Payments</h2>

              <p>
                See exactly how much ProjectHub
                currently owes each seller.
              </p>
            </div>
          </div>

          {sellerFinancialSummary.length ===
          0 ? (
            <div className="ph-seller-panel">
              <div className="ph-empty">
                <div className="ph-empty-icon">
                  ৳
                </div>

                <strong>
                  No seller liabilities
                </strong>

                <p>
                  Seller payout information
                  will appear here when buyers
                  place orders.
                </p>
              </div>
            </div>
          ) : (
            <div className="ph-seller-panel">
              <div className="ph-seller-head">
                <span>SELLER</span>
                <span>TOTAL OWED</span>
                <span>WAITING</span>
                <span>READY</span>
                <span>RELEASED</span>
              </div>

              {sellerFinancialSummary.map(
                (seller) => (
                  <div
                    className="ph-seller-row"
                    key={seller.sellerId}
                  >
                    <div className="ph-seller">
                      <div className="ph-avatar">
                        {getInitials(
                          seller.sellerName
                        )}
                      </div>

                      <div className="ph-seller-name">
                        <strong>
                          {seller.sellerName}
                        </strong>

                        <span>
                          @{seller.sellerUsername}
                        </span>
                      </div>
                    </div>

                    <div className="ph-seller-total">
                      <strong>
                        {formatMoney(
                          seller.totalOwed
                        )}
                      </strong>
                    </div>

                    <div className="ph-seller-metric">
                      <span>
                        IN PROGRESS
                      </span>

                      <strong>
                        {formatMoney(
                          seller.waitingAmount
                        )}
                      </strong>

                      <small>
                        {seller.waitingOrders}{" "}
                        order(s)
                      </small>
                    </div>

                    <div className="ph-seller-metric">
                      <span>READY</span>

                      <strong>
                        {formatMoney(
                          seller.readyAmount
                        )}
                      </strong>

                      <small>
                        {seller.readyOrders}{" "}
                        order(s)
                      </small>
                    </div>

                    <div className="ph-seller-metric">
                      <span>PAID</span>

                      <strong>
                        {formatMoney(
                          seller.releasedAmount
                        )}
                      </strong>

                      <small>
                        {seller.releasedOrders}{" "}
                        order(s)
                      </small>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        {/* =====================================================
            PAYOUT TRACKING
        ====================================================== */}

        <section className="admin-section">
          <div className="admin-section-heading">
            <div>
              <span className="admin-section-label">
                PAYOUT TRACKING
              </span>

              <h2>
                Seller Payout Details
              </h2>

              <p>
                Review completed seller
                payouts and release ready
                payments.
              </p>
            </div>
          </div>

          {sellerPayouts.length === 0 ? (
            <div className="ph-payout-panel">
              <div className="ph-empty">
                <div className="ph-empty-icon">
                  →
                </div>

                <strong>
                  No payout records
                </strong>

                <p>
                  Payout records will be
                  created automatically for
                  verified orders.
                </p>
              </div>
            </div>
          ) : (
            <div className="ph-payout-panel">
              {sellerPayouts
                .slice(0, 10)
                .map((payout) => {
                  /*
                   * IMPORTANT:
                   * SellerPayout uses payoutStatus.
                   * There is NO payout.status field.
                   */
                  const payoutStatus =
                    String(
                      payout.payoutStatus ||
                        "Waiting"
                    )
                      .trim()
                      .toLowerCase();

                  const statusClass =
                    payoutStatus ===
                    "released"
                      ? "released"
                      : payoutStatus ===
                        "ready"
                      ? "ready"
                      : "waiting";

                  const displayStatus =
                    payout.payoutStatus ||
                    "Waiting";

                  const isReleasing =
                    processingPayoutId ===
                    payout.id;

                  const canRelease =
                    payoutStatus ===
                    "ready";

                  const payoutAmount =
                    Number(
                      payout.payoutAmount ||
                        payout.sellerAmount ||
                        0
                    );

                  return (
                    <div
                      className="ph-payout-row"
                      key={payout.id}
                    >
                      <div className="ph-order">
                        <span>ORDER</span>

                        <strong>
                          #{payout.orderId}
                        </strong>
                      </div>

                      <div className="ph-payout-project">
                        <strong>
                          {payout.projectTitle ||
                            "Untitled Project"}
                        </strong>

                        <span>
                          {payout.sellerName ||
                            "Unknown Seller"}
                          {" · "}
                          @
                          {payout.sellerUsername ||
                            "unknown"}
                        </span>
                      </div>

                      <div className="ph-payout-money">
                        <span>PLATFORM</span>

                        <strong>
                          {formatMoney(
                            payout.commissionAmount
                          )}
                        </strong>
                      </div>

                      <div className="ph-payout-money">
                        <span>
                          PROJECT VALUE
                        </span>

                        <strong>
                          {formatMoney(
                            payout.projectPrice
                          )}
                        </strong>
                      </div>

                      <div className="ph-payout-money seller">
                        <span>SELLER</span>

                        <strong>
                          {formatMoney(
                            payoutAmount
                          )}
                        </strong>
                      </div>

                      <div className="ph-status-area">
                        <span
                          className={`ph-status ${statusClass}`}
                        >
                          {displayStatus}
                        </span>

                        {canRelease && (
                          <button
                            type="button"
                            className="ph-release-button"
                            disabled={
                              isReleasing
                            }
                            onClick={() =>
                              handleReleasePayout(
                                payout.id
                              )
                            }
                          >
                            {isReleasing
                              ? "Releasing..."
                              : "Release Payment"}
                          </button>
                        )}

                        {payoutStatus ===
                          "waiting" && (
                          <button
                            type="button"
                            className="ph-release-button waiting"
                            disabled
                          >
                            Waiting for Completion
                          </button>
                        )}

                        {payoutStatus ===
                          "released" && (
                          <button
                            type="button"
                            className="ph-release-button released"
                            disabled
                          >
                            ✓ Released
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
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

              <h2>Member Overview</h2>
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
                <strong>Verified</strong>

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
                <strong>Sellers</strong>

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
                <strong>Buyers</strong>

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

              <h2>Admin Queue</h2>
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
                <span>PROJECTS</span>

                <strong>
                  {pendingProjects.length}
                </strong>

                <p>Need approval</p>
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
                <span>PAYMENTS</span>

                <strong>
                  {pendingPayments.length}
                </strong>

                <p>Need verification</p>
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
                <span>USERS</span>

                <strong>
                  {unverifiedUsers.length}
                </strong>

                <p>Need verification</p>
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
                <span>DISPUTES</span>

                <strong>—</strong>

                <p>Coming soon</p>
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

              <h2>Project Overview</h2>

              <p>
                Current status of seller project
                listings and marketplace
                moderation.
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
                <strong>Approved</strong>

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
                <strong>Hidden</strong>

                <small>
                  Currently unavailable
                </small>
              </div>
            </div>
          </div>

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
                PAYMENT VERIFICATION
              </span>

              <h2>
                Recent Pending Payments
              </h2>

              <p>
                Review submitted payments and
                confirm successful transactions.
              </p>
            </div>

            <Link
              to="/admin"
              className="admin-section-link"
            >
              Payment Center →
            </Link>
          </div>

          {pendingPayments.length === 0 ? (
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
                .map((payment) => {
                  const isProcessing =
                    processingPaymentId ===
                    payment.id;

                  return (
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

                        {payment.transactionId && (
                          <small>
                            TXN:{" "}
                            {payment.transactionId}
                          </small>
                        )}
                      </div>

                      <div className="admin-payment-method">
                        <span>METHOD</span>

                        <strong>
                          {payment.paymentMethod}
                        </strong>
                      </div>

                      <div className="admin-payment-amount">
                        <span>AMOUNT</span>

                        <strong>
                          {formatMoney(
                            payment.amount
                          )}
                        </strong>
                      </div>

                      <div className="admin-payment-status">
                        Pending
                      </div>

                      <div className="admin-payment-actions">
                        <button
                          type="button"
                          className="admin-payment-verify"
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            handlePaymentAction(
                              payment.id,
                              "verify"
                            )
                          }
                        >
                          {isProcessing
                            ? "Processing..."
                            : "✓ Verify"}
                        </button>

                        <button
                          type="button"
                          className="admin-payment-reject"
                          disabled={
                            isProcessing
                          }
                          onClick={() =>
                            handlePaymentAction(
                              payment.id,
                              "reject"
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
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

          <div className="admin-user-result-bar">
            <div className="admin-user-summary">
              <span>Showing</span>

              <strong>
                {userStart}–{userEnd}
              </strong>

              <span>of</span>

              <strong>
                {filteredUsers.length}
              </strong>

              <span>members</span>
            </div>

            {(userSearch ||
              userFilter !== "all") && (
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

          {paginatedUsers.length === 0 ? (
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
              {paginatedUsers.map((user) => {
                const isExpanded =
                  expandedUserId ===
                  user.id;

                const isAdmin =
                  String(
                    user.role || ""
                  ).toLowerCase() ===
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
                        <span>ROLE</span>

                        <strong>
                          {user.role || "—"}
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

                    {isExpanded && (
                      <div className="admin-user-expanded">
                        <div className="admin-user-expanded-grid">
                          <div className="admin-user-expanded-item">
                            <span>EMAIL</span>

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
                            <span>JOINED</span>

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
              })}
            </div>
          )}

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

              <h2>Orders</h2>

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
              <span>01</span>

              <div>
                <strong>
                  Project Approval
                </strong>

                <p>
                  Review and approve seller
                  listings.
                </p>
              </div>

              <b>ACTIVE</b>
            </div>

            <div className="admin-roadmap-item active">
              <span>02</span>

              <div>
                <strong>
                  Member Verification
                </strong>

                <p>
                  Verify and manage marketplace
                  members.
                </p>
              </div>

              <b>ACTIVE</b>
            </div>

            <div className="admin-roadmap-item active">
              <span>03</span>

              <div>
                <strong>
                  Payment Verification
                </strong>

                <p>
                  Review buyer payment
                  submissions.
                </p>
              </div>

              <b>ACTIVE</b>
            </div>

            <div className="admin-roadmap-item active">
              <span>04</span>

              <div>
                <strong>
                  Financial Management
                </strong>

                <p>
                  Track received funds, seller
                  liabilities and platform
                  earnings.
                </p>
              </div>

              <b>ACTIVE</b>
            </div>

            <div className="admin-roadmap-item active">
              <span>05</span>

              <div>
                <strong>
                  Seller Payouts
                </strong>

                <p>
                  Release completed seller
                  payments.
                </p>
              </div>

              <b>ACTIVE</b>
            </div>

            <div className="admin-roadmap-item">
              <span>06</span>

              <div>
                <strong>
                  Order Management
                </strong>

                <p>
                  Monitor active marketplace
                  transactions.
                </p>
              </div>

              <b>SOON</b>
            </div>

            <div className="admin-roadmap-item">
              <span>07</span>

              <div>
                <strong>
                  Dispute Center
                </strong>

                <p>
                  Handle buyer and seller
                  disputes.
                </p>
              </div>

              <b>SOON</b>
            </div>

            <div className="admin-roadmap-item">
              <span>08</span>

              <div>
                <strong>
                  Platform Analytics
                </strong>

                <p>
                  Revenue, activity and
                  marketplace insights.
                </p>
              </div>

              <b>SOON</b>
            </div>
          </div>
        </section>

        {/* =========================
            FOOTER
        ========================== */}

        <footer className="admin-footer">
          <span>
            PROJECTHUB ADMIN
          </span>

          <span>
            Marketplace Control Center
          </span>

          <span>v1.0</span>
        </footer>
      </main>
    </div>
  );
}

export default AdminDashboard;

