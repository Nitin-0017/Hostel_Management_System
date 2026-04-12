import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { AuthRole } from "../../context/AuthContextDef";
import "./Login.css";

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Admin",
  STUDENT: "Student",
  STAFF: "Staff",
};

const ROLE_DASHBOARDS: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STUDENT: "/dashboard/student",
  STAFF: "/dashboard/staff",
};

const SIGNUP_ROUTES: Record<string, string> = {
  STUDENT: "/signup/student",
  STAFF: "/signup/staff",
};

function getRoleFromPath(pathname: string): AuthRole {
  if (pathname === "/login/admin") return "ADMIN";
  if (pathname === "/login/student") return "STUDENT";
  if (pathname === "/login/staff") return "STAFF";
  return null;
}

// Map raw backend messages to user-friendly copy
function friendlyError(raw: string, expectedRole: AuthRole): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("invalid email or password") ||
    lower.includes("invalid admin credentials") ||
    lower.includes("invalid credentials")
  ) {
    return expectedRole
      ? `Incorrect ${ROLE_LABELS[expectedRole]} credentials. Please try again.`
      : "Invalid credentials. Please try again.";
  }
  if (
    lower.includes("not found") ||
    lower.includes("no user") ||
    lower.includes("role")
  ) {
    return "Incorrect role or credentials. Make sure you're using the right portal.";
  }
  if (lower.includes("deactivated")) {
    return "Your account has been deactivated. Please contact the administrator.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch")) {
    return "Cannot reach the server. Please check your connection.";
  }
  return raw || "Login failed. Please try again.";
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, setLoginRole } = useAuth();

  const urlRole = getRoleFromPath(location.pathname);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlRole) setLoginRole(urlRole);
  }, [urlRole, setLoginRole]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const validate = (): boolean => {
    const errs: typeof fieldErrors = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field-level and server errors as user types
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      triggerShake();
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      // login() returns the resolved role string on success, throws on failure
      const resolvedRole = await login(form.email, form.password, urlRole);

      // Only navigate on confirmed success
      const dest = ROLE_DASHBOARDS[resolvedRole];
      if (dest) {
        navigate(dest, { replace: true });
      }
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Login failed. Please try again.";
      setServerError(friendlyError(raw, urlRole));
      triggerShake();
      // Highlight both fields on auth failure
      setFieldErrors({ email: " ", password: " " });
    } finally {
      setIsLoading(false);
    }
  };

  const roleLabel = urlRole ? ROLE_LABELS[urlRole] : "User";

  return (
    <div className="login">
      <div className="login-left">
        <div className="left-overlay">
          <h1>HostelHub</h1>
          <p>Smart living starts here</p>
        </div>
      </div>

      <div className="login-right">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          {urlRole && (
            <div className={`role-badge role-badge--${urlRole.toLowerCase()}`}>
              {roleLabel} Portal
            </div>
          )}

          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your {roleLabel} account</p>

          {serverError && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠</span>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                disabled={isLoading}
                className={fieldErrors.email ? "input-error" : ""}
                autoComplete="email"
              />
              {fieldErrors.email && fieldErrors.email.trim() && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="field-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
                className={fieldErrors.password ? "input-error" : ""}
                autoComplete="current-password"
              />
              {fieldErrors.password && fieldErrors.password.trim() && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner" /> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {urlRole !== "ADMIN" && urlRole && (
            <p className="signup-link">
              Don't have an account?{" "}
              <span onClick={() => navigate(SIGNUP_ROUTES[urlRole])}>Sign up</span>
            </p>
          )}

          <p className="back-link" onClick={() => navigate("/")}>
            ← Back to Home
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
