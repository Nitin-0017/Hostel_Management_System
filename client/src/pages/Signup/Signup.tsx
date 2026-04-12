import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { AuthRole } from "../../context/AuthContextDef";
import "./Signup.css";

type SignupRole = "STUDENT" | "STAFF";

function getRoleFromPath(pathname: string): SignupRole | null {
  if (pathname === "/signup/student") return "STUDENT";
  if (pathname === "/signup/staff") return "STAFF";
  return null;
}

const ROLE_LABELS: Record<string, string> = { STUDENT: "Student", STAFF: "Staff" };
const LOGIN_ROUTES: Record<string, string> = {
  STUDENT: "/login/student",
  STAFF: "/login/staff",
};
const DASHBOARD_ROUTES: Record<string, string> = {
  STUDENT: "/dashboard/student",
  STAFF: "/dashboard/staff",
};

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  // Student fields
  enrollmentNumber: string;
  course: string;
  year: string;
  parentName: string;
  parentPhone: string;
  address: string;
  // Staff fields
  employeeId: string;
  designation: string;
  department: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_FORM: FormState = {
  firstName: "", lastName: "", email: "", password: "", phone: "",
  enrollmentNumber: "", course: "", year: "1", parentName: "", parentPhone: "", address: "",
  employeeId: "", designation: "", department: "",
};

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signupStudent, signupStaff, error, isLoading, setLoginRole } = useAuth();

  const urlRole = getRoleFromPath(location.pathname);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    // Redirect away if someone navigates to /signup/admin or unknown signup path
    if (!urlRole) {
      navigate("/", { replace: true });
      return;
    }
    setLoginRole(urlRole as AuthRole);
  }, [urlRole, setLoginRole, navigate]);

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim()) errs.lastName = "Last name is required.";
    if (!form.email) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email.";
    if (!form.password) errs.password = "Password is required.";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters.";

    if (urlRole === "STUDENT") {
      if (!form.enrollmentNumber.trim()) errs.enrollmentNumber = "Enrollment number is required.";
      if (!form.course.trim()) errs.course = "Course is required.";
    }

    if (urlRole === "STAFF") {
      if (!form.employeeId.trim()) errs.employeeId = "Employee ID is required.";
      if (!form.designation.trim()) errs.designation = "Designation is required.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !urlRole) return;

    try {
      if (urlRole === "STUDENT") {
        await signupStudent({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          enrollmentNumber: form.enrollmentNumber,
          course: form.course,
          year: parseInt(form.year, 10),
          parentName: form.parentName || undefined,
          parentPhone: form.parentPhone || undefined,
          address: form.address || undefined,
        });
      } else {
        await signupStaff({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          employeeId: form.employeeId,
          designation: form.designation,
          department: form.department || undefined,
        });
      }
      navigate(DASHBOARD_ROUTES[urlRole], { replace: true });
    } catch {
      // error is shown via context
    }
  };

  const roleLabel = urlRole ? ROLE_LABELS[urlRole] : "";

  const Field = ({
    name,
    placeholder,
    type = "text",
    required = false,
  }: {
    name: keyof FormState;
    placeholder: string;
    type?: string;
    required?: boolean;
  }) => (
    <div className="field-group">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        disabled={isLoading}
        className={fieldErrors[name] ? "input-error" : ""}
        required={required}
      />
      {fieldErrors[name] && <span className="field-error">{fieldErrors[name]}</span>}
    </div>
  );

  return (
    <div className="signup">
      <div className="signup-left">
        <div className="left-overlay">
          <h1>HostelHub</h1>
          <p>Create your {roleLabel} account</p>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          {urlRole && (
            <div className={`role-badge role-badge--${urlRole.toLowerCase()}`}>
              {roleLabel} Registration
            </div>
          )}

          <h2>Create Account</h2>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              <Field name="firstName" placeholder="First Name" required />
              <Field name="lastName" placeholder="Last Name" required />
            </div>

            <Field name="email" placeholder="Email address" type="email" required />
            <Field name="password" placeholder="Password (min 6 chars)" type="password" required />
            <Field name="phone" placeholder="Phone (optional)" type="tel" />

            {urlRole === "STUDENT" && (
              <>
                <Field name="enrollmentNumber" placeholder="Enrollment Number" required />
                <Field name="course" placeholder="Course" required />
                <div className="field-group">
                  <select name="year" value={form.year} onChange={handleChange} disabled={isLoading}>
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
                <Field name="parentName" placeholder="Parent Name (optional)" />
                <Field name="parentPhone" placeholder="Parent Phone (optional)" type="tel" />
                <Field name="address" placeholder="Address (optional)" />
              </>
            )}

            {urlRole === "STAFF" && (
              <>
                <Field name="employeeId" placeholder="Employee ID" required />
                <Field name="designation" placeholder="Designation" required />
                <Field name="department" placeholder="Department (optional)" />
              </>
            )}

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => urlRole && navigate(LOGIN_ROUTES[urlRole])}>Sign in</span>
          </p>

          <p className="back-link" onClick={() => navigate("/")}>
            ← Back to Home
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
