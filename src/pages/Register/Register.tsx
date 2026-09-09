import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

type AccountType = "buyer" | "seller";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [accountType, setAccountType] =
    useState<AccountType>("buyer");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [university, setUniversity] = useState("");
  const [department, setDepartment] = useState("");
  const [studentId, setStudentId] = useState("");
  const [semester, setSemester] = useState("");
  const [graduationYear, setGraduationYear] =
    useState("");

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const nextStep = () => {
    setError("");

    if (step === 1) {
      if (
        !name.trim() ||
        !username.trim() ||
        !email.trim() ||
        !contact.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        setError("Please fill in all required fields.");
        return;
      }

      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!/^01[3-9]\d{8}$/.test(contact)) {
        setError(
          "Please enter a valid Bangladesh contact number."
        );
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must be at least 6 characters."
        );
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (step === 2) {
      if (
        !university.trim() ||
        !department.trim() ||
        !semester ||
        !graduationYear
      ) {
        setError("Please complete your student information.");
        return;
      }
    }

    setStep(step + 1);
  };

  const previousStep = () => {
    setError("");
    setStep(step - 1);
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!agreeTerms) {
      setError(
        "Please agree to the Terms and Privacy Policy."
      );
      return;
    }

    /*
      Temporary frontend registration.

      Later this will be replaced with:

      POST /api/auth/register

      and connected to:

      React
        ↓
      ASP.NET Core API
        ↓
      SQL Server
        ↓
      JWT Authentication
    */

    navigate("/login");
  };

  return (
    <main className="register-page">
      <div className="register-background-glow register-glow-one"></div>
      <div className="register-background-glow register-glow-two"></div>

      <div className="register-wrapper">

        <Link to="/" className="register-brand">
          <span className="register-logo-mark">
            P
          </span>

          <span className="register-logo-text">
            Project<span>Hub</span>
          </span>
        </Link>

        <div className="register-card">

          <div className="register-header">
            <span className="register-eyebrow">
              CREATE YOUR ACCOUNT
            </span>

            <h1>
              Join the
              <br />
              <span>ProjectHub community.</span>
            </h1>

            <p>
              Create your profile and start discovering,
              buying, or selling student projects.
            </p>
          </div>

          {/* Progress */}

          <div className="register-progress">

            <div className="progress-line">
              <div
                className="progress-line-active"
                style={{
                  width: `${((step - 1) / 3) * 100}%`,
                }}
              ></div>
            </div>

            {[1, 2, 3, 4].map((number) => (
              <div
                key={number}
                className={`progress-step ${
                  step >= number
                    ? "progress-step-active"
                    : ""
                }`}
              >
                <span>{number}</span>

                <small>
                  {number === 1 && "Account"}
                  {number === 2 && "Student"}
                  {number === 3 && "Profile"}
                  {number === 4 && "Finish"}
                </small>
              </div>
            ))}

          </div>

          <form
            className="register-form"
            onSubmit={handleSubmit}
          >

            {/* STEP 1 */}

            {step === 1 && (
              <div className="register-step-content">

                <div className="step-heading">
                  <span>01</span>
                  <div>
                    <h2>Account information</h2>
                    <p>
                      Create your ProjectHub login details.
                    </p>
                  </div>
                </div>

                <div className="register-grid">

                  <div className="form-group">
                    <label htmlFor="name">
                      Full name
                      <span>*</span>
                    </label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="username">
                      Username
                      <span>*</span>
                    </label>

                    <input
                      id="username"
                      type="text"
                      placeholder="e.g. rafith01"
                      value={username}
                      onChange={(event) =>
                        setUsername(event.target.value)
                      }
                    />
                  </div>

                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email address
                    <span>*</span>
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact">
                    Contact number
                    <span>*</span>
                  </label>

                  <div className="contact-input">
                    <span>🇧🇩 +880</span>

                    <input
                      id="contact"
                      type="tel"
                      placeholder="1XXXXXXXXX"
                      value={
                        contact.startsWith("0")
                          ? contact.slice(1)
                          : contact
                      }
                      onChange={(event) => {
                        const value =
                          event.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setContact(
                          value
                            ? `0${value.slice(0, 10)}`
                            : ""
                        );
                      }}
                    />
                  </div>

                  <small className="input-hint">
                    Example: 01712345678
                  </small>
                </div>

                <div className="register-grid">

                  <div className="form-group">
                    <label htmlFor="password">
                      Password
                      <span>*</span>
                    </label>

                    <input
                      id="password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm password
                      <span>*</span>
                    </label>

                    <input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                    />
                  </div>

                </div>

              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div className="register-step-content">

                <div className="step-heading">
                  <span>02</span>
                  <div>
                    <h2>Student information</h2>
                    <p>
                      Tell us a little about your academic
                      background.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="university">
                    University
                    <span>*</span>
                  </label>

                  <input
                    id="university"
                    type="text"
                    placeholder="e.g. American International University-Bangladesh"
                    value={university}
                    onChange={(event) =>
                      setUniversity(event.target.value)
                    }
                  />
                </div>

                <div className="register-grid">

                  <div className="form-group">
                    <label htmlFor="department">
                      Department
                      <span>*</span>
                    </label>

                    <input
                      id="department"
                      type="text"
                      placeholder="e.g. Computer Science"
                      value={department}
                      onChange={(event) =>
                        setDepartment(event.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="studentId">
                      Student ID
                      <small>Optional</small>
                    </label>

                    <input
                      id="studentId"
                      type="text"
                      placeholder="Your student ID"
                      value={studentId}
                      onChange={(event) =>
                        setStudentId(event.target.value)
                      }
                    />
                  </div>

                </div>

                <div className="register-grid">

                  <div className="form-group">
                    <label htmlFor="semester">
                      Current semester
                      <span>*</span>
                    </label>

                    <select
                      id="semester"
                      value={semester}
                      onChange={(event) =>
                        setSemester(event.target.value)
                      }
                    >
                      <option value="">
                        Select semester
                      </option>
                      <option value="1">
                        1st Semester
                      </option>
                      <option value="2">
                        2nd Semester
                      </option>
                      <option value="3">
                        3rd Semester
                      </option>
                      <option value="4">
                        4th Semester
                      </option>
                      <option value="5">
                        5th Semester
                      </option>
                      <option value="6">
                        6th Semester
                      </option>
                      <option value="7">
                        7th Semester
                      </option>
                      <option value="8">
                        8th Semester
                      </option>
                      <option value="9">
                        9th Semester
                      </option>
                      <option value="10">
                        10th Semester
                      </option>
                      <option value="11+">
                        11+ Semester
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="graduationYear">
                      Expected graduation
                      <span>*</span>
                    </label>

                    <select
                      id="graduationYear"
                      value={graduationYear}
                      onChange={(event) =>
                        setGraduationYear(
                          event.target.value
                        )
                      }
                    >
                      <option value="">
                        Select year
                      </option>

                      <option value="2026">
                        2026
                      </option>

                      <option value="2027">
                        2027
                      </option>

                      <option value="2028">
                        2028
                      </option>

                      <option value="2029">
                        2029
                      </option>

                      <option value="2030">
                        2030
                      </option>

                      <option value="2031">
                        2031
                      </option>
                    </select>
                  </div>

                </div>

                <div className="student-note">
                  <span>🎓</span>

                  <p>
                    Your academic information helps
                    ProjectHub recommend relevant projects,
                    courses and student communities.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <div className="register-step-content">

                <div className="step-heading">
                  <span>03</span>

                  <div>
                    <h2>Your ProjectHub role</h2>

                    <p>
                      Choose how you mainly want to use
                      ProjectHub.
                    </p>
                  </div>
                </div>

                <div className="account-type-grid">

                  <button
                    type="button"
                    className={`account-type-card ${
                      accountType === "buyer"
                        ? "account-type-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setAccountType("buyer")
                    }
                  >
                    <div className="account-type-icon">
                      🛒
                    </div>

                    <div>
                      <strong>I'm a Buyer</strong>

                      <p>
                        Browse projects, post requests
                        and hire student developers.
                      </p>
                    </div>

                    <span className="account-radio">
                      {accountType === "buyer"
                        ? "✓"
                        : ""}
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`account-type-card ${
                      accountType === "seller"
                        ? "account-type-selected"
                        : ""
                    }`}
                    onClick={() =>
                      setAccountType("seller")
                    }
                  >
                    <div className="account-type-icon">
                      💻
                    </div>

                    <div>
                      <strong>I'm a Seller</strong>

                      <p>
                        Sell your projects, respond to
                        requests and earn.
                      </p>
                    </div>

                    <span className="account-radio">
                      {accountType === "seller"
                        ? "✓"
                        : ""}
                    </span>
                  </button>

                </div>

                <div className="form-group">
                  <label htmlFor="skills">
                    {accountType === "seller"
                      ? "Skills & technologies"
                      : "Technologies you're interested in"}

                    <span>*</span>
                  </label>

                  <input
                    id="skills"
                    type="text"
                    placeholder={
                      accountType === "seller"
                        ? "e.g. React, C#, PHP, Python"
                        : "e.g. Web Development, AI, C++"
                    }
                    value={skills}
                    onChange={(event) =>
                      setSkills(event.target.value)
                    }
                  />

                  <small className="input-hint">
                    Separate multiple skills with commas.
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="bio">
                    Short bio
                    <small>Optional</small>
                  </label>

                  <textarea
                    id="bio"
                    placeholder={
                      accountType === "seller"
                        ? "Tell buyers about your skills and experience..."
                        : "Tell the community what you're interested in..."
                    }
                    value={bio}
                    onChange={(event) =>
                      setBio(event.target.value)
                    }
                    rows={4}
                  />
                </div>

              </div>
            )}

            {/* STEP 4 */}

            {step === 4 && (
              <div className="register-step-content">

                <div className="step-heading">
                  <span>04</span>

                  <div>
                    <h2>Complete your profile</h2>

                    <p>
                      Add a few optional details to make
                      your profile stronger.
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="github">
                    GitHub profile
                    <small>Optional</small>
                  </label>

                  <input
                    id="github"
                    type="url"
                    placeholder="https://github.com/yourusername"
                    value={github}
                    onChange={(event) =>
                      setGithub(event.target.value)
                    }
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="portfolio">
                    Portfolio website
                    <small>Optional</small>
                  </label>

                  <input
                    id="portfolio"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={portfolio}
                    onChange={(event) =>
                      setPortfolio(event.target.value)
                    }
                  />
                </div>

                <div className="profile-summary">

                  <div className="summary-avatar">
                    {name
                      ? name.charAt(0).toUpperCase()
                      : "P"}
                  </div>

                  <div className="summary-content">

                    <h3>{name || "Your Name"}</h3>

                    <span>
                      @{username || "username"}
                    </span>

                    <div className="summary-tags">
                      <span>
                        {accountType === "buyer"
                          ? "Buyer"
                          : "Seller"}
                      </span>

                      {department && (
                        <span>
                          {department}
                        </span>
                      )}
                    </div>

                  </div>

                </div>

                <label className="terms-row">

                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(event) =>
                      setAgreeTerms(
                        event.target.checked
                      )
                    }
                  />

                  <span className="custom-checkbox">
                    {agreeTerms ? "✓" : ""}
                  </span>

                  <span>
                    I agree to the{" "}
                    <a href="#terms">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#privacy">
                      Privacy Policy
                    </a>
                    .
                  </span>

                </label>

              </div>
            )}

            {error && (
              <div className="register-error">
                <span>!</span>

                <p>{error}</p>
              </div>
            )}

            <div className="register-navigation">

              {step > 1 ? (
                <button
                  type="button"
                  className="register-back-button"
                  onClick={previousStep}
                >
                  ← Back
                </button>
              ) : (
                <Link
                  to="/login"
                  className="register-back-button"
                >
                  ← Log in
                </Link>
              )}

              {step < 4 ? (
                <button
                  type="button"
                  className="register-next-button"
                  onClick={nextStep}
                >
                  Continue
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="submit"
                  className="register-next-button"
                >
                  Create Account
                  <span>→</span>
                </button>
              )}

            </div>

          </form>

          <div className="register-login-prompt">
            <span>
              Already have a ProjectHub account?
            </span>

            <Link to="/login">
              Sign in
            </Link>
          </div>

        </div>

        <div className="register-footer">
          <span>© 2026 ProjectHub</span>

          <div>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>

      </div>
    </main>
  );
}

export default Register;