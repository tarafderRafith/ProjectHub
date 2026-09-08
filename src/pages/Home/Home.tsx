import Navbar from "../../components/layout/Navbar";
import "./Home.css";

function Home() {
  return (
    <div className="home">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-background">
            <div className="hero-glow hero-glow-one"></div>
            <div className="hero-glow hero-glow-two"></div>
            <div className="hero-grid"></div>
          </div>

          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="badge-dot"></span>
                The student project marketplace
              </div>

              <h1>
                Find projects.
                <br />
                <span>Build smarter.</span>
              </h1>

              <p className="hero-description">
                Discover student-built projects, request custom solutions,
                connect with skilled developers, and get the support you need
                to bring your ideas to life.
              </p>

              <div className="hero-buttons">
                <button className="hero-primary">
                  Browse Projects
                  <span>→</span>
                </button>

                <button className="hero-secondary">
                  Post a Request
                </button>
              </div>

              <div className="hero-trust">
                <div className="avatar-group">
                  <span className="avatar avatar-one">R</span>
                  <span className="avatar avatar-two">S</span>
                  <span className="avatar avatar-three">A</span>
                  <span className="avatar avatar-four">M</span>
                </div>

                <div>
                  <div className="trust-stars">★★★★★</div>
                  <p>Built for students, by students</p>
                </div>
              </div>
            </div>

            {/* Marketplace Preview */}
            <div className="hero-visual">
              <div className="visual-orbit orbit-one"></div>
              <div className="visual-orbit orbit-two"></div>

              <div className="project-card-main">
                <div className="project-card-top">
                  <span className="project-category">WEB DEVELOPMENT</span>
                  <span className="project-menu">•••</span>
                </div>

                <div className="project-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <div className="preview-url">
                      projecthub.app
                    </div>
                  </div>

                  <div className="preview-content">
                    <div className="preview-sidebar">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>

                    <div className="preview-main">
                      <div className="preview-title"></div>
                      <div className="preview-line"></div>
                      <div className="preview-line short"></div>

                      <div className="preview-cards">
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="project-info">
                  <div>
                    <h3>Smart Attendance System</h3>
                    <p>C# • SQL Server • WinForms</p>
                  </div>

                  <div className="project-price">
                    <span>Starting from</span>
                    <strong>৳2,500</strong>
                  </div>
                </div>
              </div>

              <div className="floating-card seller-card">
                <div className="floating-icon">✓</div>
                <div>
                  <strong>Verified Seller</strong>
                  <span>Top rated developer</span>
                </div>
              </div>

              <div className="floating-card secure-card">
                <div className="floating-icon">₿</div>
                <div>
                  <strong>Payment Secured</strong>
                  <span>Released after delivery</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stat">
              <strong>1,000+</strong>
              <span>Projects</span>
            </div>

            <div className="stat">
              <strong>500+</strong>
              <span>Student Sellers</span>
            </div>

            <div className="stat">
              <strong>50+</strong>
              <span>Technologies</span>
            </div>

            <div className="stat">
              <strong>4.8/5</strong>
              <span>Average Rating</span>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="featured-section" id="projects">
          <div className="section-container">
            <div className="section-heading">
              <div>
                <span className="section-label">EXPLORE</span>
                <h2>Featured projects</h2>
              </div>

              <a href="#projects" className="view-all">
                View all projects →
              </a>
            </div>

            <div className="project-grid">
              <article className="featured-card">
                <div className="featured-image image-one">
                  <span>Computer Graphics</span>
                </div>

                <div className="featured-content">
                  <h3>3D City Simulation</h3>
                  <p>C++ • OpenGL • GLUT</p>

                  <div className="featured-bottom">
                    <span>⭐ 4.9</span>
                    <strong>৳3,500</strong>
                  </div>
                </div>
              </article>

              <article className="featured-card">
                <div className="featured-image image-two">
                  <span>WEB DEVELOPMENT</span>
                </div>

                <div className="featured-content">
                  <h3>University Complaint System</h3>
                  <p>PHP • MySQL • JavaScript</p>

                  <div className="featured-bottom">
                    <span>⭐ 4.8</span>
                    <strong>৳2,800</strong>
                  </div>
                </div>
              </article>

              <article className="featured-card">
                <div className="featured-image image-three">
                  <span>DESKTOP APPLICATION</span>
                </div>

                <div className="featured-content">
                  <h3>Internship Management System</h3>
                  <p>C# • .NET • SQL Server</p>

                  <div className="featured-bottom">
                    <span>⭐ 5.0</span>
                    <strong>৳4,500</strong>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="how-section" id="how-it-works">
          <div className="section-container">
            <div className="how-heading">
              <span className="section-label">HOW IT WORKS</span>
              <h2>A better way to get projects done.</h2>
              <p>
                From finding the right project to receiving your final
                delivery, ProjectHub keeps the entire process simple and
                secure.
              </p>
            </div>

            <div className="steps">
              <div className="step">
                <div className="step-number">01</div>
                <h3>Discover</h3>
                <p>
                  Browse projects from students and developers across
                  different technologies.
                </p>
              </div>

              <div className="step-line"></div>

              <div className="step">
                <div className="step-number">02</div>
                <h3>Connect</h3>
                <p>
                  Chat with sellers, ask questions, negotiate and agree on
                  exactly what you need.
                </p>
              </div>

              <div className="step-line"></div>

              <div className="step">
                <div className="step-number">03</div>
                <h3>Secure payment</h3>
                <p>
                  Your payment stays protected until the agreed project
                  deliverables are completed.
                </p>
              </div>

              <div className="step-line"></div>

              <div className="step">
                <div className="step-number">04</div>
                <h3>Get delivered</h3>
                <p>
                  Receive your project, documentation, demo and other agreed
                  deliverables.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;