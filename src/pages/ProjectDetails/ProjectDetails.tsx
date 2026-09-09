import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import { createOrder } from "../../services/orderService";
import "./ProjectDetails.css";

interface ApiProject {
  id: number;
  category: string;
  title: string;
  description: string;
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
  sellerName: string;
  sellerUsername: string;
  sellerEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface Project {
  id: number;
  category: string;
  title: string;
  description: string;
  technologies: string[];
  price: number;
  rating: number;
  reviews: number;
  sellerName: string;
  sellerInitial: string;
  sellerLevel: string;
  deliveryTime: string;
  features: string[];
  deliverables: string[];
  course: string;
  university: string;
}

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [purchasing, setPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState("");
  const [purchaseSuccess, setPurchaseSuccess] = useState<{
    orderId: number;
  } | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5038/api/Projects/${id}`
        );

        const result: ApiProject | { message?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "message" in result && result.message
              ? result.message
              : "Unable to load project."
          );
        }

        const apiProject = result as ApiProject;

        const technologies = apiProject.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(
            (technology) => technology.length > 0
          );

        const deliverables = apiProject.deliverables
          .split(",")
          .map((deliverable) => deliverable.trim())
          .filter(
            (deliverable) => deliverable.length > 0
          );

        const sellerName =
          apiProject.sellerName || "ProjectHub Seller";

        const formattedProject: Project = {
          id: apiProject.id,
          category: apiProject.category,
          title: apiProject.title,
          description: apiProject.description,
          technologies,
          price: apiProject.price,
          rating: 0,
          reviews: 0,
          sellerName,
          sellerInitial: sellerName
            .charAt(0)
            .toUpperCase(),
          sellerLevel: "Verified Seller",
          deliveryTime: `${apiProject.deliveryDays} ${
            apiProject.deliveryDays === 1
              ? "day"
              : "days"
          }`,
          features: [
            "Complete project functionality",
            "Source code",
            "Database integration",
            "Project documentation",
            "Setup support",
          ],
          deliverables,
          course: apiProject.course,
          university: apiProject.university,
        };

        setProject(formattedProject);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handlePurchase = async () => {
    if (!project) {
      return;
    }

    const token =
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token");

    if (!token) {
      setPurchaseError(
        "Please log in as a Buyer before purchasing a project."
      );

      return;
    }

    try {
      setPurchasing(true);
      setPurchaseError("");
      setPurchaseSuccess(null);

      const result = await createOrder({
        projectId: project.id,
        buyerMessage:
          "I would like to purchase this project.",
      });

      setPurchaseSuccess({
        orderId: result.orderId,
      });
    } catch (err) {
      setPurchaseError(
        err instanceof Error
          ? err.message
          : "Unable to create the order."
      );
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="project-not-found">
          <div>
            <span className="not-found-icon">◌</span>

            <h1>Loading project...</h1>

            <p>
              Please wait while we load the project
              details.
            </p>
          </div>
        </main>
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />

        <main className="project-not-found">
          <div>
            <span className="not-found-icon">?</span>

            <h1>Project not found</h1>

            <p>
              {error ||
                "The project you're looking for doesn't exist or may have been removed."}
            </p>

            <Link to="/projects">
              Back to Projects
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="project-details-page">
        <section className="project-details-hero">
          <div className="project-details-container">
            <Link
              to="/projects"
              className="back-to-projects"
            >
              ← Back to Projects
            </Link>

            <div className="details-layout">
              <div className="details-main">
                <div className="details-category">
                  {project.category}
                </div>

                <h1>{project.title}</h1>

                <div className="details-rating">
                  <span className="rating-star">★</span>

                  <strong>
                    {project.rating > 0
                      ? project.rating.toFixed(1)
                      : "New"}
                  </strong>

                  <span>
                    {project.reviews > 0
                      ? `(${project.reviews} reviews)`
                      : "(No reviews yet)"}
                  </span>
                </div>

                <p className="details-description">
                  {project.description}
                </p>

                <div className="details-meta">
                  <div>
                    <span>Course</span>
                    <strong>{project.course}</strong>
                  </div>

                  <div>
                    <span>University</span>
                    <strong>{project.university}</strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>{project.deliveryTime}</strong>
                  </div>
                </div>

                <div className="details-technologies">
                  <h3>Technologies</h3>

                  <div>
                    {project.technologies.map(
                      (technology) => (
                        <span key={technology}>
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <aside className="purchase-card">
                <div className="project-preview">
                  <div className="preview-grid"></div>

                  <span>PROJECT PREVIEW</span>
                </div>

                <div className="purchase-content">
                  <span className="starting-label">
                    Starting from
                  </span>

                  <strong className="details-price">
                    ৳{project.price.toLocaleString()}
                  </strong>

                  <p>
                    You'll be able to review the complete
                    agreement before payment.
                  </p>

                  {!purchaseSuccess && (
                    <Button
                      size="large"
                      fullWidth
                      onClick={handlePurchase}
                      disabled={purchasing}
                    >
                      {purchasing
                        ? "Creating Order..."
                        : "Purchase Project"}
                    </Button>
                  )}

                  {purchaseError && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "12px",
                        borderRadius: "10px",
                        border:
                          "1px solid rgba(239, 68, 68, 0.35)",
                        background:
                          "rgba(239, 68, 68, 0.08)",
                        color: "#ef4444",
                        fontSize: "14px",
                        lineHeight: "1.5",
                      }}
                    >
                      {purchaseError}
                    </div>
                  )}

                  {purchaseSuccess && (
                    <div
                      style={{
                        marginTop: "14px",
                        padding: "16px",
                        borderRadius: "12px",
                        border:
                          "1px solid rgba(34, 197, 94, 0.35)",
                        background:
                          "rgba(34, 197, 94, 0.08)",
                        color: "#22c55e",
                        fontSize: "14px",
                        lineHeight: "1.6",
                      }}
                    >
                      <strong>
                        Order created successfully!
                      </strong>

                      <br />

                      Order ID: #{purchaseSuccess.orderId}

                      <br />

                      Amount: ৳
                      {project.price.toLocaleString()}

                      <br />

                      Status: Payment Pending

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/payment/${purchaseSuccess.orderId}`
                          )
                        }
                        style={{
                          width: "100%",
                          marginTop: "14px",
                          padding: "12px 16px",
                          border: "none",
                          borderRadius: "9px",
                          background: "#e2136e",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Pay with bKash →
                      </button>
                    </div>
                  )}

                  {!purchaseSuccess && (
                    <button className="contact-seller-button">
                      Contact Seller
                    </button>
                  )}

                  <div className="secure-note">
                    <span>✓</span>
                    Payment protection included
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="project-details-content">
          <div className="project-details-container">
            <div className="content-grid">
              <div className="details-section">
                <h2>What's included</h2>

                <p className="section-intro">
                  This project includes the following
                  features and functionality.
                </p>

                <div className="feature-list">
                  {project.features.map((feature) => (
                    <div
                      className="feature-item"
                      key={feature}
                    >
                      <span>✓</span>

                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="details-section">
                <h2>Deliverables</h2>

                <p className="section-intro">
                  The seller will provide these materials as
                  part of the project.
                </p>

                <div className="deliverable-list">
                  {project.deliverables.map(
                    (deliverable, index) => (
                      <div
                        className="deliverable-item"
                        key={deliverable}
                      >
                        <span>
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p>{deliverable}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            <section className="seller-section">
              <div className="seller-heading">
                <div>
                  <h2>Meet the seller</h2>

                  <p>
                    Work with a student developer through
                    ProjectHub.
                  </p>
                </div>
              </div>

              <div className="seller-card">
                <div className="seller-large-avatar">
                  {project.sellerInitial}
                </div>

                <div className="seller-details">
                  <div className="seller-name-row">
                    <h3>{project.sellerName}</h3>

                    <span>{project.sellerLevel}</span>
                  </div>

                  <p>
                    Student developer specializing in{" "}
                    {project.technologies.join(", ")}.
                  </p>

                  <div className="seller-stats">
                    <div>
                      <strong>
                        {project.rating > 0
                          ? project.rating.toFixed(1)
                          : "New"}
                      </strong>

                      <span>Rating</span>
                    </div>

                    <div>
                      <strong>
                        {project.reviews}
                      </strong>

                      <span>Reviews</span>
                    </div>

                    <div>
                      <strong>100%</strong>

                      <span>Response</span>
                    </div>
                  </div>
                </div>

                <button className="view-seller-button">
                  View Profile →
                </button>
              </div>
            </section>

            <section className="reviews-section">
              <div className="reviews-heading">
                <div>
                  <h2>Reviews</h2>

                  <p>
                    What previous buyers say about this
                    project.
                  </p>
                </div>

                <div className="overall-rating">
                  <strong>
                    {project.rating > 0
                      ? project.rating.toFixed(1)
                      : "New"}
                  </strong>

                  <span>★★★★★</span>
                </div>
              </div>

              <div className="review-placeholder">
                <div>★</div>

                <h3>Trusted by student buyers</h3>

                <p>
                  Detailed buyer reviews will appear here
                  when the marketplace is connected to the
                  backend.
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}

export default ProjectDetails;