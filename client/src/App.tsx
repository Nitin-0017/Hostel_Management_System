import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

// Future dashboards
import AdminDashboard from "./pages/Dashboard/AdminDashboard"; 
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔹 Landing */}
        <Route path="/" element={<Landing />} />

        <Route path="/login/admin" element={<Login role="admin" />} />
        <Route path="/login/student" element={<Login role="student" />} />

        <Route path="/signup" element={<Signup />} />


        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />

        {/* 🔹 Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;