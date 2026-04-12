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

const DASHBOARD_ROUTES: Record<string, string> = {
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

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, setLoginRole } = useAuth();

  const urlRole = getRoleFromPath(location.pathname);

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlRole) setLoginRole(urlRole);
  }, [urlRole, setLoginRole]);

  useEffect(() => {
    if (user && urlRole && user.role === urlRole) {
      navigate(DASHBOARD_ROUTES[urlRole], { replace: true });
    }
  }, [user, urlRole, navigate]);

  const validate = (): boolean => {
    const errs: typeof fieldErrors = {};
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError("");
    try {
      await login(form.email, form.password, urlRole);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed. Please try again.");
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
        <div className="login-card">
          {urlRole && (
            <div className={`role-badge role-badge--${urlRole.toLowerCase()}`}>
              {roleLabel} Portal
            </div>
          )}

          <h2>Welcome Back</h2>
          <p className="login-subtitle">Sign in to your {roleLabel} account</p>

          {serverError && <div className="error-message">{serverError}</div>}

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
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
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
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? "Signing in..." : "Sign In"}
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
