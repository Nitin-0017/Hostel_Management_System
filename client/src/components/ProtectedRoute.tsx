import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();


  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: "15px" }}>⏳ Loading...</div>
          <p>Checking your authentication...</p>
        </div>
      </div>
    );
  }


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }


  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];

    const hasRequiredRole = user && allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      const suggestedLoginPage = 
        user?.role === "ADMIN" ? "/login/admin" : "/login/student";

      console.warn(
        `Authorization failed: User role '${user?.role}' not in required roles [${allowedRoles.join(", ")}]`
      );

      return (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100vh",
          backgroundColor: "#f5f5f5"
        }}>
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            maxWidth: "500px"
          }}>
            <h2 style={{ color: "#d32f2f", marginBottom: "15px" }}>
               Access Denied
            </h2>
            <p style={{ marginBottom: "15px", fontSize: "16px" }}>
              You don't have permission to access this page.
            </p>
            <div style={{ 
              backgroundColor: "#f5f5f5", 
              padding: "15px", 
              borderRadius: "4px",
              marginBottom: "20px"
            }}>
              <p style={{ marginBottom: "8px" }}>
                <strong>Your Role:</strong> {user?.role}
              </p>
              <p style={{ margin: "0" }}>
                <strong>Required Role:</strong> {allowedRoles.join(" or ")}
              </p>
            </div>
            <p style={{ marginBottom: "20px", color: "#666" }}>
              If you have multiple accounts, please logout and login with the correct account.
            </p>
            <button
              onClick={() => navigate(suggestedLoginPage, { replace: true })}
              style={{
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold"
              }}
            >
              Go to {user?.role} Login
            </button>
          </div>
        </div>
      );
    }
  }


  return <>{children}</>;
};

export default ProtectedRoute;
