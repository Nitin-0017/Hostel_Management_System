import React, { useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import Icon from "../dashboard/Icon";
import "./Navbar.css";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  const mockNotificationsTimestamp = useMemo(
    () => ({
      now: new Date().getTime(),
    }),
    []
  );

  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Room Maintenance",
      message: "Scheduled maintenance on your floor tomorrow",
      timestamp: new Date(mockNotificationsTimestamp.now - 60000),
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Fee Received",
      message: "Your hostel fees have been confirmed",
      timestamp: new Date(mockNotificationsTimestamp.now - 3600000),
      read: true,
    },
    {
      id: "3",
      type: "warning",
      title: "Leave Request Pending",
      message: "Your leave request is awaiting approval",
      timestamp: new Date(mockNotificationsTimestamp.now - 86400000),
      read: false,
    },
  ]);

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
                    <button className="mark-read-btn">Mark all as read</button>
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
                    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
                    : "U"}
                </span>
              </div>
              <div className="profile-info">
                <div className="profile-name">
                  {user ? `${user.firstName} ${user.lastName}` : "Student"}
                </div>
                <div className="profile-role">
                  {user?.role === "STUDENT" ? "Student" : "Admin"}
                </div>
              </div>
              <span className="dropdown-icon">
                <Icon name="chevron-down" size="sm" />
              </span>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <a href="/profile" className="dropdown-item">
                  <Icon name="user" size="sm" /> My Profile
                </a>
                <a href="/settings" className="dropdown-item">
                  <Icon name="settings" size="sm" /> Settings
                </a>
                <a href="/help" className="dropdown-item">
                  <Icon name="help" size="sm" /> Help & Support
                </a>
                <div className="dropdown-divider" />
                <button className="dropdown-item logout">
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
