import { Link } from "react-router-dom";
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
}

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
}: ProjectCardProps) {
  return (
    <article className="project-card">
      <div className="project-card-image">
        <div className="project-card-pattern"></div>

        <span className="project-card-category">
          {category}
        </span>

        <button
          className="project-card-wishlist"
          aria-label={`Add ${title} to wishlist`}
        >
          ♡
        </button>
      </div>

      <div className="project-card-body">
        <div className="project-card-rating">
          <span>★</span>

          <strong>{rating.toFixed(1)}</strong>

          <small>({reviews})</small>
        </div>

        <h3>{title}</h3>

        <p className="project-card-description">
          {description}
        </p>

        <div className="project-card-tech">
          {technologies.slice(0, 3).map(
            (technology) => (
              <span key={technology}>
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

        <div className="project-card-seller">
          <div className="seller-avatar">
            {sellerInitial}
          </div>

          <div className="seller-info">
            <strong>{sellerName}</strong>

            <span>{sellerLevel}</span>
          </div>
        </div>

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

            <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;