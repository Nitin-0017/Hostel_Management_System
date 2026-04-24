import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminLeave } from "../../services/adminService";
import "./AdminPages.css";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "chip-warning",
  APPROVED: "chip-success",
  REJECTED: "chip-error",
  CANCELLED: "chip-neutral",
};

const AdminLeave: React.FC = () => {
  const [leaves, setLeaves] = useState<IAdminLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED">("ALL");
  const [search, setSearch] = useState("");
  const [remarksModal, setRemarksModal] = useState<{ id: string; action: "approve" | "reject"; studentName: string } | null>(null);
  const [remarksText, setRemarksText] = useState("Approved by admin");
  const [acting, setActing] = useState(false);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getLeaves(1, 200);
      setLeaves(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load leaves");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSubmitRemarks = async () => {
    if (!remarksModal || !remarksText.trim()) return;
    setActing(true);
    try {
      if (remarksModal.action === "approve") {
        await adminService.approveLeave(remarksModal.id, remarksText.trim());
        showSuccess(`Leave approved for ${remarksModal.studentName}.`);
      } else {
        await adminService.rejectLeave(remarksModal.id, remarksText.trim());
        showSuccess(`Leave rejected for ${remarksModal.studentName}.`);
      }
      setRemarksModal(null);
      setRemarksText("Approved by admin");
      fetchLeaves();
    } catch (err: any) {
      setError(err.message || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const getDuration = (from: string, to: string) => {
    const diff = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${diff} day${diff > 1 ? "s" : ""}`;
  };

  const filtered = leaves.filter((l) => {
    if (filter !== "ALL" && l.status !== filter) return false;
    const q = search.toLowerCase();
    const name = l.student
      ? `${l.student.user.firstName} ${l.student.user.lastName}`.toLowerCase()
      : "";
    return name.includes(q) || l.reason.toLowerCase().includes(q);
  });

  const counts = {
    ALL: leaves.length,
    PENDING: leaves.filter((l) => l.status === "PENDING").length,
    APPROVED: leaves.filter((l) => l.status === "APPROVED").length,
    REJECTED: leaves.filter((l) => l.status === "REJECTED").length,
    CANCELLED: leaves.filter((l) => l.status === "CANCELLED").length,
  };

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="leave" size="lg" color="var(--color-navy)" />
              Leave Requests
            </h1>
            <p className="page-subtitle">Review and action student leave applications</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{leaves.length} total</span>
            {counts.PENDING > 0 && <span className="count-badge" style={{ background: "#fef3c7", color: "#92400e" }}>{counts.PENDING} pending</span>}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Remarks Modal */}
        {remarksModal && (
          <div className="modal-overlay" onClick={() => setRemarksModal(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="form-title">
                {remarksModal.action === "approve" ? "Approve" : "Reject"} Leave
              </h3>
              <p style={{ fontSize: "0.88rem", color: "var(--color-textSecondary)", marginBottom: "0.75rem" }}>
                Student: <strong>{remarksModal.studentName}</strong>
              </p>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Admin remarks (required)…"
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                style={{ resize: "vertical", width: "100%", boxSizing: "border-box" }}
              />
              <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button className="ghost-btn" onClick={() => setRemarksModal(null)}>Cancel</button>
                <button
                  className={remarksModal.action === "approve" ? "primary-btn" : "danger-btn"}
                  onClick={handleSubmitRemarks}
                  disabled={!remarksText.trim() || acting}
                >
                  {acting ? "Submitting…" : remarksModal.action === "approve" ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filter tabs */}
        <div className="filter-tabs">
          {(["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const).map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
              <span className="tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <div className="page-toolbar">
          <div className="search-wrap">
            <Icon name="activity" size="sm" color="var(--color-textSecondary)" />
            <input
              id="leave-search"
              className="search-input"
              placeholder="Search by student name or reason…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading leave requests…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="leave" size="lg" color="var(--color-textSecondary)" />
            <p>{search || filter !== "ALL" ? "No requests match your filter." : "No leave requests yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Duration</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((leave) => {
                    const studentName = leave.student
                      ? `${leave.student.user.firstName} ${leave.student.user.lastName}`
                      : leave.studentId.slice(0, 8) + "…";
                    return (
                      <tr key={leave.id}>
                        <td>
                          <div className="cell-primary">{studentName}</div>
                          <div className="cell-secondary">{leave.student?.enrollmentNumber}</div>
                        </td>
                        <td>{formatDate(leave.fromDate)}</td>
                        <td>{formatDate(leave.toDate)}</td>
                        <td>{getDuration(leave.fromDate, leave.toDate)}</td>
                        <td>
                          <div style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {leave.reason}
                          </div>
                        </td>
                        <td>
                          <span className={`status-chip ${STATUS_COLORS[leave.status] || "chip-neutral"}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td style={{ fontSize: "0.8rem", color: "var(--color-textSecondary)" }}>
                          {leave.adminRemarks || "—"}
                        </td>
                        <td>
                          {leave.status === "PENDING" && (
                            <div style={{ display: "flex", gap: "0.4rem" }}>
                              <button
                                className="action-btn action-btn-primary"
                                onClick={() => {
                                  setRemarksText("Approved by admin");
                                  setRemarksModal({ id: leave.id, action: "approve", studentName });
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className="action-btn action-btn-danger"
                                onClick={() => {
                                  setRemarksText("");
                                  setRemarksModal({ id: leave.id, action: "reject", studentName });
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminLeave;
