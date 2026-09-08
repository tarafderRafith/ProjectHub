import { useMemo, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/common/Button";
import "./Requests.css";

interface ProjectRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  budget: number;
  deadline: string;
  proposals: number;
  postedTime: string;
  buyerName: string;
  buyerInitial: string;
}

const requests: ProjectRequest[] = [
  {
    id: 1,
    title: "Need a C# Inventory Management System",
    description:
      "Looking for a complete inventory management project with product management, stock tracking and a simple admin dashboard.",
    category: "C#",
    technologies: ["C#", ".NET", "SQL Server"],
    budget: 5000,
    deadline: "10 days",
    proposals: 6,
    postedTime: "2 hours ago",
    buyerName: "Nayeem",
    buyerInitial: "N",
  },
  {
    id: 2,
    title: "Computer Graphics OpenGL Project",
    description:
      "Need an interactive OpenGL project for a computer graphics course. The project should include multiple scenes and proper documentation.",
    category: "Computer Graphics",
    technologies: ["C++", "OpenGL", "GLUT"],
    budget: 3500,
    deadline: "7 days",
    proposals: 4,
    postedTime: "5 hours ago",
    buyerName: "Sakib",
    buyerInitial: "S",
  },
  {
    id: 3,
    title: "PHP University Management Website",
    description:
      "Looking for a university management website with student registration, course management and an admin panel.",
    category: "Web Development",
    technologies: ["PHP", "MySQL", "JavaScript"],
    budget: 4500,
    deadline: "14 days",
    proposals: 9,
    postedTime: "1 day ago",
    buyerName: "Mehedi",
    buyerInitial: "M",
  },
  {
    id: 4,
    title: "Java Student Attendance System",
    description:
      "Need a Java-based attendance management system with student records, attendance tracking and report generation.",
    category: "Java",
    technologies: ["Java", "JavaFX", "MySQL"],
    budget: 3000,
    deadline: "8 days",
    proposals: 3,
    postedTime: "1 day ago",
    buyerName: "Fahim",
    buyerInitial: "F",
  },
  {
    id: 5,
    title: "React E-Commerce Website",
    description:
      "Looking for a modern responsive e-commerce frontend with product listing, cart functionality and user authentication UI.",
    category: "Web Development",
    technologies: ["React", "TypeScript", "CSS"],
    budget: 6000,
    deadline: "12 days",
    proposals: 7,
    postedTime: "2 days ago",
    buyerName: "Tahmid",
    buyerInitial: "T",
  },
  {
    id: 6,
    title: "Python Data Analysis Project",
    description:
      "Need a Python project involving data analysis, visualization and a short explanation of the methodology.",
    category: "Python",
    technologies: ["Python", "Pandas", "Matplotlib"],
    budget: 2800,
    deadline: "5 days",
    proposals: 2,
    postedTime: "3 days ago",
    buyerName: "Adnan",
    buyerInitial: "A",
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

function Requests() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesCategory =
        selectedCategory === "All" ||
        request.category === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        searchText === "" ||
        request.title.toLowerCase().includes(searchText) ||
        request.description.toLowerCase().includes(searchText) ||
        request.category.toLowerCase().includes(searchText) ||
        request.technologies.some((technology) =>
          technology.toLowerCase().includes(searchText)
        );

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <>
      <Navbar />

      <main className="requests-page">
        <section className="requests-hero">
          <div className="requests-container">
            <div className="requests-hero-content">
              <span className="requests-eyebrow">
                PROJECT REQUESTS
              </span>

              <h1>
                Can't find what
                <br />
                <span>you're looking for?</span>
              </h1>

              <p>
                Browse custom project requests from students or post
                your own requirements and let talented sellers send
                you proposals.
              </p>

              <div className="requests-hero-actions">
                <Button size="large">
                  Post a Request
                </Button>

                <button className="browse-requests-button">
                  Browse Requests
                </button>
              </div>
            </div>

            <div className="request-hero-card">
              <div className="hero-card-icon">✦</div>

              <span>Looking for something specific?</span>

              <strong>
                Tell sellers exactly what you need.
              </strong>

              <div className="hero-card-line"></div>

              <div className="hero-card-items">
                <div>
                  <span>01</span>
                  <p>Describe your project</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Receive proposals</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Choose your seller</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="requests-content">
          <div className="requests-container">
            <div className="requests-heading">
              <div>
                <h2>Open Requests</h2>

                <p>
                  Find projects that match your skills and submit
                  a proposal.
                </p>
              </div>

              <div className="request-count">
                {filteredRequests.length} requests
              </div>
            </div>

            <div className="requests-tools">
              <div className="requests-search">
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search requests, technologies..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="request-categories">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={
                      selectedCategory === category
                        ? "request-category active"
                        : "request-category"
                    }
                    onClick={() =>
                      setSelectedCategory(category)
                    }
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="requests-list">
                {filteredRequests.map((request) => (
                  <article
                    className="request-card"
                    key={request.id}
                  >
                    <div className="request-main">
                      <div className="request-card-top">
                        <span className="request-category-label">
                          {request.category}
                        </span>

                        <span className="request-posted">
                          {request.postedTime}
                        </span>
                      </div>

                      <h3>{request.title}</h3>

                      <p className="request-description">
                        {request.description}
                      </p>

                      <div className="request-technologies">
                        {request.technologies.map(
                          (technology) => (
                            <span key={technology}>
                              {technology}
                            </span>
                          )
                        )}
                      </div>

                      <div className="request-buyer">
                        <div className="request-avatar">
                          {request.buyerInitial}
                        </div>

                        <div>
                          <strong>{request.buyerName}</strong>
                          <span>Buyer</span>
                        </div>
                      </div>
                    </div>

                    <div className="request-side">
                      <div className="request-budget">
                        <span>Budget</span>

                        <strong>
                          ৳{request.budget.toLocaleString()}
                        </strong>
                      </div>

                      <div className="request-deadline">
                        <span>Deadline</span>

                        <strong>{request.deadline}</strong>
                      </div>

                      <div className="request-proposals">
                        <strong>{request.proposals}</strong>

                        <span>proposals</span>
                      </div>

                      <button className="view-request-button">
                        View Request
                        <span>→</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="requests-empty">
                <div>⌕</div>

                <h3>No requests found</h3>

                <p>
                  Try another search term or choose a different
                  category.
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

export default Requests;