import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminReport } from "../../services/adminService";
import "./AdminPages.css";

const ANNOUNCEMENT_TYPES = [
  { value: "ANNOUNCEMENT", icon: "bell" as const, label: "Announcement" },
  { value: "ALERT", icon: "activity" as const, label: "Alert" },
  { value: "INFO", icon: "help" as const, label: "Info" },
  { value: "REMINDER", icon: "calendar" as const, label: "Reminder" },
];

const AdminAnnouncements: React.FC = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("ANNOUNCEMENT");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Reports section
  const [reports, setReports] = useState<IAdminReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    setReportsLoading(true);
    try {
      const data = await adminService.getReports();
      setReports(data);
    } catch (err: any) {
      console.error("Failed to load reports:", err);
    } finally {
      setReportsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message are required.");
      return;
    }
    setSending(true);
    try {
      await adminService.sendNotification({
        type,
        title: title.trim(),
        message: message.trim(),
        broadcast: true,
      });
      showSuccess("Announcement broadcast to all users successfully!");
      setTitle("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const handleGenerateReport = async (reportType: "occupancy" | "complaints" | "leaves") => {
    setGeneratingType(reportType);
    try {
      if (reportType === "occupancy") await adminService.generateOccupancyReport();
      else if (reportType === "complaints") await adminService.generateComplaintReport();
      else await adminService.generateLeaveReport();
      showSuccess(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated!`);
      fetchReports();
    } catch (err: any) {
      setError(err.message || "Failed to generate report");
    } finally {
      setGeneratingType(null);
    }
  };

  const formatReportDate = (iso: string) =>
    new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="bell" size="lg" color="var(--color-navy)" />
              Announcements & Reports
            </h1>
            <p className="page-subtitle">Broadcast notifications and generate reports</p>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        {successMsg && (
          <div className="alert alert-success" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <Icon name="check-circle" size="md" />
            {successMsg}
          </div>
        )}

        <div className="announcements-layout">
          {/* ── Composer ──────────────────────────────────────────────── */}
          <div className="form-card announcement-card">
            <h3 className="form-title">
              <Icon name="bell" size="sm" color="var(--color-navy)" />
              Broadcast to All Users
            </h3>
            <p className="form-desc">
              This will send a notification to every student and staff member in the system.
            </p>

            <div className="form-field">
              <label>Notification Type</label>
              <div className="type-pills">
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <button
                    key={t.value}
                    className={`type-pill ${type === t.value ? "active" : ""}`}
                    onClick={() => setType(t.value)}
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
                  >
                    <Icon name={t.icon} size="sm" />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="ann-title">Title</label>
              <input
                id="ann-title"
                className="form-input"
                placeholder="e.g. Water Maintenance 15th April"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label htmlFor="ann-message">Message</label>
              <textarea
                id="ann-message"
                className="form-input"
                rows={5}
                placeholder="Write your announcement message here…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ resize: "vertical" }}
              />
            </div>

            <button
              className="primary-btn full-width"
              onClick={handleSend}
              disabled={sending}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <Icon name="bell" size="sm" />
              {sending ? "Sending…" : "Broadcast Announcement"}
            </button>
          </div>

          {/* ── Reports ───────────────────────────────────────────────── */}
          <div>
            <div className="form-card report-generate-card">
              <h3 className="form-title">
                <Icon name="reports" size="sm" color="var(--color-navy)" />
                Generate Reports
              </h3>
              <p className="form-desc">Snapshot current data into a saved report.</p>
              <div className="report-buttons">
                <button
                  className="report-gen-btn"
                  onClick={() => handleGenerateReport("occupancy")}
                  disabled={!!generatingType}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Icon name="room" size="sm" color="var(--color-textSecondary)" />
                  {generatingType === "occupancy" ? "Generating…" : "Occupancy Report"}
                </button>
                <button
                  className="report-gen-btn"
                  onClick={() => handleGenerateReport("complaints")}
                  disabled={!!generatingType}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Icon name="complaints" size="sm" color="var(--color-textSecondary)" />
                  {generatingType === "complaints" ? "Generating…" : "Complaint Report"}
                </button>
                <button
                  className="report-gen-btn"
                  onClick={() => handleGenerateReport("leaves")}
                  disabled={!!generatingType}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Icon name="leave" size="sm" color="var(--color-textSecondary)" />
                  {generatingType === "leaves" ? "Generating…" : "Leave Report"}
                </button>
              </div>
            </div>

            <div className="form-card" style={{ marginTop: "1.25rem" }}>
              <h3 className="form-title">Recent Reports</h3>
              {reportsLoading ? (
                <div className="loading-state" style={{ padding: "1rem 0" }}>
                  <div className="spinner" />
                  <p>Loading reports…</p>
                </div>
              ) : reports.length === 0 ? (
                <div className="empty-state" style={{ padding: "1.5rem 0" }}>
                  <Icon name="reports" size="lg" color="var(--color-textSecondary)" />
                  <p>No reports generated yet.</p>
                </div>
              ) : (
                <div className="reports-list">
                  {[...reports]
                    .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
                    .slice(0, 10)
                    .map((report) => (
                      <div key={report.id} className="report-item">
                        <div className="report-icon" style={{ display: "flex", alignItems: "center" }}>
                          <Icon name={report.type === "OCCUPANCY" ? "room" : report.type === "COMPLAINT" ? "complaints" : "leave"} size="md" color="var(--color-navy)" />
                        </div>
                        <div className="report-info">
                          <span className="report-title">{report.title}</span>
                          <span className="report-date">{formatReportDate(report.generatedAt)}</span>
                        </div>
                        <span className={`status-chip chip-neutral`} style={{ fontSize: "0.72rem" }}>
                          {report.type}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .announcements-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .announcements-layout { grid-template-columns: 1fr; }
        }
        .announcement-card, .report-generate-card { height: fit-content; }
        .form-desc {
          font-size: 0.875rem;
          color: var(--color-textSecondary, #6b7280);
          margin-bottom: 1.25rem;
          line-height: 1.5;
        }
        .type-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .type-pill {
          padding: 0.4rem 0.9rem;
          border-radius: 20px;
          border: 1.5px solid var(--color-border, #e5e7eb);
          background: #f9fafb;
          cursor: pointer;
          font-size: 0.83rem;
          transition: all 0.15s;
          font-family: inherit;
        }
        .type-pill.active {
          background: #2F4156;
          color: white;
          border-color: #2F4156;
        }
        .type-pill:hover:not(.active) { border-color: #2F4156; }
        .report-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .report-gen-btn {
          width: 100%;
          padding: 0.7rem 1rem;
          border: 1.5px solid var(--color-border, #e5e7eb);
          border-radius: 8px;
          background: #f9fafb;
          cursor: pointer;
          font-size: 0.9rem;
          font-family: inherit;
          text-align: left;
          transition: all 0.15s;
          color: var(--color-text, #1a1a2e);
        }
        .report-gen-btn:hover:not(:disabled) {
          background: #2F4156;
          color: white;
          border-color: #2F4156;
        }
        .report-gen-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .reports-list { display: flex; flex-direction: column; gap: 0.6rem; }
        .report-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.6rem 0.75rem;
          border-radius: 8px;
          background: #f9fafb;
          border: 1px solid var(--color-border, #e5e7eb);
        }
        .report-icon { font-size: 1.2rem; }
        .report-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .report-title { font-size: 0.88rem; font-weight: 500; color: var(--color-text, #1a1a2e); }
        .report-date { font-size: 0.75rem; color: var(--color-textSecondary, #6b7280); }
        .full-width { width: 100%; }
      `}</style>
    </AdminDashboardLayout>
  );
};

export default AdminAnnouncements;
