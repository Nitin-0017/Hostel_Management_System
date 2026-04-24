import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminComplaint } from "../../services/adminService";
import "./AdminPages.css";

const STATUS_COLORS: Record<string, string> = {
  OPEN: "chip-warning",
  IN_PROGRESS: "chip-info",
  RESOLVED: "chip-success",
  REJECTED: "chip-error",
};

const AdminComplaints: React.FC = () => {
  const [complaints, setComplaints] = useState<IAdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED">("ALL");
  const [search, setSearch] = useState("");
  const [noteModal, setNoteModal] = useState<{ id: string; action: "resolve" | "reject"; title: string } | null>(null);
  const [noteText, setNoteText] = useState("");
  const [acting, setActing] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getComplaints(1, 200);
      setComplaints(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleMarkInProgress = async (id: string) => {
    try {
      await adminService.markComplaintInProgress(id);
      showSuccess("Marked as In Progress.");
      fetchComplaints();
    } catch (err: any) {
      setError(err.message || "Action failed");
    }
  };

  const handleSubmitNote = async () => {
    if (!noteModal || !noteText.trim()) return;
    setActing(true);
    try {
      if (noteModal.action === "resolve") {
        await adminService.resolveComplaint(noteModal.id, noteText.trim());
        showSuccess("Complaint resolved.");
      } else {
        await adminService.rejectComplaint(noteModal.id, noteText.trim());
        showSuccess("Complaint rejected.");
      }
      setNoteModal(null);
      setNoteText("");
      fetchComplaints();
    } catch (err: any) {
      setError(err.message || "Action failed");
    } finally {
      setActing(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filter !== "ALL" && c.status !== filter) return false;
    const q = search.toLowerCase();
    return (
      c.subject.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.student?.user.firstName + " " + c.student?.user.lastName).toLowerCase().includes(q)
    );
  });

  const counts = {
    ALL: complaints.length,
    OPEN: complaints.filter((c) => c.status === "OPEN").length,
    IN_PROGRESS: complaints.filter((c) => c.status === "IN_PROGRESS").length,
    RESOLVED: complaints.filter((c) => c.status === "RESOLVED").length,
    REJECTED: complaints.filter((c) => c.status === "REJECTED").length,
  };

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="complaints" size="lg" color="var(--color-navy)" />
              Complaints
            </h1>
            <p className="page-subtitle">Review and resolve student complaints</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{complaints.length} total</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Filter tabs */}
        <div className="filter-tabs">
          {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"] as const).map((tab) => (
            <button
              key={tab}
              className={`filter-tab ${filter === tab ? "active" : ""}`}
              onClick={() => setFilter(tab)}
            >
              {tab.replace("_", " ")}
              <span className="tab-count">{counts[tab]}</span>
            </button>
          ))}
        </div>

        <div className="page-toolbar">
          <div className="search-wrap">
            <Icon name="activity" size="sm" color="var(--color-textSecondary)" />
            <input
              id="complaint-search"
              className="search-input"
              placeholder="Search by subject, category, or student name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Note / resolution modal */}
        {noteModal && (
          <div className="modal-overlay" onClick={() => setNoteModal(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="form-title">{noteModal.action === "resolve" ? "Resolve" : "Reject"} Complaint</h3>
              <p style={{ fontSize: "0.88rem", color: "var(--color-textSecondary)", marginBottom: "0.75rem" }}>
                Regarding: <strong>{noteModal.title}</strong>
              </p>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Enter resolution/rejection note (required)…"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                style={{ resize: "vertical", width: "100%", boxSizing: "border-box" }}
              />
              <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button className="ghost-btn" onClick={() => { setNoteModal(null); setNoteText(""); }}>Cancel</button>
                <button
                  className={noteModal.action === "resolve" ? "primary-btn" : "danger-btn"}
                  onClick={handleSubmitNote}
                  disabled={!noteText.trim() || acting}
                >
                  {acting ? "Submitting…" : noteModal.action === "resolve" ? "Resolve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading complaints…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="complaints" size="lg" color="var(--color-textSecondary)" />
            <p>{search || filter !== "ALL" ? "No complaints match your filter." : "No complaints yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Category</th>
                  <th>Student</th>
                  <th>Status</th>
                  <th>Filed On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((c) => {
                    const studentName = c.student
                      ? `${c.student.user.firstName} ${c.student.user.lastName}`
                      : c.studentId.slice(0, 8) + "…";
                    return (
                      <tr key={c.id}>
                        <td>
                          <div className="cell-primary">{c.subject}</div>
                          <div className="cell-secondary" style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {c.description}
                          </div>
                        </td>
                        <td><span className="category-tag">{c.category}</span></td>
                        <td>{studentName}</td>
                        <td>
                          <span className={`status-chip ${STATUS_COLORS[c.status] || "chip-neutral"}`}>
                            {c.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                        <td>
                          <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                            {c.status === "OPEN" && (
                              <button className="action-btn action-btn-secondary" onClick={() => handleMarkInProgress(c.id)}>
                                In Progress
                              </button>
                            )}
                            {(c.status === "OPEN" || c.status === "IN_PROGRESS") && (
                              <>
                                <button
                                  className="action-btn action-btn-primary"
                                  onClick={() => setNoteModal({ id: c.id, action: "resolve", title: c.subject })}
                                >
                                  Resolve
                                </button>
                                <button
                                  className="action-btn action-btn-danger"
                                  onClick={() => setNoteModal({ id: c.id, action: "reject", title: c.subject })}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {(c.status === "RESOLVED" || c.status === "REJECTED") && (
                              <span style={{ fontSize: "0.8rem", color: "var(--color-textSecondary)" }}>
                                {c.resolutionNote ? `Note: ${c.resolutionNote.slice(0, 30)}…` : "—"}
                              </span>
                            )}
                          </div>
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

export default AdminComplaints;
