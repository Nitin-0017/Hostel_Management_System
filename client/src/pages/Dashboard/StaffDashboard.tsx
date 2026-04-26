import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useStaffDashboard } from "../../hooks/useStaffDashboard";
import StaffDashboardLayout from "../../components/layout/StaffDashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Icon from "../../components/dashboard/Icon";
import "./StaffDashboard.css";

const StaffDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useStaffDashboard();

  const pendingCleaning = data?.cleaningRequests.filter((r) => r.status === "PENDING").length ?? 0;
  const inProgressCleaning = data?.cleaningRequests.filter((r) => r.status === "IN_PROGRESS").length ?? 0;
  const completedToday = data?.cleaningRequests.filter((r) => {
    if (r.status !== "COMPLETED" || !r.completedAt) return false;
    const today = new Date().toDateString();
    return new Date(r.completedAt).toDateString() === today;
  }).length ?? 0;
  const unreadNotifs = data?.notifications.filter((n) => !n.isRead).length ?? 0;

  const recentRequests = (data?.cleaningRequests ?? []).slice(0, 5);
  const recentNotifs = (data?.notifications ?? []).slice(0, 4);

  const getHour = () => new Date().getHours();
  const greeting =
    getHour() < 12 ? "Good morning" : getHour() < 17 ? "Good afternoon" : "Good evening";

  return (
    <StaffDashboardLayout>
      <div className="staff-dashboard">

        {/* Welcome Banner */}
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>{greeting}, {user?.firstName ?? "Staff"}!</h1>
              <p>Here's your shift overview for today</p>
            </div>
            <div className="welcome-right">
              <div className="welcome-date">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <span className="role-badge">Staff Member</span>
            </div>
          </div>
        </section>

        {/* Stat Cards */}
        <section className="stats-section">
          {isLoading ? (
            <div className="stats-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-stat-card" />
              ))}
            </div>
          ) : (
            <div className="stats-grid">
              <StatCard
                label="Assigned Rooms"
                value={data?.rooms.length ?? 0}
                icon={<Icon name="room" size="lg" />}
                color="primary"
                onClick={() => navigate("/dashboard/staff/rooms")}
              />
              <StatCard
                label="Pending Requests"
                value={pendingCleaning}
                icon={<Icon name="cleaning" size="lg" />}
                color="warning"
                onClick={() => navigate("/dashboard/staff/cleaning")}
              />
              <StatCard
                label="Completed Today"
                value={completedToday}
                icon={<Icon name="check-circle" size="lg" />}
                color="success"
              />
              <StatCard
                label="Notifications"
                value={unreadNotifs}
                icon={<Icon name="bell" size="lg" />}
                color="info"
              />
            </div>
          )}
        </section>

        {/* Progress Bar */}
        {!isLoading && (data?.cleaningRequests.length ?? 0) > 0 && (
          <section className="progress-section">
            <Card
              icon={<Icon name="activity" size="lg" color="var(--color-navy)" />}
              title="Today's Cleaning Progress"
              subtitle={`${completedToday} of ${(data?.cleaningRequests.length ?? 0)} tasks completed`}
            >
              <div className="progress-bar-wrapper">
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${
                        (data?.cleaningRequests.length ?? 0) > 0
                          ? Math.round((completedToday / (data?.cleaningRequests.length ?? 1)) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <span className="progress-label">
                  {(data?.cleaningRequests.length ?? 0) > 0
                    ? Math.round((completedToday / (data?.cleaningRequests.length ?? 1)) * 100)
                    : 0}%
                </span>
              </div>
              <div className="progress-stats">
                <span className="ps-item ps-pending">
                  <span className="ps-dot" /> {pendingCleaning} Pending
                </span>
                <span className="ps-item ps-inprogress">
                  <span className="ps-dot" /> {inProgressCleaning} In Progress
                </span>
                <span className="ps-item ps-done">
                  <span className="ps-dot" /> {completedToday} Done
                </span>
              </div>
            </Card>
          </section>
        )}

        {/* Main Grid */}
        <div className="dashboard-grid">
          {/* Recent Cleaning Requests */}
          <div className="grid-column grid-column-left">
            <Card
              icon={<Icon name="cleaning" size="lg" color="var(--color-navy)" />}
              title="Recent Cleaning Requests"
              subtitle="Latest requests assigned to you"
            >
              {isLoading ? (
                <div className="skeleton-list">
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton-row" />)}
                </div>
              ) : recentRequests.length === 0 ? (
                <div className="empty-state-inline">
                  <Icon name="check-circle" size="xl" color="var(--color-success)" />
                  <p>No cleaning requests assigned</p>
                </div>
              ) : (
                <div className="task-list">
                  {recentRequests.map((req) => (
                    <div key={req.id} className="task-item">
                      <span className="task-type-icon">
                        <Icon name="cleaning" size="md" color="var(--color-teal)" />
                      </span>
                      <div className="task-content">
                        <p className="task-title">
                          Room {req.room?.roomNumber ?? req.roomId}
                          {req.room?.building ? ` — ${req.room.building}` : ""}
                        </p>
                        <p className="task-meta">
                          <Icon name="clock" size="sm" />
                          {new Date(req.requestedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <span
                        className={`status-badge status-${req.status.toLowerCase().replace("_", "-")}`}
                      >
                        {req.status === "IN_PROGRESS"
                          ? "In Progress"
                          : req.status.charAt(0) + req.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <footer className="card-action-footer">
                <button
                  className="link-btn"
                  onClick={() => navigate("/dashboard/staff/cleaning")}
                >
                  View All Requests →
                </button>
              </footer>
            </Card>
          </div>

          {/* Right column: quick actions + notifications */}
          <div className="grid-column grid-column-right">
            {/* Quick Actions */}
            <Card
              icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />}
              title="Quick Actions"
            >
              <div className="quick-actions">
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/dashboard/staff/cleaning")}
                >
                  <span className="qa-icon">
                    <Icon name="cleaning" size="md" color="var(--color-teal)" />
                  </span>
                  <span className="qa-label">Cleaning Requests</span>
                  <Icon name="chevron-down" size="sm" color="var(--color-gray-400)" />
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/dashboard/staff/rooms")}
                >
                  <span className="qa-icon">
                    <Icon name="room" size="md" color="var(--color-teal)" />
                  </span>
                  <span className="qa-label">View Assigned Rooms</span>
                  <Icon name="chevron-down" size="sm" color="var(--color-gray-400)" />
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/dashboard/staff/complaints")}
                >
                  <span className="qa-icon">
                    <Icon name="complaints" size="md" color="var(--color-warning)" />
                  </span>
                  <span className="qa-label">Manage Complaints</span>
                  <Icon name="chevron-down" size="sm" color="var(--color-gray-400)" />
                </button>
                <button
                  className="quick-action-btn"
                  onClick={() => navigate("/dashboard/staff/profile")}
                >
                  <span className="qa-icon">
                    <Icon name="user" size="md" color="var(--color-info)" />
                  </span>
                  <span className="qa-label">My Profile</span>
                  <Icon name="chevron-down" size="sm" color="var(--color-gray-400)" />
                </button>
              </div>
            </Card>

            {/* Recent Notifications */}
            <Card
              icon={<Icon name="bell" size="lg" color="var(--color-navy)" />}
              title="Recent Notifications"
            >
              {isLoading ? (
                <div className="skeleton-list">
                  {[...Array(3)].map((_, i) => <div key={i} className="skeleton-row" />)}
                </div>
              ) : recentNotifs.length === 0 ? (
                <div className="empty-state-inline">
                  <Icon name="bell" size="xl" color="var(--color-gray-300)" />
                  <p>No new notifications</p>
                </div>
              ) : (
                <div className="notif-list">
                  {recentNotifs.map((n) => (
                    <div key={n.id} className={`notif-item ${!n.isRead ? "unread" : ""}`}>
                      <div className="notif-dot" />
                      <div className="notif-content">
                        <p className="notif-title">{n.title}</p>
                        <p className="notif-msg">{n.message}</p>
                        <p className="notif-time">
                          {new Date(n.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </StaffDashboardLayout>
  );
};

export default StaffDashboard;
