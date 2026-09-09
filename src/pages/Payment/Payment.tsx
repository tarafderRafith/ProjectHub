import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import { getOrderById } from "../../services/orderService";
import { submitPayment } from "../../services/paymentService";
import "./Payment.css";

function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<{
    id: number;
    projectId: number;
    projectTitle: string;
    projectPrice: number;
    status: string;
  } | null>(null);

  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        setLoading(true);
        setError("");

        if (!orderId) {
          throw new Error("Invalid order.");
        }

        const result = await getOrderById(
          Number(orderId)
        );

        setOrder({
          id: result.id,
          projectId: result.projectId,
          projectTitle: result.projectTitle,
          projectPrice: result.projectPrice,
          status: result.status,
        });
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

  const handleSubmitPayment = async () => {
    if (!order) {
      return;
    }

    if (!transactionId.trim()) {
      setError(
        "Please enter your bKash Transaction ID."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      await submitPayment({
        orderId: order.id,
        transactionId: transactionId.trim(),
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

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="payment-page">
          <div className="payment-container">
            <div className="payment-loading">
              Loading payment details...
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
              <span>!</span>

              <h1>Unable to load payment</h1>

              <p>{error}</p>

              <Link to="/orders">
                Back to Orders
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return null;
  }

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

              <h1>Payment submitted</h1>

              <p>
                Your bKash payment has been submitted
                successfully and is waiting for admin
                verification.
              </p>

              <div className="payment-success-details">
                <div>
                  <span>Order ID</span>
                  <strong>#{order.id}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    ৳{order.projectPrice.toLocaleString()}
                  </strong>
                </div>

                <div>
                  <span>Payment Method</span>
                  <strong>bKash</strong>
                </div>

                <div>
                  <span>Status</span>
                  <strong>Pending Verification</strong>
                </div>
              </div>

              <div className="payment-success-actions">
                <Button
                  size="large"
                  onClick={() =>
                    navigate("/orders")
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

            <h1>Complete your payment</h1>

            <p>
              Complete the bKash payment and submit your
              transaction ID for verification.
            </p>
          </div>

          <div className="payment-layout">
            <section className="payment-main-card">
              <div className="bkash-header">
                <div className="bkash-logo">
                  bKash
                </div>

                <span>Manual Payment</span>
              </div>

              <div className="payment-instruction">
                <span className="instruction-number">
                  01
                </span>

                <div>
                  <h3>Send the exact amount</h3>

                  <p>
                    Pay the amount shown below to the
                    ProjectHub bKash number.
                  </p>
                </div>
              </div>

              <div className="bkash-number-card">
                <span>bKash Number</span>

                <strong>01788151272</strong>

                <small>
                  Please make sure the number is correct
                  before sending the payment.
                </small>
              </div>

              <div className="amount-card">
                <span>Amount to pay</span>

                <strong>
                  ৳{order.projectPrice.toLocaleString()}
                </strong>
              </div>

              <div className="payment-instruction">
                <span className="instruction-number">
                  02
                </span>

                <div>
                  <h3>Complete your bKash payment</h3>

                  <p>
                    After completing the payment, keep
                    your bKash transaction ID.
                  </p>
                </div>
              </div>

              <div className="payment-instruction">
                <span className="instruction-number">
                  03
                </span>

                <div>
                  <h3>Enter your Transaction ID</h3>

                  <p>
                    Enter the transaction ID exactly as
                    shown in your bKash payment confirmation.
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
                    setTransactionId(
                      event.target.value
                    )
                  }
                  placeholder="Enter your bKash TrxID"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="payment-error">
                  {error}
                </div>
              )}

              <Button
                size="large"
                fullWidth
                onClick={handleSubmitPayment}
                disabled={submitting}
              >
                {submitting
                  ? "Submitting Payment..."
                  : "I've Completed Payment"}
              </Button>

              <div className="payment-security-note">
                <span>✓</span>

                <p>
                  Your payment will remain pending until
                  ProjectHub verifies the transaction.
                </p>
              </div>
            </section>

            <aside className="payment-summary-card">
              <span className="summary-label">
                ORDER SUMMARY
              </span>

              <h2>{order.projectTitle}</h2>

              <div className="summary-row">
                <span>Project price</span>

                <strong>
                  ৳{order.projectPrice.toLocaleString()}
                </strong>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total to pay</span>

                <strong>
                  ৳{order.projectPrice.toLocaleString()}
                </strong>
              </div>

              <div className="summary-protection">
                <span>✓</span>

                <div>
                  <strong>Payment protection</strong>

                  <p>
                    Payment remains pending until your
                    transaction is verified.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

export default Payment;