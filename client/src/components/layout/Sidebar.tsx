import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import "./Sidebar.css";

interface SidebarItem {
  id: string;
  label: string;
  iconName: keyof typeof iconMap;
  path: string;
  badge?: number;
}

const iconMap = {
  dashboard: "dashboard",
  room: "room",
  complaints: "complaints",
  leave: "leave",
  cleaning: "cleaning",
  fees: "fees",
} as const;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      iconName: "dashboard",
      path: "/dashboard/student",
    },
    {
      id: "room",
      label: "My Room",
      iconName: "room",
      path: "/dashboard/student/room",
    },
    {
      id: "complaints",
      label: "Complaints",
      iconName: "complaints",
      path: "/dashboard/student/complaints",
      badge: 2,
    },
    {
      id: "leave",
      label: "Leave Requests",
      iconName: "leave",
      path: "/dashboard/student/leave",
    },
    {
      id: "cleaning",
      label: "Cleaning",
      iconName: "cleaning",
      path: "/dashboard/student/cleaning",
    },
    {
      id: "fees",
      label: "Fees",
      iconName: "fees",
      path: "/dashboard/student/fees",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>

      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">
            <Icon name="dashboard" size="lg" />
          </span>
          {!isCollapsed && <span className="logo-text">HostelHub</span>}
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
        <ul className="nav-list">
          {sidebarItems.map((item) => (
            <li key={item.id}>
              <button
                className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : ""}
              >
                <span className="nav-icon">
                  <Icon name={item.iconName} size="md" />
                </span>
                {!isCollapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="badge">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>


      <div className="sidebar-footer">
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

export default Sidebar;
