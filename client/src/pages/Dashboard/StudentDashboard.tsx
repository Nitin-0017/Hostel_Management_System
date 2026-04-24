import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import Skeleton from "../../components/ui/Skeleton";
import "./StudentDashboard.css";

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { data, isLoading, error, refresh } = useDashboard();
  const navigate = useNavigate();

  // Derived data
  const room = data?.roomAllocation?.room;
  const complaints = data?.complaints || [];
  const leaves = data?.leaves || [];
  const cleanings = data?.cleanings || [];
  const notifications = data?.notifications || [];

  const pendingComplaints = complaints.filter(c => c.status === "OPEN" || c.status === "IN_PROGRESS").length;
  const pendingLeaves = leaves.filter(l => l.status === "PENDING").length;
  const activeCleanings = cleanings.filter(c => c.status === "PENDING" || c.status === "IN_PROGRESS").length;

  // Recent activity (Combine latest items and sort)
  const recentActivity = [
    ...complaints.map(c => ({ id: c.id, type: "complaint", title: `Complaint: ${c.subject}`, date: new Date(c.createdAt), status: c.status })),
    ...leaves.map(l => ({ id: l.id, type: "leave", title: `Leave Request`, date: new Date(l.createdAt), status: l.status })),
    ...cleanings.map(c => ({ id: c.id, type: "cleaning", title: `Cleaning Request`, date: new Date(c.requestedAt), status: c.status }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 4);

  return (
    <DashboardLayout>
      <div className="student-dashboard">
        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>
                Welcome back, {user ? `${user.firstName} ${user.lastName}` : "Student"}!
              </h1>
              <p>Here's your real-time hostel overview</p>
            </div>
            <div className="welcome-date">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </div>
          </div>
        </section>

        {error && (
          <div className="dashboard-error">
            <Icon name="bell" size="md" color="var(--color-danger)" />
            <p>{error}</p>
            <Button label="Retry" variant="ghost" size="sm" onClick={refresh} />
          </div>
        )}

        {/* Stats Grid */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              label="Pending Complaints"
              value={isLoading ? <Skeleton width="40px" height="32px" /> : pendingComplaints}
              icon={<Icon name="complaints" size="lg" />}
              color="warning"
              onClick={() => navigate("/dashboard/student/complaints")}
            />
            <StatCard
              label="Leave Requests"
              value={isLoading ? <Skeleton width="40px" height="32px" /> : pendingLeaves}
              icon={<Icon name="leave" size="lg" />}
              color="info"
              onClick={() => navigate("/dashboard/student/leave")}
            />
            <StatCard
              label="Room Occupancy"
              value={isLoading ? <Skeleton width="60px" height="32px" /> : room ? `${room.occupied}/${room.capacity}` : "N/A"}
              icon={<Icon name="room" size="lg" />}
              color="success"
              onClick={() => navigate("/dashboard/student/room")}
            />
            <StatCard
              label="Cleaning Requests"
              value={isLoading ? <Skeleton width="40px" height="32px" /> : activeCleanings}
              icon={<Icon name="cleaning" size="lg" />}
              color="primary"
              onClick={() => navigate("/dashboard/student/cleaning")}
            />
          </div>
        </section>

        {/* Main Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left Column */}
          <div className="grid-column grid-column-left">
            <Card
              icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
              title="My Room Details"
              subtitle={isLoading ? "" : room ? `Block ${room.building || "N/A"}, Floor ${room.floor}` : "Not Allocated"}
            >
              <div className="room-details">
                {isLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Skeleton height="20px" width="80%" />
                    <Skeleton height="20px" width="60%" />
                    <Skeleton height="20px" width="70%" />
                    <Skeleton height="8px" width="100%" borderRadius="10px" />
                  </div>
                ) : room ? (
                  <>
                    <div className="detail-row">
                      <span className="detail-label">Room Number:</span>
                      <span className="detail-value">{room.roomNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Capacity:</span>
                      <span className="detail-value">
                        {room.occupied}/{room.capacity} Occupied
                      </span>
                    </div>
                    <div className="occupancy-bar">
                      <div
                        className="occupancy-fill"
                        style={{ width: `${(room.occupied / room.capacity) * 100}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <p>You have not been allocated a room yet.</p>
                  </div>
                )}
              </div>
            </Card>

            <Card icon={<Icon name="activity" size="lg" color="var(--color-navy)" />} title="Recent Activity">
              <div className="activity-list">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <div className="activity-item" key={i}>
                      <Skeleton width="40px" height="40px" borderRadius="50%" />
                      <div className="activity-content" style={{ width: '100%' }}>
                        <Skeleton height="16px" width="60%" />
                        <Skeleton height="12px" width="40%" />
                      </div>
                    </div>
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map((act) => (
                    <div className="activity-item" key={`${act.type}-${act.id}`}>
                      <span className={`activity-icon ${act.status.toLowerCase()}`}>
                        <Icon 
                          name={act.type === "complaint" ? "wrench" : act.type === "leave" ? "leave" : "cleaning"} 
                          size="md" 
                        />
                      </span>
                      <div className="activity-content">
                        <p className="activity-title">{act.title}</p>
                        <p className="activity-time">
                          {act.date.toLocaleDateString()} &middot; <span className={`status-badge ${act.status.toLowerCase()}`}>{act.status}</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No recent activity found.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="grid-column grid-column-right">
            <Card icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />} title="Quick Actions">
              <div className="quick-actions">
                <Button label="Submit Complaint" icon={<Icon name="complaints" size="sm" />} fullWidth onClick={() => navigate("/dashboard/student/complaints")} />
                <Button label="Apply for Leave" icon={<Icon name="leave" size="sm" />} fullWidth onClick={() => navigate("/dashboard/student/leave")} />
                <Button label="Request Cleaning" icon={<Icon name="cleaning" size="sm" />} fullWidth onClick={() => navigate("/dashboard/student/cleaning")} />
              </div>
            </Card>

            <Card icon={<Icon name="bell" size="lg" color="var(--color-navy)" />} title="Latest Announcements">
              <div className="announcements-list">
                {isLoading ? (
                  [1, 2, 3].map(i => (
                    <div className="activity-item" key={i}>
                      <Skeleton width="100%" height="1.2rem" />
                    </div>
                  ))
                ) : notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className="activity-item"
                      style={{
                        opacity: n.isRead ? 0.7 : 1,
                        borderLeft: n.isRead ? "3px solid var(--color-teal)" : "3px solid var(--color-navy)",
                      }}
                    >
                      <span className="activity-icon">
                        <Icon name="bell" size="md" color={n.isRead ? "var(--color-teal)" : "var(--color-navy)"} />
                      </span>
                      <div className="activity-content">
                        <p className="activity-title">{n.title}</p>
                        <p className="activity-time" style={{ margin: "2px 0 0 0" }}>
                          {n.message.length > 80 ? n.message.slice(0, 80) + "…" : n.message}
                        </p>
                        <p className="activity-time" style={{ fontSize: "0.7rem", marginTop: "4px" }}>
                          {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>No new announcements.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;