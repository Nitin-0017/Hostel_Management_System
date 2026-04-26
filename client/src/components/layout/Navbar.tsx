import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import adminService from "../../services/adminService";
import notificationService from "../../services/notificationService";
import staffService from "../../services/staffService";
import "./Navbar.css";

const ROLE_LABELS: Record<string, string> = {
  STUDENT: "Student",
  STAFF: "Staff",
  ADMIN: "Admin",
};

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  const [notifications, setNotifications] = useState<Notification[]>([]);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user?.role === "ADMIN") {
          // Admin sees open complaints and pending leaves as notifications
          const [complaintsRes, leavesRes] = await Promise.all([
            adminService.getComplaints(1, 20),
            adminService.getLeaves(1, 20)
          ]);
          
          const adminLastReadRaw = localStorage.getItem('admin_last_read');
          const adminLastRead = adminLastReadRaw ? new Date(adminLastReadRaw) : new Date(0);

          const combined: Notification[] = [];
          
          complaintsRes.data.forEach(c => {
            if (c.status === "OPEN" || c.status === "IN_PROGRESS") {
              const createdAt = new Date(c.createdAt);
              combined.push({
                id: `comp_${c.id}`,
                type: "warning",
                title: `New Complaint: ${c.category}`,
                message: c.subject,
                timestamp: createdAt,
                read: createdAt <= adminLastRead
              });
            }
          });
          
          leavesRes.data.forEach(l => {
            if (l.status === "PENDING") {
              const createdAt = new Date(l.createdAt);
              combined.push({
                id: `leave_${l.id}`,
                type: "info",
                title: "Leave Request",
                message: "A student has requested leave",
                timestamp: createdAt,
                read: createdAt <= adminLastRead
              });
            }
          });
          
          combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setNotifications(combined.slice(0, 10));
        } else if (user?.role === "STAFF") {
          const res = await staffService.getNotifications(1, 10);
          const mapped: Notification[] = res.data.map(n => ({
            id: n.id,
            type: n.type === "GENERAL" || n.type === "INFO" ? "info" : "warning",
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt),
            read: n.isRead
          }));
          setNotifications(mapped);
        } else if (user) {
          const res = await notificationService.getMyNotifications(1, 10);
          const mapped: Notification[] = res.data.map(n => ({
            id: n.id,
            type: n.type === "GENERAL" || n.type === "INFO" ? "info" : "warning",
            title: n.title,
            message: n.message,
            timestamp: new Date(n.createdAt),
            read: n.isRead
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
    // Refresh notifications periodically
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAllRead = async () => {
    if (user?.role === "ADMIN") {
      localStorage.setItem('admin_last_read', new Date().toISOString());
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } else if (user) {
      try {
        if (user.role === "STAFF") {
          await staffService.markAllNotificationsRead();
        } else {
          await notificationService.markAllRead();
        }
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      } catch (err) {
        console.error("Failed to mark all as read:", err);
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <div className="navbar-left">
          <h1 className="page-title">Dashboard</h1>
        </div>


        <div className="navbar-right">

          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <Icon name="search" size="md" className="search-icon" />
          </div>


          <div className="notification-wrapper">
            <button
              className="icon-btn notification-btn"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
              title="Notifications"
            >
              <Icon name="bell" size="md" />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <button className="mark-read-btn" onClick={handleMarkAllRead}>Mark all as read</button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${notif.type} ${
                          !notif.read ? "unread" : ""
                        }`}
                      >
                        <span className={`notif-icon notif-${notif.type}`}>
                          {notif.type === "info" && <Icon name="bell" size="md" />}
                          {notif.type === "success" && "✅"}
                          {notif.type === "warning" && "⚠️"}
                          {notif.type === "error" && "❌"}
                        </span>
                        <div className="notif-content">
                          <div className="notif-title">{notif.title}</div>
                          <div className="notif-message">{notif.message}</div>
                          <div className="notif-time">
                            {getTimeAgo(notif.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">No notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>


          <div className="profile-wrapper">
            <button
              className="profile-btn"
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
              title="Profile"
            >
              <div className="avatar">
                <span>
                  {user
                    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "U"
                    : "U"}
                </span>
              </div>
              <div className="profile-info">
                <div className="profile-name">
                  {user ? `${user.firstName} ${user.lastName}` : "Student"}
                </div>
                <div className="profile-role">
                  {user?.role ? ROLE_LABELS[user.role] ?? user.role : "Guest"}
                </div>
              </div>
              <span className="dropdown-icon">
                <Icon name="chevron-down" size="sm" />
              </span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <button className="dropdown-item" onClick={() => {
                  if (user?.role === 'STAFF') navigate('/dashboard/staff/profile');
                  else navigate('/profile');
                }}>
                  <Icon name="user" size="sm" /> My Profile
                </button>
                <button className="dropdown-item" onClick={() => navigate("/settings")}>
                  <Icon name="settings" size="sm" /> Settings
                </button>
                <button className="dropdown-item" onClick={() => navigate("/help")}>
                  <Icon name="help" size="sm" /> Help & Support
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={logout}>
                  <Icon name="logout" size="sm" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
