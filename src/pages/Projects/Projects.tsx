import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import ProjectCard from "../../components/common/ProjectCard";
import "./Projects.css";

interface ApiProject {
  id: number;
  category: string;
  title: string;
  description: string;
  technologies: string;
  price: number;
  deliveryDays: number;
  course: string;
  university: string;
  deliverables: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isApproved: boolean;
  sellerId: number;
  sellerName: string;
  sellerUsername: string;
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
}

const categories = [
  "All",
  "Web Development",
  "C#",
  "Java",
  "Python",
  "Computer Graphics",
];

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5038/api/Projects"
        );

        const result: ApiProject[] | { message?: string } =
          await response.json();

        if (!response.ok) {
          throw new Error(
            "message" in result && result.message
              ? result.message
              : "Unable to load projects."
          );
        }

        const apiProjects = result as ApiProject[];

        const formattedProjects: Project[] =
          apiProjects.map((project) => {
            const technologies = project.technologies
              .split(",")
              .map((technology) => technology.trim())
              .filter((technology) => technology.length > 0);

            const sellerName =
              project.sellerName || "ProjectHub Seller";

            return {
              id: project.id,
              category: project.category,
              title: project.title,
              description: project.description,
              technologies,
              price: project.price,
              rating: 0,
              reviews: 0,
              sellerName,
              sellerInitial: sellerName
                .charAt(0)
                .toUpperCase(),
              sellerLevel: "Verified Seller",
            };
          });

        setProjects(formattedProjects);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load projects."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        project.title
          .toLowerCase()
          .includes(searchText) ||
        project.description
          .toLowerCase()
          .includes(searchText) ||
        project.category
          .toLowerCase()
          .includes(searchText) ||
        project.technologies.some((technology) =>
          technology
            .toLowerCase()
            .includes(searchText)
        );

      return matchesCategory && matchesSearch;
    });
  }, [projects, search, selectedCategory]);

  return (
    <>
      <Navbar />

      <main className="projects-page">
        <section className="projects-hero">
          <div className="projects-container">
            <span className="projects-eyebrow">
              PROJECT MARKETPLACE
            </span>

            <h1>
              Find the right project
              <br />
              <span>for your next semester.</span>
            </h1>

            <p>
              Explore student projects, academic resources and
              ready-to-customize solutions from talented
              developers.
            </p>

            <div className="projects-search">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search projects, technologies, courses..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  className="clear-search"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </section>

        <section className="projects-content">
          <div className="projects-container">
            <div className="projects-toolbar">
              <div>
                <h2>Browse Projects</h2>

                <p>
                  {loading
                    ? "Loading projects..."
                    : `${filteredProjects.length} ${
                        filteredProjects.length === 1
                          ? "project"
                          : "projects"
                      } available`}
                </p>
              </div>
            </div>

            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-button active"
                      : "category-button"
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="projects-empty">
                <div className="empty-icon">◌</div>

                <h3>Loading projects...</h3>

                <p>
                  Please wait while we load the latest
                  approved projects.
                </p>
              </div>
            ) : error ? (
              <div className="projects-empty">
                <div className="empty-icon">!</div>

                <h3>Unable to load projects</h3>

                <p>{error}</p>

                <button
                  onClick={() =>
                    window.location.reload()
                  }
                >
                  Try Again
                </button>
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    category={project.category}
                    title={project.title}
                    description={project.description}
                    technologies={project.technologies}
                    price={project.price}
                    rating={project.rating}
                    reviews={project.reviews}
                    sellerName={project.sellerName}
                    sellerInitial={project.sellerInitial}
                    sellerLevel={project.sellerLevel}
                  />
                ))}
              </div>
            ) : (
              <div className="projects-empty">
                <div className="empty-icon">⌕</div>

                <h3>No projects found</h3>

                <p>
                  Try searching for another project or choose
                  a different category.
                </p>

                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Projects;