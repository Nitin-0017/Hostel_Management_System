import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import Card from "../../components/dashboard/Card";
import Button from "../../components/dashboard/Button";
import Icon from "../../components/dashboard/Icon";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import adminService from "../../services/adminService";
import type {
  IAdminStudent,
  IAdminRoom,
  IAdminComplaint,
  IAdminLeave,
} from "../../services/adminService";
import "./AdminDashboard.css";


// ── Helpers ──────────────────────────────────────────────────────────────────
const getOccupancyColor = (pct: number) => {
  if (pct >= 85) return "var(--color-navy)";
  if (pct >= 70) return "var(--color-teal)";
  return "var(--color-success)";
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ── Component ────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── State ────────────────────────────────────────────────────────────────
  const [students, setStudents] = useState<IAdminStudent[]>([]);
  const [rooms, setRooms] = useState<IAdminRoom[]>([]);
  const [complaints, setComplaints] = useState<IAdminComplaint[]>([]);
  const [leaves, setLeaves] = useState<IAdminLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);

  // Announcement form state
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // ── Fetch all data ───────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, r, c, l] = await Promise.all([
        adminService.getStudents(1, 200),
        adminService.getRooms(1, 200),
        adminService.getComplaints(1, 200),
        adminService.getLeaves(1, 200),
      ]);
      setStudents(s.data);
      setRooms(r.data);
      setComplaints(c.data);
      setLeaves(l.data);
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Derived stats ────────────────────────────────────────────────────────
  const totalStudents = students.length;
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => !r.isAvailable || r.occupied > 0).length;
  const openComplaints = complaints.filter((c) => c.status === "OPEN").length;
  const pendingLeaves = leaves.filter((l) => l.status === "PENDING");

  // Complaint pie data
  const complaintPie = [
    { name: "Resolved", value: complaints.filter((c) => c.status === "RESOLVED").length, color: "#10B981" },
    { name: "In Progress", value: complaints.filter((c) => c.status === "IN_PROGRESS").length, color: "#F59E0B" },
    { name: "Open", value: complaints.filter((c) => c.status === "OPEN").length, color: "#EF4444" },
    { name: "Rejected", value: complaints.filter((c) => c.status === "REJECTED").length, color: "#567C8D" },
  ].filter((s) => s.value > 0);

  // Room block breakdown grouped by building
  const blockMap = rooms.reduce<Record<string, { occupied: number; total: number }>>((acc, room) => {
    const key = room.building || "Other";
    if (!acc[key]) acc[key] = { occupied: 0, total: 0 };
    acc[key].total += 1;
    if (room.occupied > 0 || !room.isAvailable) acc[key].occupied += 1;
    return acc;
  }, {});

  const blockInfo = Object.entries(blockMap).map(([block, info]) => ({ block, ...info }));

  // ── Derived chart data ───────────────────────────────────────────────────
  // Generate last 6 months for labels
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      monthName: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      endOfMonth: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
    };
  });

  const intakeTrend = last6Months.map(({ monthName, year, month }) => {
    const count = students.filter((s) => {
      const d = new Date(s.user.createdAt || s.joiningDate || new Date());
      return d.getFullYear() === year && d.getMonth() === month;
    }).length;
    return { month: monthName, students: count };
  });

  const occupancyTrend = last6Months.map(({ monthName, endOfMonth }) => {
    const capacityAtTime = rooms
      .filter((r) => new Date(r.createdAt || new Date()) <= endOfMonth)
      .reduce((sum, r) => sum + (r.capacity || 0), 0);

    const occupiedCount = students.filter((s) => {
      if (!s.roomAllocation) return false;
      const d = new Date(s.user.createdAt || s.joiningDate || new Date());
      return d <= endOfMonth;
    }).length;

    const rate = capacityAtTime > 0 ? Math.round((occupiedCount / capacityAtTime) * 100) : 0;
    return { month: monthName, rate };
  });

  // ── Leave actions ─────────────────────────────────────────────────────────
  const handleApproveLeave = async (id: string) => {
    try {
      await adminService.approveLeave(id, "Approved by admin");
      fetchAll();
    } catch (err: any) {
      setActionError(err.message || "Failed to approve leave");
    }
  };

  const handleRejectLeave = async (id: string) => {
    try {
      await adminService.rejectLeave(id, "Rejected by admin");
      fetchAll();
    } catch (err: any) {
      setActionError(err.message || "Failed to reject leave");
    }
  };

  // ── Announcement submit ───────────────────────────────────────────────────
  const handlePostAnnouncement = async () => {
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;
    setSendingAnnouncement(true);
    try {
      await adminService.sendNotification({
        type: "GENERAL",
        title: announcementTitle.trim(),
        message: announcementMsg.trim(),
        broadcast: true,
      });
      setAnnouncementTitle("");
      setAnnouncementMsg("");
      setAnnouncementSuccess(true);
      setTimeout(() => setAnnouncementSuccess(false), 3000);
    } catch (err: any) {
      setActionError(err.message || "Failed to send announcement");
    } finally {
      setSendingAnnouncement(false);
    }
  };

  // ── Skeleton loader ───────────────────────────────────────────────────────
  const Skeleton = ({ width = "100%", height = "1.2rem" }: { width?: string; height?: string }) => (
    <div
      style={{
        width,
        height,
        borderRadius: "6px",
        background: "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
        display: "inline-block",
      }}
    />
  );

  return (
    <AdminDashboardLayout>
      <div className="admin-dashboard">
        {/* Error banner */}
        {actionError && (
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#dc2626",
              padding: "0.75rem 1.25rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{actionError}</span>
            <button onClick={() => setActionError(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem" }}>×</button>
          </div>
        )}

        {/* Welcome Section */}
        <section className="welcome-section">
          <div className="welcome-header">
            <div>
              <h1>Welcome back, {user ? `${user.firstName}` : "Admin"}!</h1>
              <p>Here's your hostel management overview</p>
            </div>
            <div className="welcome-right">
              <div className="welcome-date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <span className="role-badge">Administrator</span>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <StatCard
              label="Total Students"
              value={loading ? <Skeleton width="60px" height="2rem" /> : totalStudents}
              icon={<Icon name="user" size="lg" />}
              color="primary"
              onClick={() => navigate("/dashboard/admin/students")}
            />
            <StatCard
              label="Rooms Occupied"
              value={loading ? <Skeleton width="80px" height="2rem" /> : `${occupiedRooms}/${totalRooms}`}
              icon={<Icon name="room" size="lg" />}
              color="success"
              onClick={() => navigate("/dashboard/admin/rooms")}
            />
            <StatCard
              label="Pending Leaves"
              value={loading ? <Skeleton width="40px" height="2rem" /> : pendingLeaves.length}
              icon={<Icon name="leave" size="lg" />}
              color="info"
              onClick={() => navigate("/dashboard/admin/leave")}
            />
            <StatCard
              label="Open Complaints"
              value={loading ? <Skeleton width="40px" height="2rem" /> : openComplaints}
              icon={<Icon name="complaints" size="lg" />}
              color="warning"
              onClick={() => navigate("/dashboard/admin/complaints")}
            />
          </div>
        </section>

        {/* Charts Row */}
        <section className="charts-row">
          {/* Occupancy Trend */}
          <Card
            icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
            title="Occupancy Trend"
            subtitle="Derived from allocations (last 6 mo)"
          >
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }} />
                <YAxis domain={[50, 100]} unit="%" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
                <Line type="monotone" dataKey="rate" stroke="#2F4156" strokeWidth={2.5} dot={{ fill: "#2F4156", r: 4 }} activeDot={{ r: 6, fill: "#567C8D" }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Complaint Status Pie */}
          <Card
            icon={<Icon name="complaints" size="lg" color="var(--color-navy)" />}
            title="Complaint Status"
            subtitle={loading ? "Loading…" : `${complaints.length} total`}
          >
            <div className="chart-donut-wrapper">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={loading || complaintPie.length === 0 ? [{ name: "No data", value: 1, color: "#e5e7eb" }] : complaintPie}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={3} dataKey="value"
                  >
                    {(loading || complaintPie.length === 0
                      ? [{ color: "#e5e7eb" }]
                      : complaintPie
                    ).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => v} contentStyle={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
                  {!loading && complaintPie.length > 0 && (
                    <Legend iconType="circle" iconSize={8} formatter={(value) => <span style={{ fontSize: 12, color: "var(--color-text)" }}>{value}</span>} />
                  )}
                </PieChart>
              </ResponsiveContainer>
              <div className="chart-donut-center">
                <div className="donut-total">{loading ? "–" : complaints.length}</div>
                <div className="donut-label">Total</div>
              </div>
            </div>
          </Card>

          {/* Student Intake */}
          <Card
            icon={<Icon name="user" size="lg" color="var(--color-navy)" />}
            title="Student Intake"
            subtitle="New registrations (last 6 mo)"
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={intakeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-textSecondary)" }} />
                <Tooltip formatter={(v) => v} contentStyle={{ background: "white", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="students" fill="#2F4156" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Left column */}
          <div className="grid-column grid-column-left">

            {/* Room Occupancy by Block */}
            <Card
              icon={<Icon name="room" size="lg" color="var(--color-navy)" />}
              title="Room Occupancy"
              subtitle="Block-wise breakdown"
            >
              <div className="room-occupancy">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="block-row">
                      <Skeleton width="70px" />
                      <Skeleton width="40px" />
                      <div className="block-bar-wrap"><div className="occupancy-bar" /></div>
                      <Skeleton width="35px" />
                    </div>
                  ))
                ) : blockInfo.length === 0 ? (
                  <p style={{ color: "var(--color-textSecondary)", fontSize: "0.9rem" }}>No room data available.</p>
                ) : (
                  blockInfo.map(({ block, occupied, total }) => {
                    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;
                    return (
                      <div key={block} className="block-row">
                        <span className="block-label">{block}</span>
                        <span className="block-count">{occupied}/{total}</span>
                        <div className="block-bar-wrap">
                          <div className="occupancy-bar">
                            <div className="occupancy-fill" style={{ width: `${pct}%`, background: getOccupancyColor(pct) }} />
                          </div>
                        </div>
                        <span className="block-percent">{pct}%</span>
                      </div>
                    );
                  })
                )}
              </div>
              <footer className="card-action-footer">
                <Button label="Manage Rooms" variant="ghost" size="sm" onClick={() => navigate("/dashboard/admin/rooms")} />
              </footer>
            </Card>

            {/* Recent Complaints Preview */}
            <Card
              icon={<Icon name="complaints" size="lg" color="var(--color-navy)" />}
              title="Recent Complaints"
              subtitle="Latest 5"
            >
              <div className="activity-list">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="activity-item">
                      <Skeleton width="100%" height="1.4rem" />
                    </div>
                  ))
                ) : complaints.length === 0 ? (
                  <p style={{ color: "var(--color-textSecondary)", fontSize: "0.9rem" }}>No complaints yet.</p>
                ) : (
                  [...complaints]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)
                    .map((c) => (
                      <div key={c.id} className="activity-item">
                        <span className="activity-icon">
                          <Icon
                            name="complaints"
                            size="md"
                            color={
                              c.status === "OPEN" ? "var(--color-warning)"
                                : c.status === "RESOLVED" ? "var(--color-success)"
                                : "var(--color-info)"
                            }
                          />
                        </span>
                        <div className="activity-content">
                          <p className="activity-title">{c.subject}</p>
                          <p className="activity-time">
                            {c.status} · {formatDate(c.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
              <footer className="card-action-footer">
                <Button label="Manage Complaints" variant="ghost" size="sm" onClick={() => navigate("/dashboard/admin/complaints")} />
              </footer>
            </Card>

            {/* Announcement Composer */}
            <Card
              icon={<Icon name="bell" size="lg" color="var(--color-navy)" />}
              title="Post Announcement"
              subtitle="Broadcasts to all students and staff"
            >
              {announcementSuccess && (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", padding: "0.75rem 1rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.9rem" }}>
                  ✅ Announcement sent successfully to all users!
                </div>
              )}
              <div className="announcement-form">
                <input
                  id="announcement-title"
                  className="announcement-input"
                  type="text"
                  placeholder="Title (e.g. Water Maintenance 15th April)"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                />
                <textarea
                  id="announcement-message"
                  className="announcement-textarea"
                  placeholder="Write your announcement message here…"
                  rows={3}
                  value={announcementMsg}
                  onChange={(e) => setAnnouncementMsg(e.target.value)}
                />
                <Button
                  label={sendingAnnouncement ? "Sending…" : "Broadcast to All"}
                  fullWidth
                  onClick={handlePostAnnouncement}
                />
              </div>
              <footer className="card-action-footer" style={{ marginTop: "1rem" }}>
                <Button label="View All Announcements" variant="ghost" size="sm" onClick={() => navigate("/dashboard/admin/announcements")} />
              </footer>
            </Card>
          </div>

          {/* Right column */}
          <div className="grid-column grid-column-right">

            {/* Quick Actions */}
            <Card icon={<Icon name="bolt" size="lg" color="var(--color-navy)" />} title="Quick Actions">
              <div className="quick-actions">
                <Button label="Manage Students" icon={<Icon name="user" size="sm" />} fullWidth onClick={() => navigate("/dashboard/admin/students")} />
                <Button label="Manage Rooms" icon={<Icon name="room" size="sm" />} fullWidth onClick={() => navigate("/dashboard/admin/rooms")} />
                <Button label="Manage Complaints" icon={<Icon name="complaints" size="sm" />} fullWidth onClick={() => navigate("/dashboard/admin/complaints")} />
                <Button label="Post Announcement" icon={<Icon name="bell" size="sm" />} fullWidth onClick={() => navigate("/dashboard/admin/announcements")} />
              </div>
            </Card>

            {/* Pending Leave Approvals */}
            <Card
              icon={<Icon name="leave" size="lg" color="var(--color-navy)" />}
              title="Pending Leave Approvals"
              subtitle={loading ? "Loading…" : `${pendingLeaves.length} pending`}
            >
              <div className="approvals-list">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <div key={i} className="approval-item">
                      <Skeleton width="100%" height="2.5rem" />
                    </div>
                  ))
                ) : pendingLeaves.length === 0 ? (
                  <p style={{ color: "var(--color-textSecondary)", fontSize: "0.9rem", padding: "0.5rem 0" }}>
                    No pending leave requests.
                  </p>
                ) : (
                  pendingLeaves.slice(0, 5).map((leave) => {
                    const name = leave.student
                      ? `${leave.student.user.firstName} ${leave.student.user.lastName}`
                      : leave.studentId.slice(0, 8) + "…";
                    const from = formatDate(leave.fromDate);
                    const to = formatDate(leave.toDate);
                    return (
                      <div key={leave.id} className="approval-item">
                        <div className="approval-info">
                          <span className="approval-icon">
                            <Icon name="leave" size="md" color="var(--color-warning)" />
                          </span>
                          <div className="approval-text">
                            <p>{name}</p>
                            <small>{from} → {to}</small>
                          </div>
                        </div>
                        <div className="approval-actions">
                          <Button
                            label="Reject"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRejectLeave(leave.id)}
                          />
                          <Button
                            label="Approve"
                            variant="primary"
                            size="sm"
                            onClick={() => handleApproveLeave(leave.id)}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <footer className="card-action-footer">
                <Button label="View All Leave Requests" variant="ghost" size="sm" onClick={() => navigate("/dashboard/admin/leave")} />
              </footer>
            </Card>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .announcement-form {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
          }
          .announcement-input,
          .announcement-textarea {
            width: 100%;
            padding: 0.65rem 0.9rem;
            border: 1px solid var(--color-border, #e5e7eb);
            border-radius: 8px;
            font-size: 0.9rem;
            font-family: inherit;
            background: #fafafa;
            color: var(--color-text, #1a1a2e);
            outline: none;
            resize: vertical;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          .announcement-input:focus,
          .announcement-textarea:focus {
            border-color: var(--color-navy, #2F4156);
          }
        `}</style>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;