import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import type { IconName } from "../dashboard/Icon";
import "./AdminSidebar.css";
import "./Sidebar.css";

interface SidebarItem {
  id: string;
  label: string;
  iconName: IconName;
  path: string;
  badge?: number;
}

interface SidebarGroup {
  groupLabel: string;
  items: SidebarItem[];
}

const staffNavGroups: SidebarGroup[] = [
  {
    groupLabel: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", iconName: "dashboard", path: "/dashboard/staff" },
    ],
  },
  {
    groupLabel: "Management",
    items: [
      { id: "students", label: "Students", iconName: "users", path: "/dashboard/staff/students" },
      { id: "rooms", label: "Rooms", iconName: "room", path: "/dashboard/staff/rooms" },
      { id: "cleaning", label: "Cleaning", iconName: "cleaning", path: "/dashboard/staff/cleaning" },
    ],
  },
  {
    groupLabel: "Requests",
    items: [
      { id: "complaints", label: "Complaints", iconName: "complaints", path: "/dashboard/staff/complaints", badge: 4 },
      { id: "leave", label: "Leave Requests", iconName: "leave", path: "/dashboard/staff/leave", badge: 2 },
      { id: "announcements", label: "Announcements", iconName: "bell", path: "/dashboard/staff/announcements" },
    ],
  },
];

const StaffSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`sidebar admin-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">
            <Icon name="dashboard" size="lg" />
          </span>
          {!isCollapsed && (
            <div className="logo-text-group">
              <span className="logo-text">HostelHub</span>
              <span className="logo-role-badge">Staff</span>
            </div>
          )}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {staffNavGroups.map((group) => (
          <div className="nav-group" key={group.groupLabel}>
            {!isCollapsed && <span className="nav-group-label">{group.groupLabel}</span>}
            <ul className="nav-list">
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => navigate(item.path)}
                    title={isCollapsed ? item.label : ""}
                  >
                    <span className="nav-icon">
                      <Icon name={item.iconName} size="md" />
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-label">{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="admin-profile-chip">
            <div className="admin-avatar">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="admin-profile-info">
              <p className="admin-name">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="admin-role">Staff Member</p>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <span className="icon">
            <Icon name="logout" size="md" />
          </span>
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default StaffSidebar;
