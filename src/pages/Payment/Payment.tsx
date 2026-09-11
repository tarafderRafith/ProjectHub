
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import { getOrderById } from "../../services/orderService";
import { submitPayment } from "../../services/paymentService";
import "./Payment.css";

interface PaymentOrder {
  id: number;
  projectId: number;
  projectTitle: string;
  projectPrice: number;
  status: string;
}

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState<PaymentOrder | null>(null);

  const [transactionId, setTransactionId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        if (!orderId) {
          throw new Error("Invalid order.");
        }

        const numericOrderId =
          Number(orderId);

        if (
          !Number.isInteger(numericOrderId) ||
          numericOrderId <= 0
        ) {
          throw new Error("Invalid order ID.");
        }

        const result =
          await getOrderById(numericOrderId);

        setOrder({
          id: result.id,
          projectId: result.projectId,
          projectTitle: result.projectTitle,
          projectPrice: result.projectPrice,
          status: result.status,
        });

        /*
          If the order already has a payment-related
          status, don't show the payment form again.
        */
        const normalizedStatus =
          String(result.status || "")
            .trim()
            .toLowerCase();

        if (
          normalizedStatus ===
            "payment submitted" ||
          normalizedStatus ===
            "pending verification" ||
          normalizedStatus ===
            "payment held" ||
          normalizedStatus ===
            "completed"
        ) {
          setSuccess(true);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the order."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleTransactionChange = (
    value: string
  ) => {
    /*
      Remove accidental spaces at the beginning
      and end while typing.
    */
    setTransactionId(value);
    setError("");
  };

  const handleSubmitPayment = async () => {
    if (!order) {
      return;
    }

    const cleanedTransactionId =
      transactionId.trim();

    if (!cleanedTransactionId) {
      setError(
        "Please enter your bKash Transaction ID."
      );
      return;
    }

    if (cleanedTransactionId.length < 5) {
      setError(
        "Please enter a valid bKash Transaction ID."
      );
      return;
    }

    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await submitPayment({
        orderId: order.id,
        transactionId:
          cleanedTransactionId,
      });

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to submit your payment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackToOrders = () => {
    navigate("/orders");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">
            <div className="payment-loading">
              <div className="payment-loading-icon">
                ◌
              </div>

              <h2>
                Loading payment details...
              </h2>

              <p>
                Please wait while we load your
                order information.
              </p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">
            <div className="payment-error-card">
              <div className="payment-error-icon">
                !
              </div>

              <span className="payment-step">
                PAYMENT ERROR
              </span>

              <h1>
                Unable to load payment
              </h1>

              <p>{error}</p>

              <div className="payment-error-actions">
                <Button
                  size="large"
                  onClick={
                    handleBackToOrders
                  }
                >
                  Back to Orders
                </Button>

                <Link
                  to="/projects"
                  className="payment-back-link"
                >
                  Browse Projects
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return null;
  }

  /*
    =========================
    PAYMENT SUCCESS
    =========================
  */

  if (success) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">
            <div className="payment-success-card">
              <div className="payment-success-icon">
                ✓
              </div>

              <span className="payment-step">
                PAYMENT SUBMITTED
              </span>

              <h1>
                Payment submitted
              </h1>

              <p>
                Your bKash payment has been
                submitted successfully. ProjectHub
                will verify the transaction before
                the order moves forward.
              </p>

              <div className="payment-progress">
                <div className="payment-progress-item active">
                  <span>✓</span>

                  <div>
                    <strong>
                      Payment Submitted
                    </strong>

                    <small>
                      Transaction received
                    </small>
                  </div>
                </div>

                <div className="payment-progress-line"></div>

                <div className="payment-progress-item">
                  <span>02</span>

                  <div>
                    <strong>
                      Verification
                    </strong>

                    <small>
                      ProjectHub checks payment
                    </small>
                  </div>
                </div>

                <div className="payment-progress-line"></div>

                <div className="payment-progress-item">
                  <span>03</span>

                  <div>
                    <strong>
                      Payment Held
                    </strong>

                    <small>
                      Order can move forward
                    </small>
                  </div>
                </div>
              </div>

              <div className="payment-success-details">
                <div>
                  <span>Order ID</span>

                  <strong>
                    #{order.id}
                  </strong>
                </div>

                <div>
                  <span>Project</span>

                  <strong>
                    {order.projectTitle}
                  </strong>
                </div>

                <div>
                  <span>Amount</span>

                  <strong>
                    ৳
                    {order.projectPrice.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>

                  <strong>
                    bKash
                  </strong>
                </div>

                <div>
                  <span>Status</span>

                  <strong>
                    Pending Verification
                  </strong>
                </div>
              </div>

              <div className="payment-success-notice">
                <span>✓</span>

                <div>
                  <strong>
                    What happens next?
                  </strong>

                  <p>
                    After the payment is verified,
                    your order can move to the next
                    stage and the protected buyer
                    and seller workflow will continue.
                  </p>
                </div>
              </div>

              <div className="payment-success-actions">
                <Button
                  size="large"
                  onClick={
                    handleBackToOrders
                  }
                >
                  View My Orders
                </Button>

                <Link
                  to={`/projects/${order.projectId}`}
                  className="payment-back-link"
                >
                  Back to Project
                </Link>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  /*
    =========================
    PAYMENT FORM
    =========================
  */

  return (
    <>
      <Navbar />

      <main className="payment-page">
        <div className="payment-container">
          <Link
            to="/orders"
            className="payment-back"
          >
            ← Back to Orders
          </Link>

          <div className="payment-header">
            <span className="payment-step">
              SECURE PAYMENT
            </span>

            <h1>
              Complete your payment
            </h1>

            <p>
              Pay through bKash and submit your
              transaction ID. Your payment will be
              verified before the order continues.
            </p>
          </div>

          <div className="payment-layout">
            <section className="payment-main-card">
              {/* =========================
                  BKASH HEADER
              ========================= */}

              <div className="bkash-header">
                <div className="bkash-logo">
                  bKash
                </div>

                <div className="bkash-method">
                  <strong>
                    Manual Payment
                  </strong>

                  <span>
                    Secure transaction submission
                  </span>
                </div>
              </div>

              {/* =========================
                  STEP 01
              ========================= */}

              <div className="payment-instruction">
                <span className="instruction-number">
                  01
                </span>

                <div>
                  <h3>
                    Send the exact amount
                  </h3>

                  <p>
                    Send the exact project price to
                    the ProjectHub bKash number below.
                  </p>
                </div>
              </div>

              <div className="bkash-number-card">
                <div>
                  <span>
                    ProjectHub bKash Number
                  </span>

                  <strong>
                    01788151272
                  </strong>
                </div>

                <div className="bkash-number-badge">
                  bKash
                </div>

                <small>
                  Double-check the number before
                  confirming your bKash payment.
                </small>
              </div>

              {/* =========================
                  AMOUNT
              ========================= */}

              <div className="amount-card">
                <div>
                  <span>
                    Amount to pay
                  </span>

                  <small>
                    Order #{order.id}
                  </small>
                </div>

                <strong>
                  ৳
                  {order.projectPrice.toLocaleString()}
                </strong>
              </div>

              {/* =========================
                  STEP 02
              ========================= */}

              <div className="payment-instruction">
                <span className="instruction-number">
                  02
                </span>

                <div>
                  <h3>
                    Complete your bKash payment
                  </h3>

                  <p>
                    Complete the payment from your
                    bKash account and keep the
                    transaction confirmation.
                  </p>
                </div>
              </div>

              <div className="payment-tip">
                <span>i</span>

                <p>
                  Make sure the amount you send
                  matches the amount shown above.
                </p>
              </div>

              {/* =========================
                  STEP 03
              ========================= */}

              <div className="payment-instruction">
                <span className="instruction-number">
                  03
                </span>

                <div>
                  <h3>
                    Enter your Transaction ID
                  </h3>

                  <p>
                    Enter the transaction ID exactly
                    as shown in your bKash payment
                    confirmation.
                  </p>
                </div>
              </div>

              <div className="transaction-field">
                <label htmlFor="transactionId">
                  bKash Transaction ID
                </label>

                <input
                  id="transactionId"
                  type="text"
                  value={transactionId}
                  onChange={(event) =>
                    handleTransactionChange(
                      event.target.value
                    )
                  }
                  placeholder="Enter your bKash TrxID"
                  autoComplete="off"
                  disabled={submitting}
                />

                <div className="transaction-field-info">
                  <span>
                    Transaction ID
                  </span>

                  <span>
                    {transactionId.length} characters
                  </span>
                </div>
              </div>

              {error && (
                <div
                  className="payment-error"
                  role="alert"
                >
                  <span>!</span>

                  <p>{error}</p>
                </div>
              )}

              <Button
                size="large"
                fullWidth
                onClick={
                  handleSubmitPayment
                }
                disabled={
                  submitting ||
                  !transactionId.trim()
                }
              >
                {submitting
                  ? "Submitting Payment..."
                  : "I've Completed Payment"}
              </Button>

              <div className="payment-security-note">
                <span>✓</span>

                <p>
                  Your payment stays pending until
                  ProjectHub verifies the submitted
                  transaction.
                </p>
              </div>
            </section>

            {/* =========================
                ORDER SUMMARY
            ========================= */}

            <aside className="payment-summary-card">
              <span className="summary-label">
                ORDER SUMMARY
              </span>

              <h2>
                {order.projectTitle}
              </h2>

              <div className="summary-order-id">
                Order #{order.id}
              </div>

              <div className="summary-row">
                <span>
                  Project price
                </span>

                <strong>
                  ৳
                  {order.projectPrice.toLocaleString()}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>
                  Total to pay
                </span>

                <strong>
                  ৳
                  {order.projectPrice.toLocaleString()}
                </strong>
              </div>

              <div className="summary-protection">
                <span>✓</span>

                <div>
                  <strong>
                    Payment protection
                  </strong>

                  <p>
                    Payment remains pending until
                    the transaction is verified.
                  </p>
                </div>
              </div>

              <div className="summary-flow">
                <div className="summary-flow-item active">
                  <span>01</span>

                  <p>
                    Payment submitted
                  </p>
                </div>

                <div className="summary-flow-item">
                  <span>02</span>

                  <p>
                    Payment verified
                  </p>
                </div>

                <div className="summary-flow-item">
                  <span>03</span>

                  <p>
                    Order continues
                  </p>
                </div>
              </div>

              <Link
                to={`/projects/${order.projectId}`}
                className="summary-project-link"
              >
                View Project →
              </Link>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default Payment;

