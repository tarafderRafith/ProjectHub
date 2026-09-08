import { useMemo, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import ProjectCard from "../../components/common/ProjectCard";
import "./Projects.css";

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

const projects: Project[] = [
  {
    id: 1,
    category: "Web Development",
    title: "University Event Management System",
    description:
      "A complete web-based event management system for universities with registration and event tracking.",
    technologies: ["PHP", "MySQL", "JavaScript"],
    price: 3500,
    rating: 4.9,
    reviews: 24,
    sellerName: "Rafith",
    sellerInitial: "R",
    sellerLevel: "Top Seller",
  },
  {
    id: 2,
    category: "C#",
    title: "Internship Management System",
    description:
      "A modern internship management platform built with C# and Windows Forms.",
    technologies: ["C#", ".NET", "SQL Server"],
    price: 5000,
    rating: 4.8,
    reviews: 18,
    sellerName: "Arif",
    sellerInitial: "A",
    sellerLevel: "Verified Seller",
  },
  {
    id: 3,
    category: "Computer Graphics",
    title: "OpenGL Graphics Project",
    description:
      "Interactive computer graphics project using OpenGL and GLUT with multiple visual scenes.",
    technologies: ["C++", "OpenGL", "GLUT"],
    price: 2500,
    rating: 4.7,
    reviews: 15,
    sellerName: "Nabil",
    sellerInitial: "N",
    sellerLevel: "Verified Seller",
  },
  {
    id: 4,
    category: "Java",
    title: "Student Management System",
    description:
      "A Java-based student management application with authentication and CRUD operations.",
    technologies: ["Java", "JavaFX", "MySQL"],
    price: 3000,
    rating: 4.6,
    reviews: 11,
    sellerName: "Sami",
    sellerInitial: "S",
    sellerLevel: "New Seller",
  },
  {
    id: 5,
    category: "Python",
    title: "AI Student Assistant",
    description:
      "A Python-based assistant that helps students organize academic tasks and information.",
    technologies: ["Python", "AI", "API"],
    price: 4500,
    rating: 4.9,
    reviews: 21,
    sellerName: "Tanvir",
    sellerInitial: "T",
    sellerLevel: "Top Seller",
  },
  {
    id: 6,
    category: "Web Development",
    title: "Online Course Platform",
    description:
      "A responsive online course platform with course listings, user accounts and dashboards.",
    technologies: ["React", "Node.js", "MongoDB"],
    price: 6000,
    rating: 4.8,
    reviews: 29,
    sellerName: "Hasan",
    sellerInitial: "H",
    sellerLevel: "Top Seller",
  },
];

const categories = [
  "All",
  "Web Development",
  "C#",
  "Java",
  "Python",
  "Computer Graphics",
];

function Projects() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === "All" ||
        project.category === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        project.title.toLowerCase().includes(searchText) ||
        project.description.toLowerCase().includes(searchText) ||
        project.category.toLowerCase().includes(searchText) ||
        project.technologies.some((technology) =>
          technology.toLowerCase().includes(searchText)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

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
              ready-to-customize solutions from talented developers.
            </p>

            <div className="projects-search">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search projects, technologies, courses..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
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
                  {filteredProjects.length}{" "}
                  {filteredProjects.length === 1
                    ? "project"
                    : "projects"}{" "}
                  available
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
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {filteredProjects.length > 0 ? (
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
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