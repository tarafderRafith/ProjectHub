
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import {
  loginUser,
  type LoginData,
} from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    if (!email.includes("@")) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    setIsLoading(true);

    try {
      const loginData: LoginData = {
        email: email.trim(),
        password: password,
      };

      const result = await loginUser(loginData);

      /*
        Store JWT token.

        Later we will create a proper
        authentication context around this.
      */

      if (rememberMe) {
        localStorage.setItem(
          "projecthub_token",
          result.token
        );
      } else {
        sessionStorage.setItem(
          "projecthub_token",
          result.token
        );
      }

      console.log("Login successful:", result);

      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Invalid email or password."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="login-page">

      <div className="login-background-glow login-glow-one"></div>

      <div className="login-background-glow login-glow-two"></div>

      <div className="login-wrapper">

        <Link
          to="/"
          className="login-brand"
        >
          <span className="login-logo-mark">
            P
          </span>

          <span className="login-logo-text">
            Project<span>Hub</span>
          </span>
        </Link>

        <div className="login-card">

          <div className="login-header">

            <span className="login-eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Sign in to your
              <br />
              <span>
                ProjectHub account.
              </span>
            </h1>

            <p>
              Continue exploring projects,
              managing your requests and
              connecting with student developers.
            </p>

          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* EMAIL */}

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                />

              </div>

            </div>

            {/* PASSWORD */}

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

                <span
                  className="input-icon"
                  aria-hidden="true"
                >
                  🔒
                </span>

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
                    setPassword(
                      event.target.value
                    )
                  }
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

            {/* REMEMBER ME */}

            <label className="remember-row">

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span className="custom-checkbox"></span>

              <span>
                Remember me
              </span>

            </label>

            {/* ERROR */}

            {error && (
              <div className="login-error">

                <span>!</span>

                <p>
                  {error}
                </p>

              </div>
            )}

            {/* SUBMIT */}

            <button
              type="submit"
              className="login-submit"
              disabled={isLoading}
            >

              {isLoading
                ? "Signing in..."
                : "Sign In"}

              <span>
                {isLoading
                  ? "..."
                  : "→"}
              </span>

            </button>

          </form>

          <div className="login-divider">

            <span></span>

            <p>or</p>

            <span></span>

          </div>

          <div className="register-prompt">

            <span>
              Don't have a ProjectHub account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

        <div className="login-footer">

          <span>
            © 2026 ProjectHub
          </span>

          <div>

            <a href="#privacy">
              Privacy
            </a>

            <a href="#terms">
              Terms
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;

