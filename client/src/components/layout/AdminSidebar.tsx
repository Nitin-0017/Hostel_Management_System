import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import type { IconName } from "../dashboard/Icon";
import adminService from "../../services/adminService";
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

const buildNavGroups = (openComplaints: number, pendingLeaves: number, pendingCleaning: number): SidebarGroup[] => [
  {
    groupLabel: "Overview",
    items: [
      { id: "dashboard",  label: "Dashboard",    iconName: "dashboard", path: "/dashboard/admin" },
      { id: "announcements", label: "Announcements", iconName: "bell",  path: "/dashboard/admin/announcements" },
    ],
  },
  {
    groupLabel: "Management",
    items: [
      { id: "students", label: "Students",       iconName: "users",  path: "/dashboard/admin/students" },
      { id: "staff",    label: "Staff",            iconName: "user",   path: "/dashboard/admin/staff" },
      { id: "rooms",    label: "Rooms",           iconName: "room",   path: "/dashboard/admin/rooms" },
    ],
  },
  {
    groupLabel: "Requests",
    items: [
      { id: "complaints", label: "Complaints",     iconName: "complaints", path: "/dashboard/admin/complaints", badge: openComplaints || undefined },
      { id: "leave",      label: "Leave Requests", iconName: "leave",      path: "/dashboard/admin/leave",      badge: pendingLeaves || undefined },
      { id: "cleaning",   label: "Cleaning",        iconName: "zap",        path: "/dashboard/admin/cleaning",   badge: pendingCleaning || undefined },
    ],
  },
  {
    groupLabel: "System",
    items: [
      { id: "profile", label: "Profile", iconName: "user", path: "/profile" },
      { id: "settings", label: "Settings", iconName: "settings", path: "/settings" },
      { id: "support", label: "Help & Support", iconName: "help", path: "/help" },
    ],
  },
];



const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openComplaints, setOpenComplaints] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState(0);
  const [pendingCleaning, setPendingCleaning] = useState(0);

  // Fetch live badge counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [c, l, cl] = await Promise.all([
          adminService.getComplaints(1, 200),
          adminService.getLeaves(1, 200),
          adminService.getCleaningRequests(1, 200),
        ]);
        setOpenComplaints(c.data.filter((x) => x.status === "OPEN").length);
        setPendingLeaves(l.data.filter((x) => x.status === "PENDING").length);
        setPendingCleaning(cl.data.filter((x: any) => x.status === "PENDING").length);
      } catch {
        // silent — badges are optional
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 60_000);
    return () => clearInterval(interval);
  }, []);

  const navGroups = buildNavGroups(openComplaints, pendingLeaves, pendingCleaning);

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
        {navGroups.map((group) => (
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
