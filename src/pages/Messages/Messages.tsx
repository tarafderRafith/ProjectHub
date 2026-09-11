import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import "./Messages.css";

interface Conversation {
  id: number;
  orderId: number;
  projectId: number;
  projectTitle: string;

  buyerId: number;
  buyerName: string;
  buyerUsername: string;

  sellerId: number;
  sellerName: string;
  sellerUsername: string;

  updatedAt: string;
  createdAt: string;

  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
}

interface ConversationDetails {
  id: number;
  orderId: number;
  projectId: number;
  projectTitle: string;

  buyerId: number;
  buyerName: string;
  buyerUsername: string;

  sellerId: number;
  sellerName: string;
  sellerUsername: string;

  updatedAt: string;
  createdAt: string;

  messages: Message[];
}

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderUsername: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface AvailableOrder {
  orderId: number;
  projectId: number;
  projectTitle: string;
  buyerId: number;
  buyerName: string;
  buyerUsername: string;
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
  status: string;
  projectPrice: number;
  conversationExists: boolean;
}

interface CurrentUser {
  id?: number;
  userId?: number;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
}

const API_URL =
  "http://localhost:5038/api";

function Messages() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [availableOrders, setAvailableOrders] =
    useState<AvailableOrder[]>([]);

  const [selectedOrderId, setSelectedOrderId] =
    useState<number | null>(null);

  const [conversation, setConversation] =
    useState<ConversationDetails | null>(null);

  const [messageText, setMessageText] =
    useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingConversation, setLoadingConversation] =
    useState(false);

  const [startingConversation, setStartingConversation] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [error, setError] =
    useState("");

  const [conversationError, setConversationError] =
    useState("");

  // =========================================================
  // TOKEN
  // =========================================================

  const getToken = () => {
    return (
      localStorage.getItem(
        "projecthub_token"
      ) ||
      sessionStorage.getItem(
        "projecthub_token"
      )
    );
  };

  // =========================================================
  // API RESULT
  // =========================================================

  const getApiResult = async (
    response: Response
  ): Promise<any> => {
    try {
      return await response.json();
    } catch {
      return {};
    }
  };

  // =========================================================
  // LOAD CURRENT USER
  // =========================================================

  const loadCurrentUser = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/Users/me`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${token}`,
              Accept:
                "application/json",
            },
          }
        );

      const result =
        await getApiResult(
          response
        );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Unable to load your account."
        );
      }

      setUser(result);
    } catch (requestError) {
      console.error(
        "Failed to load current user:",
        requestError
      );

      localStorage.removeItem(
        "projecthub_token"
      );

      sessionStorage.removeItem(
        "projecthub_token"
      );

      navigate("/login");
    }
  };

  // =========================================================
  // USER ID
  // =========================================================

  const currentUserId =
    useMemo(() => {
      return Number(
        user?.id ??
          user?.userId ??
          0
      );
    }, [user]);

  // =========================================================
  // LOAD AVAILABLE ORDERS
  // =========================================================

  const loadAvailableOrders =
    async () => {
      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/messages/available-orders`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (!response.ok) {
          console.error(
            result?.message ||
              "Unable to load available orders."
          );

          return;
        }

        setAvailableOrders(
          Array.isArray(result)
            ? result
            : []
        );
      } catch (requestError) {
        console.error(
          "Failed to load available orders:",
          requestError
        );
      }
    };

  // =========================================================
  // LOAD CONVERSATIONS
  // =========================================================

  const loadConversations =
    async (
      keepSelected = true
    ) => {
      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoadingConversations(
          true
        );

        setError("");

        const response =
          await fetch(
            `${API_URL}/messages/conversations`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load conversations."
          );
        }

        const data:
          Conversation[] =
          Array.isArray(result)
            ? result
            : [];

        setConversations(data);

        await loadAvailableOrders();

        if (!keepSelected) {
          setSelectedOrderId(
            null
          );

          setConversation(null);

          return;
        }

        const queryOrderId =
          Number(
            searchParams.get(
              "orderId"
            ) || 0
          );

        if (
          queryOrderId > 0 &&
          data.some(
            (item) =>
              item.orderId ===
              queryOrderId
          )
        ) {
          setSelectedOrderId(
            queryOrderId
          );

          return;
        }

        if (
          selectedOrderId &&
          data.some(
            (item) =>
              item.orderId ===
              selectedOrderId
          )
        ) {
          return;
        }

        if (data.length > 0) {
          setSelectedOrderId(
            data[0].orderId
          );
        }
      } catch (requestError) {
        console.error(
          "Failed to load conversations:",
          requestError
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load conversations."
        );
      } finally {
        setLoadingConversations(
          false
        );
      }
    };

  // =========================================================
  // START CONVERSATION
  // =========================================================

  const handleStartConversation =
    async (
      orderId: number
    ) => {
      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setStartingConversation(
          true
        );

        setConversationError("");

        const response =
          await fetch(
            `${API_URL}/messages/conversations/${orderId}/start`,
            {
              method: "POST",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to start conversation."
          );
        }

        await loadConversations(
          true
        );

        setSelectedOrderId(
          orderId
        );

        navigate(
          `/messages?orderId=${orderId}`,
          {
            replace: true,
          }
        );
      } catch (requestError) {
        console.error(
          "Failed to start conversation:",
          requestError
        );

        setConversationError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to start conversation."
        );
      } finally {
        setStartingConversation(
          false
        );
      }
    };

  // =========================================================
  // LOAD SELECTED CONVERSATION
  // =========================================================

  const loadConversation =
    async (
      orderId: number
    ) => {
      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoadingConversation(
          true
        );

        setConversationError("");

        const response =
          await fetch(
            `${API_URL}/messages/conversations/${orderId}`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to load this conversation."
          );
        }

        setConversation(
          result
        );

        await markConversationAsRead(
          orderId,
          false
        );

        await loadConversationsAfterRead(
          orderId
        );
      } catch (requestError) {
        console.error(
          "Failed to load conversation:",
          requestError
        );

        setConversationError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load this conversation."
        );
      } finally {
        setLoadingConversation(
          false
        );
      }
    };

  // =========================================================
  // MARK AS READ
  // =========================================================

  const markConversationAsRead =
    async (
      orderId: number,
      showError = true
    ) => {
      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/messages/conversations/${orderId}/read`,
            {
              method: "PUT",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        if (
          !response.ok &&
          showError
        ) {
          const result =
            await getApiResult(
              response
            );

          console.error(
            result?.message ||
              "Unable to mark messages as read."
          );
        }
      } catch (requestError) {
        if (showError) {
          console.error(
            "Failed to mark messages as read:",
            requestError
          );
        }
      }
    };

  // =========================================================
  // REFRESH CONVERSATIONS
  // =========================================================

  const loadConversationsAfterRead =
    async (
      orderId: number
    ) => {
      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/messages/conversations`,
            {
              method: "GET",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                Accept:
                  "application/json",
              },
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (response.ok) {
          const data:
            Conversation[] =
            Array.isArray(result)
              ? result
              : [];

          setConversations(
            data
          );

          await loadAvailableOrders();

          const selectedExists =
            data.some(
              (item) =>
                item.orderId ===
                orderId
            );

          if (!selectedExists) {
            setSelectedOrderId(
              null
            );
          }
        }
      } catch (requestError) {
        console.error(
          "Failed to refresh conversations:",
          requestError
        );
      }
    };

  // =========================================================
  // SEND MESSAGE
  // =========================================================

  const handleSendMessage =
    async (
      event: FormEvent
    ) => {
      event.preventDefault();

      if (!selectedOrderId) {
        return;
      }

      const content =
        messageText.trim();

      if (!content) {
        return;
      }

      if (
        content.length >
        5000
      ) {
        setConversationError(
          "Message cannot be longer than 5000 characters."
        );

        return;
      }

      const token =
        getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setSendingMessage(
          true
        );

        setConversationError("");

        const response =
          await fetch(
            `${API_URL}/messages/conversations/${selectedOrderId}`,
            {
              method: "POST",
              headers: {
                Authorization:
                  `Bearer ${token}`,
                "Content-Type":
                  "application/json",
                Accept:
                  "application/json",
              },
              body:
                JSON.stringify({
                  content,
                }),
            }
          );

        const result =
          await getApiResult(
            response
          );

        if (!response.ok) {
          throw new Error(
            result?.message ||
              "Unable to send message."
          );
        }

        const sentMessage =
          result?.data;

        if (sentMessage) {
          setConversation(
            (current) => {
              if (!current) {
                return current;
              }

              return {
                ...current,

                updatedAt:
                  sentMessage.createdAt ||
                  new Date().toISOString(),

                messages: [
                  ...current.messages,
                  sentMessage,
                ],
              };
            }
          );
        } else {
          await loadConversation(
            selectedOrderId
          );
        }

        setMessageText("");

        await loadConversationsAfterRead(
          selectedOrderId
        );
      } catch (requestError) {
        console.error(
          "Failed to send message:",
          requestError
        );

        setConversationError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to send message."
        );
      } finally {
        setSendingMessage(
          false
        );
      }
    };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    loadConversations();
  }, []);

  // =========================================================
  // LOAD SELECTED CONVERSATION
  // =========================================================

  useEffect(() => {
    if (!selectedOrderId) {
      setConversation(null);
      return;
    }

    loadConversation(
      selectedOrderId
    );
  }, [selectedOrderId]);

  // =========================================================
  // SELECT CONVERSATION
  // =========================================================

  const handleSelectConversation =
    (
      orderId: number
    ) => {
      setSelectedOrderId(
        orderId
      );

      setConversationError("");

      navigate(
        `/messages?orderId=${orderId}`,
        {
          replace: true,
        }
      );
    };

  // =========================================================
  // OTHER PARTICIPANT
  // =========================================================

  const getOtherParticipant =
    () => {
      if (!conversation) {
        return {
          name: "Conversation",
          username: "",
          role: "",
        };
      }

      if (
        currentUserId ===
        conversation.sellerId
      ) {
        return {
          name:
            conversation.buyerName,

          username:
            conversation.buyerUsername,

          role: "Buyer",
        };
      }

      return {
        name:
          conversation.sellerName,

        username:
          conversation.sellerUsername,

        role: "Seller",
      };
    };

  const otherParticipant =
    getOtherParticipant();

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatConversationTime =
    (
      value: string | null
    ) => {
      if (!value) {
        return "";
      }

      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "";
      }

      return date.toLocaleDateString(
        undefined,
        {
          month: "short",
          day: "numeric",
        }
      );
    };

  const formatMessageTime =
    (
      value: string
    ) => {
      const date =
        new Date(value);

      if (
        Number.isNaN(
          date.getTime()
        )
      ) {
        return "";
      }

      return date.toLocaleString(
        undefined,
        {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
    };

  // =========================================================
  // AVATAR
  // =========================================================

  const getInitial =
    (
      name: string
    ) => {
      return (
        name
          ?.charAt(0)
          ?.toUpperCase() ||
        "U"
      );
    };

  // =========================================================
  // UNREAD
  // =========================================================

  const totalUnread =
    conversations.reduce(
      (
        total,
        item
      ) =>
        total +
        Number(
          item.unreadCount ||
            0
        ),
      0
    );

  // =========================================================
  // AVAILABLE ORDERS WITHOUT CHAT
  // =========================================================

  const ordersWithoutConversation =
    availableOrders.filter(
      (order) =>
        !order.conversationExists &&
        !conversations.some(
          (conversationItem) =>
            conversationItem.orderId ===
            order.orderId
        )
    );

  // =========================================================
  // LOADING
  // =========================================================

  if (
    loadingConversations
  ) {
    return (
      <main className="messages-page">
        <div className="messages-shell">
          <div className="messages-loading">
            <div className="messages-loading-icon">
              ◌
            </div>

            <h2>
              Loading messages...
            </h2>

            <p>
              Please wait while we load
              your conversations.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="messages-page">
      <div className="messages-shell">

        {/* HEADER */}

        <header className="messages-header">
          <div>
            <Link
              to="/dashboard"
              className="messages-back-link"
            >
              ← Dashboard
            </Link>

            <span className="messages-eyebrow">
              PROJECTHUB COMMUNICATION
            </span>

            <h1>
              Messages
            </h1>

            <p>
              Private conversations between
              buyers and sellers for active
              orders.
            </p>
          </div>

          <div className="messages-header-actions">
            {totalUnread > 0 && (
              <div className="messages-unread-badge">
                {totalUnread} unread
              </div>
            )}

            <Link
              to="/projects"
              className="messages-browse-button"
            >
              Browse Projects
            </Link>
          </div>
        </header>

        {/* ERROR */}

        {error && (
          <div className="messages-error">
            <strong>
              Unable to load messages
            </strong>

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={() =>
                loadConversations(
                  false
                )
              }
            >
              Try Again
            </button>
          </div>
        )}

        {/* MAIN CHAT */}

        <section className="messages-container">

          {/* SIDEBAR */}

          <aside className="messages-sidebar">

            <div className="messages-sidebar-header">
              <div>
                <span>
                  YOUR ORDERS
                </span>

                <h2>
                  Conversations
                </h2>
              </div>

              <div className="messages-count">
                {conversations.length}
              </div>
            </div>

            {/* EXISTING CONVERSATIONS */}

            {conversations.length >
            0 && (
              <div className="conversation-list">
                {conversations.map(
                  (item) => {
                    const isSelected =
                      selectedOrderId ===
                      item.orderId;

                    const otherName =
                      currentUserId ===
                      item.sellerId
                        ? item.buyerName
                        : item.sellerName;

                    return (
                      <button
                        key={
                          item.orderId
                        }
                        type="button"
                        className={`conversation-item ${
                          isSelected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleSelectConversation(
                            item.orderId
                          )
                        }
                      >
                        <div className="conversation-avatar">
                          {getInitial(
                            otherName
                          )}
                        </div>

                        <div className="conversation-content">
                          <div className="conversation-top">
                            <strong>
                              {otherName}
                            </strong>

                            <span>
                              {formatConversationTime(
                                item.lastMessageAt ||
                                  item.updatedAt
                              )}
                            </span>
                          </div>

                          <div className="conversation-project">
                            Order #
                            {
                              item.orderId
                            }{" "}
                            ·{" "}
                            {
                              item.projectTitle
                            }
                          </div>

                          <div className="conversation-preview">
                            {item.lastMessage ||
                              "Start the conversation..."}
                          </div>
                        </div>

                        {item.unreadCount >
                          0 && (
                          <span className="conversation-unread">
                            {item.unreadCount >
                            99
                              ? "99+"
                              : item.unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            )}

            {/* ORDERS WITHOUT CONVERSATION */}

            {ordersWithoutConversation.length >
              0 && (
              <div className="messages-start-section">

                <div className="messages-start-heading">
                  <span>
                    AVAILABLE ORDERS
                  </span>

                  <h3>
                    Start a conversation
                  </h3>
                </div>

                {ordersWithoutConversation.map(
                  (order) => (
                    <div
                      key={
                        order.orderId
                      }
                      className="messages-start-card"
                    >
                      <div className="messages-start-avatar">
                        {getInitial(
                          currentUserId ===
                            order.sellerId
                            ? order.buyerName
                            : order.sellerName
                        )}
                      </div>

                      <div className="messages-start-info">
                        <strong>
                          {order.projectTitle}
                        </strong>

                        <span>
                          Order #
                          {
                            order.orderId
                          }
                        </span>

                        <small>
                          {currentUserId ===
                          order.sellerId
                            ? `Buyer: ${order.buyerName}`
                            : `Seller: ${order.sellerName}`}
                        </small>

                        <button
                          type="button"
                          className="messages-start-button"
                          disabled={
                            startingConversation
                          }
                          onClick={() =>
                            handleStartConversation(
                              order.orderId
                            )
                          }
                        >
                          {startingConversation
                            ? "Starting..."
                            : "Start Conversation →"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* NOTHING */}

            {conversations.length ===
              0 &&
              ordersWithoutConversation.length ===
                0 && (
                <div className="messages-empty-list">
                  <div className="messages-empty-icon">
                    ▱
                  </div>

                  <h3>
                    No conversations yet
                  </h3>

                  <p>
                    Conversations become available
                    after a buyer's payment is
                    verified and the order enters
                    Payment Held.
                  </p>

                  <Link
                    to="/projects"
                    className="messages-empty-link"
                  >
                    Explore Projects →
                  </Link>
                </div>
              )}
          </aside>

          {/* CHAT AREA */}

          <section className="messages-chat">

            {!selectedOrderId ? (
              <div className="messages-chat-empty">
                <div className="messages-chat-empty-icon">
                  ◇
                </div>

                <h2>
                  Select a conversation
                </h2>

                <p>
                  Choose an order from the
                  left to view your messages.
                </p>
              </div>
            ) : loadingConversation ? (
              <div className="messages-chat-empty">
                <div className="messages-chat-empty-icon">
                  ◌
                </div>

                <h2>
                  Loading conversation...
                </h2>

                <p>
                  Please wait while we load
                  your messages.
                </p>
              </div>
            ) : conversationError ? (
              <div className="messages-chat-empty">
                <div className="messages-chat-empty-icon error">
                  !
                </div>

                <h2>
                  Unable to open conversation
                </h2>

                <p>
                  {conversationError}
                </p>

                <button
                  type="button"
                  className="messages-retry-button"
                  onClick={() =>
                    selectedOrderId &&
                    loadConversation(
                      selectedOrderId
                    )
                  }
                >
                  Try Again
                </button>
              </div>
            ) : conversation ? (
              <>
                {/* CHAT HEADER */}

                <div className="messages-chat-header">
                  <div className="chat-person">
                    <div className="chat-person-avatar">
                      {getInitial(
                        otherParticipant.name
                      )}
                    </div>

                    <div>
                      <h2>
                        {
                          otherParticipant.name
                        }
                      </h2>

                      <p>
                        @
                        {
                          otherParticipant.username
                        }{" "}
                        ·{" "}
                        {
                          otherParticipant.role
                        }
                      </p>
                    </div>
                  </div>

                  <div className="chat-order-info">
                    <span>
                      ORDER
                    </span>

                    <strong>
                      #
                      {
                        conversation.orderId
                      }
                    </strong>

                    <Link
                      to={`/projects/${conversation.projectId}`}
                    >
                      View Project
                    </Link>
                  </div>
                </div>

                {/* PROJECT BAR */}

                <div className="messages-project-bar">
                  <div>
                    <span>
                      PROJECT
                    </span>

                    <strong>
                      {
                        conversation.projectTitle
                      }
                    </strong>
                  </div>

                  <span className="messages-private-badge">
                    🔒 Private
                  </span>
                </div>

                {/* MESSAGES */}

                <div
                  className="messages-list"
                  aria-live="polite"
                >
                  {conversation.messages.length ===
                  0 ? (
                    <div className="messages-first-message">
                      <div className="messages-first-icon">
                        ✦
                      </div>

                      <h3>
                        Start the conversation
                      </h3>

                      <p>
                        Discuss requirements,
                        project progress, revisions,
                        delivery details, or anything
                        related to this order.
                      </p>
                    </div>
                  ) : (
                    conversation.messages.map(
                      (message) => {
                        const isMine =
                          Number(
                            message.senderId
                          ) ===
                          currentUserId;

                        return (
                          <div
                            key={
                              message.id
                            }
                            className={`message-row ${
                              isMine
                                ? "mine"
                                : "theirs"
                            }`}
                          >
                            {!isMine && (
                              <div className="message-avatar">
                                {getInitial(
                                  message.senderName
                                )}
                              </div>
                            )}

                            <div className="message-bubble-wrapper">
                              <div className="message-sender">
                                {isMine
                                  ? "You"
                                  : message.senderName}
                              </div>

                              <div className="message-bubble">
                                {
                                  message.content
                                }
                              </div>

                              <div className="message-time">
                                {formatMessageTime(
                                  message.createdAt
                                )}

                                {isMine &&
                                  message.isRead && (
                                  <span>
                                    · Read
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )
                  )}
                </div>

                {/* COMPOSER */}

                <form
                  className="message-composer"
                  onSubmit={
                    handleSendMessage
                  }
                >
                  <div className="composer-input-wrap">
                    <textarea
                      value={
                        messageText
                      }
                      onChange={(
                        event
                      ) =>
                        setMessageText(
                          event.target
                            .value
                        )
                      }
                      placeholder="Write a message about this order..."
                      rows={2}
                      maxLength={
                        5000
                      }
                      disabled={
                        sendingMessage
                      }
                    />

                    <div className="composer-counter">
                      {
                        messageText.length
                      }
                      /5000
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="send-message-button"
                    disabled={
                      sendingMessage ||
                      !messageText.trim()
                    }
                  >
                    {sendingMessage
                      ? "Sending..."
                      : "Send Message →"}
                  </button>
                </form>

                <div className="messages-security-note">
                  <span>
                    🔒
                  </span>

                  <p>
                    Keep order-related
                    communication here so
                    ProjectHub can protect the
                    transaction and support
                    disputes if needed.
                  </p>
                </div>
              </>
            ) : null}
          </section>
        </section>
      </div>
    </main>
  );
}

export default Messages;