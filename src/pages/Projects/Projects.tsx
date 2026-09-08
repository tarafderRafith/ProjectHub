import Navbar from "../../components/layout/Navbar";
import ProjectCard from "../../components/common/ProjectCard";
import "./Projects.css";

const projects = [
  {
    category: "WEB DEVELOPMENT",
    title: "University Complaint Management System",
    description:
      "A complete complaint management platform designed for university students and staff.",
    technologies: ["PHP", "MySQL", "JavaScript"],
    price: 2800,
    rating: 4.8,
    reviews: 24,
    sellerName: "Rafith",
    sellerInitial: "R",
  },
  {
    category: "COMPUTER GRAPHICS",
    title: "3D City Simulation",
    description:
      "An interactive 3D city environment featuring buildings, roads, lighting and animations.",
    technologies: ["C++", "OpenGL", "GLUT"],
    price: 3500,
    rating: 4.9,
    reviews: 18,
    sellerName: "Sakib",
    sellerInitial: "S",
  },
  {
    category: "DESKTOP APPLICATION",
    title: "Internship Management System",
    description:
      "A desktop-based internship management system with multiple user roles and dashboards.",
    technologies: ["C#", ".NET", "SQL Server"],
    price: 4500,
    rating: 5.0,
    reviews: 12,
    sellerName: "Araf",
    sellerInitial: "A",
  },
  {
    category: "WEB DEVELOPMENT",
    title: "Student Attendance Portal",
    description:
      "A responsive attendance management portal with student and teacher interfaces.",
    technologies: ["React", "Node.js", "MongoDB"],
    price: 3200,
    rating: 4.7,
    reviews: 31,
    sellerName: "Nabil",
    sellerInitial: "N",
  },
  {
    category: "ARTIFICIAL INTELLIGENCE",
    title: "Student Performance Predictor",
    description:
      "A machine learning project that analyzes academic data and predicts student performance.",
    technologies: ["Python", "Pandas", "Scikit-learn"],
    price: 4000,
    rating: 4.9,
    reviews: 15,
    sellerName: "Mahir",
    sellerInitial: "M",
  },
  {
    category: "MOBILE APPLICATION",
    title: "Campus Event App",
    description:
      "A mobile application for discovering university events, registrations and announcements.",
    technologies: ["Flutter", "Dart", "Firebase"],
    price: 3800,
    rating: 4.8,
    reviews: 21,
    sellerName: "Tahsin",
    sellerInitial: "T",
  },
];

function Projects() {
  return (
    <div className="projects-page">
      <Navbar />

      <main>
        <section className="projects-hero">
          <div className="projects-hero-container">
            <div className="projects-breadcrumb">
              Home <span>/</span> Browse Projects
            </div>

            <span className="section-label">
              MARKETPLACE
            </span>

            <h1>
              Find the right project
              <br />
              <span>for your next semester.</span>
            </h1>

            <p>
              Explore projects created by students and developers.
              Compare technologies, ratings, prices and seller
              profiles before making your decision.
            </p>

            <div className="project-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search projects, technologies, courses..."
              />

              <button>Search</button>
            </div>
          </div>
        </section>

        <section className="projects-content">
          <div className="projects-content-container">
            <aside className="project-filters">
              <div className="filter-header">
                <h3>Filters</h3>
                <button>Clear all</button>
              </div>

              <div className="filter-group">
                <h4>Category</h4>

                <label>
                  <input type="checkbox" />
                  Web Development
                </label>

                <label>
                  <input type="checkbox" />
                  Desktop Application
                </label>

                <label>
                  <input type="checkbox" />
                  Computer Graphics
                </label>

                <label>
                  <input type="checkbox" />
                  Artificial Intelligence
                </label>

                <label>
                  <input type="checkbox" />
                  Mobile Application
                </label>
              </div>

              <div className="filter-group">
                <h4>Price range</h4>

                <div className="price-inputs">
                  <input placeholder="Min" />
                  <span>—</span>
                  <input placeholder="Max" />
                </div>
              </div>

              <div className="filter-group">
                <h4>Rating</h4>

                <label>
                  <input type="checkbox" />
                  ★ 4.5 & above
                </label>

                <label>
                  <input type="checkbox" />
                  ★ 4.0 & above
                </label>

                <label>
                  <input type="checkbox" />
                  ★ 3.5 & above
                </label>
              </div>
            </aside>

            <div className="projects-results">
              <div className="results-header">
                <div>
                  <h2>Popular projects</h2>
                  <p>
                    Showing {projects.length} projects
                  </p>
                </div>

                <select defaultValue="popular">
                  <option value="popular">
                    Most Popular
                  </option>
                  <option value="newest">
                    Newest
                  </option>
                  <option value="price-low">
                    Price: Low to High
                  </option>
                  <option value="price-high">
                    Price: High to Low
                  </option>
                  <option value="rating">
                    Highest Rated
                  </option>
                </select>
              </div>

              <div className="projects-grid">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.title}
                    {...project}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Projects;