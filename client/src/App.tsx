import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* Login routes — all 3 roles */}
          <Route path="/login" element={<Login />} />
          <Route path="/login/admin" element={<Login />} />
          <Route path="/login/student" element={<Login />} />
          <Route path="/login/staff" element={<Login />} />

          {/* Signup routes — Student & Staff only (no admin signup) */}
          <Route path="/signup/student" element={<Signup />} />
          <Route path="/signup/staff" element={<Signup />} />

          {/* Protected dashboards */}
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
            path="/dashboard/staff"
            element={
              <ProtectedRoute requiredRole="STAFF">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
