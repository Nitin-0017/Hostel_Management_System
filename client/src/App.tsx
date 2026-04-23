import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";

import { ToastProvider } from "./context/ToastContext";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import StaffDashboard from "./pages/Dashboard/StaffDashboard";
import MyRoom from "./pages/MyRoom/MyRoom";
import Complaints from "./pages/Complaints/Complaints";
import Leave from "./pages/Leave/Leave";
import Cleaning from "./pages/Dashboard/Cleaning/Cleaning";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Support from "./pages/Support/Support";

import "./App.css";

// Redirects authenticated users to their role-specific dashboard
const RoleRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Navigate to="/" replace />;
  if (user.role === "ADMIN")   return <Navigate to="/dashboard/admin"   replace />;
  if (user.role === "STAFF")   return <Navigate to="/dashboard/staff"   replace />;
  if (user.role === "STUDENT") return <Navigate to="/dashboard/student" replace />;
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />

            {/* Login routes — all 3 roles */}
            <Route path="/login/admin"   element={<Login />} />
            <Route path="/login/student" element={<Login />} />
            <Route path="/login/staff"   element={<Login />} />

            {/* Signup routes — Student & Staff only (no admin signup) */}
            <Route path="/signup/student" element={<Signup />} />
            <Route path="/signup/staff"   element={<Signup />} />

            {/* Auto-redirect to role dashboard */}
            <Route path="/dashboard" element={<RoleRedirect />} />

            {/* Protected role dashboards */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/room"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <MyRoom />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/complaints"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Complaints />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/leave"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Leave />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/student/cleaning"
              element={
                <ProtectedRoute requiredRole="STUDENT">
                  <Cleaning />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute requiredRole="STAFF">
                  <StaffDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/help"
              element={
                <ProtectedRoute>
                  <Support />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
