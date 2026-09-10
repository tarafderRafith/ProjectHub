import { useState } from "react";
import "./AdminProjectApproval.css";

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

interface AdminProjectApprovalProps {
  projects: AdminProject[];
  onRefresh: () => Promise<void>;
}

const API_URL = "http://localhost:5038/api";

function AdminProjectApproval({
  projects,
  onRefresh,
}: AdminProjectApprovalProps) {
  const [expandedProjectId, setExpandedProjectId] =
    useState<number | null>(null);

  const [actionLoading, setActionLoading] =
    useState<number | null>(null);

  const [actionType, setActionType] =
    useState<string>("");

  const [localError, setLocalError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const getToken = () => {
    return (
      localStorage.getItem("projecthub_token") ||
      sessionStorage.getItem("projecthub_token")
    );
  };

  const formatDate = (
    date: string | null | undefined
  ) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getDeliverables = (
    deliverables: string | undefined
  ) => {
    if (!deliverables) {
      return [];
    }

    return deliverables
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  const handleProjectAction = async (
    projectId: number,
    action:
      | "approve"
      | "reject"
      | "toggle-availability"
  ) => {
    try {
      setActionLoading(projectId);
      setActionType(action);
      setLocalError("");
      setSuccessMessage("");

      const token = getToken();

      if (!token) {
        setLocalError(
          "Your login session has expired. Please login again."
        );
        return;
      }

      const response = await fetch(
        `${API_URL}/admin/projects/${projectId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update the project."
        );
      }

      setSuccessMessage(
        result.message ||
          "Project updated successfully."
      );

      setExpandedProjectId(null);

      await onRefresh();
    } catch (err) {
      setLocalError(
        err instanceof Error
          ? err.message
          : "Unable to update the project."
      );
    } finally {
      setActionLoading(null);
      setActionType("");
    }
  };

  const pendingProjects = projects.filter(
    (project) =>
      project.isApproved === false
  );

  const approvedProjects = projects.filter(
    (project) =>
      project.isApproved === true
  );

  const unavailableProjects =
    projects.filter(
      (project) =>
        project.isAvailable === false
    );

  const toggleProjectDetails = (
    projectId: number
  ) => {
    setExpandedProjectId(
      expandedProjectId === projectId
        ? null
        : projectId
    );

    setLocalError("");
    setSuccessMessage("");
  };

  return (
    <div className="admin-project-approval">

      <div className="admin-project-approval-header">

        <div>
          <span className="admin-section-label">
            PROJECT MODERATION
          </span>

          <h3>
            Project Approval Center
          </h3>

          <p>
            Review seller submissions before
            they become visible in the
            ProjectHub marketplace.
          </p>
        </div>

        <div className="admin-project-approval-stats">

          <div className="admin-project-mini-stat pending">
            <span>
              Pending
            </span>

            <strong>
              {pendingProjects.length}
            </strong>
          </div>

          <div className="admin-project-mini-stat approved">
            <span>
              Approved
            </span>

            <strong>
              {approvedProjects.length}
            </strong>
          </div>

          <div className="admin-project-mini-stat hidden">
            <span>
              Hidden
            </span>

            <strong>
              {unavailableProjects.length}
            </strong>
          </div>

        </div>

      </div>

      {localError && (
        <div className="admin-project-alert error">

          <span>
            !
          </span>

          <p>
            {localError}
          </p>

          <button
            type="button"
            onClick={() =>
              setLocalError("")
            }
          >
            ×
          </button>

        </div>
      )}

      {successMessage && (
        <div className="admin-project-alert success">

          <span>
            ✓
          </span>

          <p>
            {successMessage}
          </p>

          <button
            type="button"
            onClick={() =>
              setSuccessMessage("")
            }
          >
            ×
          </button>

        </div>
      )}

      {pendingProjects.length === 0 ? (

        <div className="admin-project-empty">

          <div className="admin-project-empty-icon">
            ✓
          </div>

          <span className="admin-section-label">
            ALL CLEAR
          </span>

          <h3>
            No projects waiting for approval
          </h3>

          <p>
            New seller submissions will appear
            here when they need admin review.
          </p>

        </div>

      ) : (

        <div className="admin-project-review-list">

          {pendingProjects.map((project) => {

            const isExpanded =
              expandedProjectId ===
              project.id;

            const isLoading =
              actionLoading ===
              project.id;

            const deliverables =
              getDeliverables(
                project.deliverables
              );

            return (
              <article
                key={project.id}
                className={
                  isExpanded
                    ? "admin-project-review-card expanded"
                    : "admin-project-review-card"
                }
              >

                {/* PROJECT MAIN ROW */}

                <div className="admin-project-review-main">

                  <div className="admin-project-number">
                    #{project.id}
                  </div>

                  <div className="admin-project-review-info">

                    <div className="admin-project-review-title-row">

                      <h4>
                        {project.title}
                      </h4>

                      <span className="admin-project-pending-tag">
                        Pending Review
                      </span>

                    </div>

                    <p className="admin-project-review-description">
                      {project.description ||
                        "No project description provided."}
                    </p>

                    <div className="admin-project-review-meta">

                      <span>
                        {project.category ||
                          "General"}
                      </span>

                      <span>
                        {project.course ||
                          "Course not provided"}
                      </span>

                      <span>
                        {project.university ||
                          "University not provided"}
                      </span>

                    </div>

                  </div>

                  <div className="admin-project-review-price">

                    <span>
                      PRICE
                    </span>

                    <strong>
                      ৳
                      {(project.price || 0).toLocaleString()}
                    </strong>

                    <small>
                      {project.deliveryDays
                        ? `${project.deliveryDays} day${
                            project.deliveryDays ===
                            1
                              ? ""
                              : "s"
                          } delivery`
                        : "Delivery time not set"}
                    </small>

                  </div>

                  <button
                    type="button"
                    className="admin-project-details-button"
                    onClick={() =>
                      toggleProjectDetails(
                        project.id
                      )
                    }
                  >
                    {isExpanded
                      ? "Hide Details ↑"
                      : "Review Details ↓"}
                  </button>

                </div>

                {/* EXPANDED PROJECT DETAILS */}

                {isExpanded && (

                  <div className="admin-project-expanded">

                    <div className="admin-project-expanded-grid">

                      {/* SELLER */}

                      <div className="admin-project-detail-block seller">

                        <span className="admin-project-detail-label">
                          SELLER
                        </span>

                        <strong>
                          {project.sellerName ||
                            "Unknown Seller"}
                        </strong>

                        <small>
                          {project.sellerUsername
                            ? `@${project.sellerUsername}`
                            : "Username unavailable"}
                        </small>

                      </div>

                      {/* CATEGORY */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          CATEGORY
                        </span>

                        <strong>
                          {project.category ||
                            "Not provided"}
                        </strong>

                      </div>

                      {/* COURSE */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          COURSE
                        </span>

                        <strong>
                          {project.course ||
                            "Not provided"}
                        </strong>

                      </div>

                      {/* UNIVERSITY */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          UNIVERSITY
                        </span>

                        <strong>
                          {project.university ||
                            "Not provided"}
                        </strong>

                      </div>

                      {/* PRICE */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          PRICE
                        </span>

                        <strong className="project-price">
                          ৳
                          {(project.price || 0).toLocaleString()}
                        </strong>

                      </div>

                      {/* DELIVERY */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          DELIVERY
                        </span>

                        <strong>
                          {project.deliveryDays
                            ? `${project.deliveryDays} days`
                            : "Not provided"}
                        </strong>

                      </div>

                      {/* SUBMITTED */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          SUBMITTED
                        </span>

                        <strong>
                          {formatDate(
                            project.createdAt
                          )}
                        </strong>

                      </div>

                      {/* UPDATED */}

                      <div className="admin-project-detail-block">

                        <span className="admin-project-detail-label">
                          LAST UPDATED
                        </span>

                        <strong>
                          {formatDate(
                            project.updatedAt
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* TECHNOLOGIES */}

                    <div className="admin-project-expanded-section">

                      <span className="admin-project-detail-label">
                        TECHNOLOGIES
                      </span>

                      <div className="admin-project-tech-list">

                        {project.technologies
                          ? project.technologies
                              .split(",")
                              .map(
                                (
                                  technology,
                                  index
                                ) => (
                                  <span
                                    key={`${technology}-${index}`}
                                  >
                                    {technology.trim()}
                                  </span>
                                )
                              )
                          : (
                            <span className="muted">
                              No technologies provided
                            </span>
                          )}

                      </div>

                    </div>

                    {/* DELIVERABLES */}

                    <div className="admin-project-expanded-section">

                      <span className="admin-project-detail-label">
                        DELIVERABLES
                      </span>

                      {deliverables.length >
                      0 ? (

                        <div className="admin-project-deliverables">

                          {deliverables.map(
                            (
                              deliverable,
                              index
                            ) => (
                              <span
                                key={`${deliverable}-${index}`}
                              >
                                <b>
                                  ✓
                                </b>

                                {deliverable}
                              </span>
                            )
                          )}

                        </div>

                      ) : (

                        <p className="admin-project-no-data">
                          No deliverables were
                          specified by the seller.
                        </p>

                      )}

                    </div>

                    {/* DESCRIPTION */}

                    <div className="admin-project-expanded-section">

                      <span className="admin-project-detail-label">
                        FULL DESCRIPTION
                      </span>

                      <div className="admin-project-full-description">

                        {project.description ||
                          "No description provided."}

                      </div>

                    </div>

                    {/* ADMIN DECISION */}

                    <div className="admin-project-decision">

                      <div className="admin-project-decision-text">

                        <span>
                          ADMIN DECISION
                        </span>

                        <p>
                          Approve this project
                          to make it available
                          in the marketplace, or
                          reject it if it does not
                          meet ProjectHub listing
                          requirements.
                        </p>

                      </div>

                      <div className="admin-project-actions">

                        <button
                          type="button"
                          className="admin-project-action reject"
                          disabled={isLoading}
                          onClick={() =>
                            handleProjectAction(
                              project.id,
                              "reject"
                            )
                          }
                        >
                          {isLoading &&
                          actionType ===
                            "reject"
                            ? "Rejecting..."
                            : "✕ Reject"}
                        </button>

                        <button
                          type="button"
                          className="admin-project-action approve"
                          disabled={isLoading}
                          onClick={() =>
                            handleProjectAction(
                              project.id,
                              "approve"
                            )
                          }
                        >
                          {isLoading &&
                          actionType ===
                            "approve"
                            ? "Approving..."
                            : "✓ Approve Project"}
                        </button>

                      </div>

                    </div>

                  </div>

                )}

              </article>
            );
          })}

        </div>

      )}

      {/* AVAILABILITY MANAGEMENT */}

      {approvedProjects.length > 0 && (

        <div className="admin-project-availability">

          <div className="admin-project-availability-header">

            <div>
              <span className="admin-section-label">
                LISTING CONTROL
              </span>

              <h3>
                Approved Projects
              </h3>

              <p>
                Control which approved projects
                remain visible and available
                in the marketplace.
              </p>
            </div>

            <span className="admin-approved-count">
              {approvedProjects.length} approved
            </span>

          </div>

          <div className="admin-approved-project-list">

            {approvedProjects.map(
              (project) => {

                const isLoading =
                  actionLoading ===
                  project.id;

                return (
                  <div
                    className="admin-approved-project"
                    key={project.id}
                  >

                    <div className="admin-approved-project-info">

                      <div className="admin-approved-project-icon">
                        {project.title
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {project.title}
                        </strong>

                        <span>
                          {project.sellerName ||
                            "Unknown seller"}
                          {" · "}
                          ৳
                          {(project.price || 0).toLocaleString()}
                        </span>

                      </div>

                    </div>

                    <div className="admin-approved-project-status">

                      <span
                        className={
                          project.isAvailable
                            ? "availability-status available"
                            : "availability-status unavailable"
                        }
                      >
                        {project.isAvailable
                          ? "● Available"
                          : "● Hidden"}
                      </span>

                      <button
                        type="button"
                        className={
                          project.isAvailable
                            ? "availability-button hide"
                            : "availability-button show"
                        }
                        disabled={
                          isLoading
                        }
                        onClick={() =>
                          handleProjectAction(
                            project.id,
                            "toggle-availability"
                          )
                        }
                      >
                        {isLoading &&
                        actionType ===
                          "toggle-availability"
                          ? "Updating..."
                          : project.isAvailable
                          ? "Hide Listing"
                          : "Show Listing"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminProjectApproval;