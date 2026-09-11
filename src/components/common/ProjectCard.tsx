import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import "./ProjectCard.css";

interface ProjectCardProps {
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
  sellerLevel?: string;
  imageUrl?: string | null;
}

const API_BASE_URL =
  "http://localhost:5038";

function ProjectCard({
  id,
  category,
  title,
  description,
  technologies,
  price,
  rating,
  reviews,
  sellerName,
  sellerInitial,
  sellerLevel = "Verified Seller",
  imageUrl,
}: ProjectCardProps) {
  const [imageError, setImageError] =
    useState(false);

  const getImageUrl = (
    url: string
  ) => {
    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      return url;
    }

    return `${API_BASE_URL}${url}`;
  };

  const hasImage =
    Boolean(
      imageUrl &&
      imageUrl.trim() &&
      !imageError
    );

  return (
    <article className="project-card">

      {/* ==========================================
          IMAGE
      ========================================== */}

      <div className="project-card-image">

        {hasImage ? (
          <>
            <img
              src={getImageUrl(imageUrl!)}
              alt={title}
              className="project-card-image-photo"
              onError={() =>
                setImageError(true)
              }
            />

            <div className="project-card-image-overlay"></div>

            <span className="project-card-image-badge">
              PROJECT
            </span>
          </>
        ) : (
          <div className="project-card-fallback">

            <div className="project-card-pattern"></div>

            <div className="project-card-fallback-icon">
              📁
            </div>

            <strong>
              {title}
            </strong>

          </div>
        )}

        <span className="project-card-category">
          {category}
        </span>

        <button
          type="button"
          className="project-card-wishlist"
          aria-label={`Add ${title} to wishlist`}
        >
          ♡
        </button>

      </div>

      {/* ==========================================
          BODY
      ========================================== */}

      <div className="project-card-body">

        <div className="project-card-rating">

          <span>
            ★
          </span>

          <strong>
            {rating.toFixed(1)}
          </strong>

          <small>
            ({reviews})
          </small>

        </div>

        <h3>
          {title}
        </h3>

        <p className="project-card-description">
          {description}
        </p>

        {/* ==========================================
            TECHNOLOGIES
        ========================================== */}

        <div className="project-card-tech">

          {technologies
            .slice(0, 3)
            .map(
              (technology) => (
                <span
                  key={technology}
                >
                  {technology}
                </span>
              )
            )}

          {technologies.length > 3 && (
            <span>
              +{technologies.length - 3}
            </span>
          )}

        </div>

        {/* ==========================================
            SELLER
        ========================================== */}

        <div className="project-card-seller">

          <div className="seller-avatar">
            {sellerInitial}
          </div>

          <div className="seller-info">

            <strong>
              {sellerName}
            </strong>

            <span>
              {sellerLevel}
            </span>

          </div>

        </div>

        {/* ==========================================
            FOOTER
        ========================================== */}

        <div className="project-card-footer">

          <div>

            <span className="price-label">
              Starting from
            </span>

            <strong className="project-price">
              ৳{price.toLocaleString()}
            </strong>

          </div>

          <Link
            to={`/projects/${id}`}
            className="view-project-button"
          >
            View
            <span>
              →
            </span>
          </Link>

        </div>

      </div>

    </article>
  );
}

export default ProjectCard;