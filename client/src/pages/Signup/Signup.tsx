import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { AuthRole } from "../../context/AuthContextDef";
import "./Signup.css";

// ─── Types ────────────────────────────────────────────────────────────────────

type SignupRole = "STUDENT" | "STAFF";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  // Student
  enrollmentNumber: string;
  course: string;
  year: string;
  parentName: string;
  parentPhone: string;
  address: string;
  // Staff
  employeeId: string;
  designation: string;
  department: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_FORM: FormState = {
  firstName: "", lastName: "", email: "", password: "", phone: "",
  enrollmentNumber: "", course: "", year: "1",
  parentName: "", parentPhone: "", address: "",
  employeeId: "", designation: "", department: "",
};

const ROLE_LABELS: Record<string, string> = { STUDENT: "Student", STAFF: "Staff" };
const LOGIN_ROUTES: Record<string, string> = { STUDENT: "/login/student", STAFF: "/login/staff" };
const ROLE_DASHBOARDS: Record<string, string> = { STUDENT: "/dashboard/student", STAFF: "/dashboard/staff" };

// Numeric-only fields — validated with regex, stored as plain strings
const DIGITS_ONLY_FIELDS: Array<keyof FormState> = ["phone", "parentPhone"];

function getRoleFromPath(pathname: string): SignupRole | null {
  if (pathname === "/signup/student") return "STUDENT";
  if (pathname === "/signup/staff") return "STAFF";
  return null;
}

// ─── Field component — defined OUTSIDE Signup to prevent remount on re-render ─

interface FieldProps {
  name: keyof FormState;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Field: React.FC<FieldProps> = ({
  name, placeholder, type = "text", required = false,
  value, error, disabled, onChange,
}) => (
  <div className="field-group">
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      autoComplete="off"
      className={error ? "input-error" : ""}
    />
    {error && <span className="field-error">{error}</span>}
  </div>
);

// ─── Signup page ──────────────────────────────────────────────────────────────

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signupStudent, signupStaff, error, isLoading, setLoginRole } = useAuth();

  const urlRole = getRoleFromPath(location.pathname);

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!urlRole) { navigate("/", { replace: true }); return; }
    setLoginRole(urlRole as AuthRole);
  }, [urlRole, setLoginRole, navigate]);

  // Generic handler for all text/select fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Digits-only handler for phone fields — silently drops non-digit characters
  const handleDigitsOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const digits = value.replace(/\D/g, ""); // strip anything that isn't 0-9
    setForm((prev) => ({ ...prev, [name]: digits }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const getHandler = (name: keyof FormState) =>
    DIGITS_ONLY_FIELDS.includes(name) ? handleDigitsOnly : handleChange;

  const validate = (): boolean => {
    const errs: FieldErrors = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required.";
    if (!form.lastName.trim())  errs.lastName  = "Last name is required.";
    if (!form.email)            errs.email     = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!form.password)         errs.password  = "Password is required.";
    else if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (form.phone && !/^\d+$/.test(form.phone))
      errs.phone = "Phone must contain digits only.";

    if (urlRole === "STUDENT") {
      if (!form.enrollmentNumber.trim()) errs.enrollmentNumber = "Enrollment number is required.";
      if (!form.course.trim())           errs.course           = "Course is required.";
      if (form.parentPhone && !/^\d+$/.test(form.parentPhone))
        errs.parentPhone = "Parent phone must contain digits only.";
    }

    if (urlRole === "STAFF") {
      if (!form.employeeId.trim())  errs.employeeId  = "Employee ID is required.";
      if (!form.designation.trim()) errs.designation = "Designation is required.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !urlRole) return;

    try {
      if (urlRole === "STUDENT") {
        const role = await signupStudent({
          firstName:        form.firstName,
          lastName:         form.lastName,
          email:            form.email,
          password:         form.password,
          phone:            form.phone       || undefined,
          enrollmentNumber: form.enrollmentNumber,
          course:           form.course,
          year:             parseInt(form.year, 10), // safe — value comes from <select>
          parentName:       form.parentName  || undefined,
          parentPhone:      form.parentPhone || undefined,
          address:          form.address     || undefined,
        });
        navigate(ROLE_DASHBOARDS[role] ?? ROLE_DASHBOARDS["STUDENT"], { replace: true });
      } else {
        const role = await signupStaff({
          firstName:   form.firstName,
          lastName:    form.lastName,
          email:       form.email,
          password:    form.password,
          phone:       form.phone       || undefined,
          employeeId:  form.employeeId,
          designation: form.designation,
          department:  form.department  || undefined,
        });
        navigate(ROLE_DASHBOARDS[role] ?? ROLE_DASHBOARDS["STAFF"], { replace: true });
      }
    } catch {
      // error displayed via context — stay on page
    }
  };

  const roleLabel = urlRole ? ROLE_LABELS[urlRole] : "";

  // Convenience wrapper so JSX stays concise
  const f = (
    name: keyof FormState,
    placeholder: string,
    opts: { type?: string; required?: boolean } = {}
  ) => (
    <Field
      key={name}
      name={name}
      placeholder={placeholder}
      type={opts.type ?? "text"}
      required={opts.required ?? false}
      value={form[name]}
      error={fieldErrors[name]}
      disabled={isLoading}
      onChange={getHandler(name) as React.ChangeEventHandler<HTMLInputElement>}
    />
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

          {error && (
            <div className="error-message" role="alert">
              <span className="error-icon">⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field-row">
              {f("firstName", "First Name",  { required: true })}
              {f("lastName",  "Last Name",   { required: true })}
            </div>

            {f("email",    "Email address",       { type: "email",    required: true })}
            {f("password", "Password (min 6 chars)", { type: "password", required: true })}
            {/* phone: type="text" + digits-only handler — no browser interference */}
            {f("phone", "Phone (optional)")}

            {urlRole === "STUDENT" && (
              <>
                {f("enrollmentNumber", "Enrollment Number", { required: true })}
                {f("course", "Course", { required: true })}

                <div className="field-group">
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    disabled={isLoading}
                  >
                    {[1, 2, 3, 4, 5, 6].map((y) => (
                      <option key={y} value={String(y)}>Year {y}</option>
                    ))}
                  </select>
                </div>

                {f("parentName",  "Parent Name (optional)")}
                {/* parentPhone: type="text" + digits-only handler */}
                {f("parentPhone", "Parent Phone (optional)")}
                {f("address",     "Address (optional)")}
              </>
            )}

            {urlRole === "STAFF" && (
              <>
                {f("employeeId",  "Employee ID",          { required: true })}
                {f("designation", "Designation",          { required: true })}
                {f("department",  "Department (optional)")}
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
