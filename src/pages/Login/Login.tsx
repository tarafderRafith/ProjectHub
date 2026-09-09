import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    /*
      Temporary frontend login.

      Later this will be replaced with:
      POST /api/auth/login

      and connected to ASP.NET Core + SQL Server + JWT.
    */

    navigate("/");
  };

  return (
    <main className="login-page">
      <div className="login-background-glow login-glow-one"></div>
      <div className="login-background-glow login-glow-two"></div>

      <div className="login-wrapper">
        {/* Brand */}

        <Link to="/" className="login-brand">
          <span className="login-logo-mark">P</span>

          <span className="login-logo-text">
            Project<span>Hub</span>
          </span>
        </Link>

        {/* Login Card */}

        <div className="login-card">
          <div className="login-header">
            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Sign in to your
              <br />
              <span>ProjectHub account.</span>
            </h1>

            <p>
              Continue exploring projects, managing your
              requests and connecting with student developers.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            {/* Email */}

            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">@</span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}

            <div className="form-group">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    setError(
                      "Password recovery will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember */}

            <label className="remember-row">
              <input type="checkbox" />

              <span className="custom-checkbox"></span>

              <span>
                Remember me
              </span>
            </label>

            {/* Error */}

            {error && (
              <div className="login-error">
                <span>!</span>

                <p>{error}</p>
              </div>
            )}

            {/* Submit */}

            <button
              type="submit"
              className="login-submit"
            >
              Sign In

              <span>→</span>
            </button>
          </form>

          {/* Divider */}

          <div className="login-divider">
            <span></span>

            <p>or</p>

            <span></span>
          </div>

          {/* Register */}

          <div className="register-prompt">
            <span>
              Don't have a ProjectHub account?
            </span>

            <Link to="/register">
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer */}

        <div className="login-footer">
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

export default Login;