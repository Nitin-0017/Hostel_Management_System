import React from "react";
import AdminSidebar from "../layout/AdminSidebar";
import Navbar from "../layout/Navbar";
import "./DashboardLayout.css";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="dashboard-layout">
      <AdminSidebar />
      <div className="layout-container">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
