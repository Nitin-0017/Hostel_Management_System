import React from "react";
import StaffSidebar from "./StaffSidebar";
import Navbar from "./Navbar";
import "./DashboardLayout.css";

const StaffDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <StaffSidebar />
      <div className="layout-container">
        <Navbar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default StaffDashboardLayout;
