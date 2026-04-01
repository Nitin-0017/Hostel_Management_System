import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login Data:", form);

    navigate("/dashboard");
  };

  return (
    <div className="login">

      {/* 🔥 LEFT SIDE IMAGE */}
      <div className="login-left">
        <div className="left-overlay">
          <h1>HostelHub</h1>
          <p>Smart living starts here 🚀</p>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE FORM */}
      <div className="login-right">
        <div className="login-card">
          <h2>Login to HostelHub</h2>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button type="submit">Login</button>
          </form>

          <p className="signup-link">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>Signup</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;