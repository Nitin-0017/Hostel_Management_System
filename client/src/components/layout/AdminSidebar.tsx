import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import type { IconName } from "../dashboard/Icon";
import "./AdminSidebar.css";



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



const adminNavGroups: SidebarGroup[] = [
  {
    groupLabel: "Overview",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        iconName: "dashboard",
        path: "/dashboard/admin",
      },
      {
        id: "reports",
        label: "Reports",
        iconName: "reports",
        path: "/dashboard/admin/reports",
      },
    ],
  },
  {
    groupLabel: "Management",
    items: [
      {
        id: "students",
        label: "Students",
        iconName: "users",
        path: "/dashboard/admin/students",
      },
      {
        id: "rooms",
        label: "Rooms",
        iconName: "room",
        path: "/dashboard/admin/rooms",
      },
      {
        id: "fees",
        label: "Fee Management",
        iconName: "fees",
        path: "/dashboard/admin/fees",
      },
      {
        id: "staff",
        label: "Staff",
        iconName: "staff",
        path: "/dashboard/admin/staff",
      },
    ],
  },
  {
    groupLabel: "Requests",
    items: [
      {
        id: "complaints",
        label: "Complaints",
        iconName: "complaints",
        path: "/dashboard/admin/complaints",
        badge: 7,
      },
      {
        id: "leave",
        label: "Leave Requests",
        iconName: "leave",
        path: "/dashboard/admin/leave",
        badge: 3,
      },
      {
        id: "announcements",
        label: "Announcements",
        iconName: "bell",
        path: "/dashboard/admin/announcements",
      },
    ],
  },
  {
    groupLabel: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        iconName: "settings",
        path: "/dashboard/admin/settings",
      },
    ],
  },
];



const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`sidebar admin-sidebar ${isCollapsed ? "collapsed" : ""}`}
    >
      
      <div className="sidebar-header">
        <div className="logo-container">
          <span className="logo-icon">
            <Icon name="dashboard" size="lg" />
          </span>
          {!isCollapsed && (
            <div className="logo-text-group">
              <span className="logo-text">HostelHub</span>
              <span className="logo-role-badge">Admin</span>
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
        {adminNavGroups.map((group) => (
          <div className="nav-group" key={group.groupLabel}>
            {!isCollapsed && (
              <span className="nav-group-label">{group.groupLabel}</span>
            )}
            <ul className="nav-list">
              {group.items.map((item) => (
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
              <p className="admin-role">Administrator</p>
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

export default AdminSidebar;
