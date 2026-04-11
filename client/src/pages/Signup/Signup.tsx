import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, error, isLoading, setLoginRole } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    enrollmentNumber: "",
    course: "",
    year: 1,
  });


  const urlRole: "ADMIN" | "STUDENT" | null = 
    location.pathname === "/signup/admin" ? "ADMIN" : 
    location.pathname === "/signup/student" ? "STUDENT" : null;

  useEffect(() => {

    if (urlRole) {
      setLoginRole(urlRole);
    }
  }, [urlRole, setLoginRole]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Signup Data:", form);

    try {

      const signupData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        ...(urlRole === "STUDENT" && {
          enrollmentNumber: form.enrollmentNumber,
          course: form.course,
          year: parseInt(form.year as unknown as string),
        }),
      };


      await signup(signupData as Parameters<typeof signup>[0]);


      if (urlRole === "ADMIN") {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/student");
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="signup">


      <div className="signup-left">
        <div className="left-overlay">
          <h1>HostelHub</h1>
          <p>Create your smart hostel account </p>
        </div>
      </div>


      <div className="signup-right">
        <div className="signup-card">
          <h2>Create Account</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSignup}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

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


            {urlRole === "STUDENT" && (
              <>
                <input
                  type="text"
                  name="enrollmentNumber"
                  placeholder="Enrollment Number"
                  value={form.enrollmentNumber}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <input
                  type="text"
                  name="course"
                  placeholder="Course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />

                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option value={1}>Year 1</option>
                  <option value={2}>Year 2</option>
                  <option value={3}>Year 3</option>
                  <option value={4}>Year 4</option>
                </select>
              </>
            )}

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => {
              const loginUrl = urlRole === "ADMIN" 
                ? "/login/admin" 
                : urlRole === "STUDENT"
                ? "/login/student"
                : "/login";
              navigate(loginUrl);
            }}>Login</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;