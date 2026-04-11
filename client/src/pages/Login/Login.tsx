import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user, setLoginRole } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const urlRole: "ADMIN" | "STUDENT" | null = 
    location.pathname === "/login/admin" ? "ADMIN" : 
    location.pathname === "/login/student" ? "STUDENT" : null;


  useEffect(() => {

    if (urlRole) {
      setLoginRole(urlRole);
    }


    if (user && urlRole && user.role !== urlRole) {

      console.warn(
        `Role mismatch: User is ${user.role} but trying to access ${urlRole} login`
      );
      return;
    }


    if (user && urlRole && user.role === urlRole) {
      if (user.role === "ADMIN") {
        navigate("/dashboard/admin", { replace: true });
      } else if (user.role === "STUDENT") {
        navigate("/dashboard/student", { replace: true });
      }
    }
  }, [user, navigate, urlRole, setLoginRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form.email, form.password);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">

      <div className="login-left">
        <div className="left-overlay">
          <h1>HostelHub</h1>
          <p>Smart living starts here </p>
        </div>
      </div>


      <div className="login-right">
        <div className="login-card">
          <h2>Login to HostelHub</h2>

          {error && (
            <div className="error-message" style={{ color: "#d32f2f", padding: "12px", marginBottom: "15px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
               {error}
            </div>
          )}


          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{" "}
            <span onClick={() => {
              const signupUrl = urlRole === "ADMIN" 
                ? "/signup/admin" 
                : urlRole === "STUDENT"
                ? "/signup/student"
                : "/signup";
              navigate(signupUrl);
            }}>Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;