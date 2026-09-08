import { useParams, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import "./ProjectDetails.css";

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

const projects: Project[] = [
  {
    id: 1,
    category: "Web Development",
    title: "University Event Management System",
    description:
      "A complete web-based event management system designed for university students and organizations. The system allows users to browse events, register for events and manage event information through an admin dashboard.",
    technologies: ["PHP", "MySQL", "JavaScript"],
    price: 3500,
    rating: 4.9,
    reviews: 24,
    sellerName: "Rafith",
    sellerInitial: "R",
    sellerLevel: "Top Seller",
    deliveryTime: "5-7 days",
    course: "Web Technologies",
    university: "University Project",
    features: [
      "Student registration",
      "Event creation and management",
      "Event registration system",
      "Admin dashboard",
      "Responsive interface",
      "Database integration",
    ],
    deliverables: [
      "Complete source code",
      "Database / SQL file",
      "Project documentation",
      "Setup guide",
      "Screenshots",
      "Online demonstration",
    ],
  },
  {
    id: 2,
    category: "C#",
    title: "Internship Management System",
    description:
      "A modern internship management platform built with C# and .NET. The system connects students, companies and administrators through a structured internship workflow.",
    technologies: ["C#", ".NET", "SQL Server"],
    price: 5000,
    rating: 4.8,
    reviews: 18,
    sellerName: "Arif",
    sellerInitial: "A",
    sellerLevel: "Verified Seller",
    deliveryTime: "7-10 days",
    course: "Object Oriented Programming",
    university: "University Project",
    features: [
      "Student management",
      "Company management",
      "Internship posting",
      "Application management",
      "Admin dashboard",
      "SQL Server database",
    ],
    deliverables: [
      "Complete source code",
      "SQL database",
      "Project documentation",
      "UML diagrams",
      "Setup guide",
      "Project demonstration",
    ],
  },
  {
    id: 3,
    category: "Computer Graphics",
    title: "OpenGL Graphics Project",
    description:
      "An interactive computer graphics project developed using C++, OpenGL and GLUT. The project contains multiple visual scenes and demonstrates fundamental computer graphics concepts.",
    technologies: ["C++", "OpenGL", "GLUT"],
    price: 2500,
    rating: 4.7,
    reviews: 15,
    sellerName: "Nabil",
    sellerInitial: "N",
    sellerLevel: "Verified Seller",
    deliveryTime: "4-6 days",
    course: "Computer Graphics",
    university: "University Project",
    features: [
      "Interactive graphics",
      "Multiple scenes",
      "Keyboard interaction",
      "Mouse interaction",
      "OpenGL rendering",
      "Animation support",
    ],
    deliverables: [
      "C++ source code",
      "OpenGL project files",
      "Documentation",
      "Screenshots",
      "Setup instructions",
      "Live demonstration",
    ],
  },
  {
    id: 4,
    category: "Java",
    title: "Student Management System",
    description:
      "A Java-based student management application with authentication, student records and CRUD operations. Designed with a simple and user-friendly interface.",
    technologies: ["Java", "JavaFX", "MySQL"],
    price: 3000,
    rating: 4.6,
    reviews: 11,
    sellerName: "Sami",
    sellerInitial: "S",
    sellerLevel: "New Seller",
    deliveryTime: "5-8 days",
    course: "Java Programming",
    university: "University Project",
    features: [
      "Student registration",
      "Student profiles",
      "CRUD operations",
      "Authentication",
      "Search functionality",
      "Database integration",
    ],
    deliverables: [
      "Java source code",
      "Database file",
      "Documentation",
      "UML diagram",
      "Setup guide",
      "Demonstration",
    ],
  },
  {
    id: 5,
    category: "Python",
    title: "AI Student Assistant",
    description:
      "A Python-based academic assistant designed to help students organize academic information, tasks and useful resources.",
    technologies: ["Python", "AI", "API"],
    price: 4500,
    rating: 4.9,
    reviews: 21,
    sellerName: "Tanvir",
    sellerInitial: "T",
    sellerLevel: "Top Seller",
    deliveryTime: "7-10 days",
    course: "Python Programming",
    university: "University Project",
    features: [
      "AI-powered responses",
      "Task management",
      "API integration",
      "Student dashboard",
      "Simple user interface",
      "Extensible architecture",
    ],
    deliverables: [
      "Python source code",
      "API configuration guide",
      "Documentation",
      "Setup instructions",
      "Screenshots",
      "Demonstration",
    ],
  },
  {
    id: 6,
    category: "Web Development",
    title: "Online Course Platform",
    description:
      "A modern responsive online course platform featuring course listings, user accounts, dashboards and a clean learning-focused interface.",
    technologies: ["React", "Node.js", "MongoDB"],
    price: 6000,
    rating: 4.8,
    reviews: 29,
    sellerName: "Hasan",
    sellerInitial: "H",
    sellerLevel: "Top Seller",
    deliveryTime: "10-14 days",
    course: "Web Development",
    university: "University Project",
    features: [
      "Course listing",
      "User authentication",
      "Student dashboard",
      "Course management",
      "Responsive design",
      "Database integration",
    ],
    deliverables: [
      "Complete source code",
      "Database setup",
      "Documentation",
      "Setup guide",
      "Screenshots",
      "Project demonstration",
    ],
  },
];

function ProjectDetails() {
  const { id } = useParams();

  const project = projects.find(
    (item) => item.id === Number(id)
  );

  if (!project) {
    return (
      <>
        <Navbar />

        <main className="project-not-found">
          <div>
            <span className="not-found-icon">?</span>

            <h1>Project not found</h1>

            <p>
              The project you're looking for doesn't exist or
              may have been removed.
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
                    {project.rating.toFixed(1)}
                  </strong>

                  <span>
                    ({project.reviews} reviews)
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

                  <Button size="large" fullWidth>
                    Purchase Project
                  </Button>

                  <button className="contact-seller-button">
                    Contact Seller
                  </button>

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
                  This project includes the following features
                  and functionality.
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
                        {project.rating.toFixed(1)}
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
                    {project.rating.toFixed(1)}
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