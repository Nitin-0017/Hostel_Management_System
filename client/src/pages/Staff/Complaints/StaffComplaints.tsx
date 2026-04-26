import React, { useState } from "react";
import StaffDashboardLayout from "../../../components/layout/StaffDashboardLayout";
import Icon from "../../../components/dashboard/Icon";
import { useStaffComplaints } from "../../../hooks/useStaffComplaints";
import type { IStaffComplaint } from "../../../services/staffService";
import "./StaffComplaints.css";

type FilterStatus = "ALL" | "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

/* ── Resolve Modal ─────────────────────────────────────────────────────────── */
const ResolveModal: React.FC<{
  open: boolean;
  onConfirm: (note: string) => void;
  onCancel: () => void;
}> = ({ open, onConfirm, onCancel }) => {
  const [note, setNote] = useState("");
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Resolve Complaint</h3>
        <p>Add a resolution note before marking this complaint as resolved.</p>
        <textarea
          className="resolve-textarea"
          placeholder="Describe how the issue was resolved…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={4}
        />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="modal-confirm"
            style={{ background: "var(--color-success)" }}
            disabled={!note.trim()}
            onClick={() => { onConfirm(note.trim()); setNote(""); }}
          >
            ✓ Resolve
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Confirm Modal ─────────────────────────────────────────────────────────── */
const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-confirm" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

/* ── Main page ─────────────────────────────────────────────────────────────── */
const StaffComplaints: React.FC = () => {
  const { complaints, loading, error, updatingId, markInProgress, resolveComplaint, refresh } =
    useStaffComplaints();

  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [resolveTarget, setResolveTarget] = useState<string | null>(null);
  const [progressTarget, setProgressTarget] = useState<string | null>(null);

  const filtered = complaints
    .filter((c) => filter === "ALL" || c.status === filter)
    .filter((c) => {
      const q = search.toLowerCase();
      return (
        c.subject.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.student?.user.firstName?.toLowerCase().includes(q) ||
        c.student?.user.lastName?.toLowerCase().includes(q)
      );
    });

  const counts: Record<FilterStatus, number> = {
    ALL: complaints.length,
    OPEN: complaints.filter((c) => c.status === "OPEN").length,
    IN_PROGRESS: complaints.filter((c) => c.status === "IN_PROGRESS").length,
    RESOLVED: complaints.filter((c) => c.status === "RESOLVED").length,
    REJECTED: complaints.filter((c) => c.status === "REJECTED").length,
  };

  const badgeMap: Record<IStaffComplaint["status"], { label: string; cls: string }> = {
    OPEN: { label: "Open", cls: "status-open" },
    IN_PROGRESS: { label: "In Progress", cls: "status-in-progress" },
    RESOLVED: { label: "Resolved", cls: "status-resolved" },
    REJECTED: { label: "Rejected", cls: "status-rejected" },
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });

  return (
    <StaffDashboardLayout>
      <div className="staff-page">

        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>
              <Icon name="complaints" size="lg" color="var(--color-teal)" /> Complaints
            </h1>
            <p>View and manage student complaints</p>
          </div>
          <div className="page-header-right">
            <button className="btn-secondary" onClick={refresh}>
              <Icon name="activity" size="sm" /> Refresh
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {(["ALL", "OPEN", "IN_PROGRESS", "RESOLVED", "REJECTED"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f === "IN_PROGRESS" ? "In Progress" : f.charAt(0) + f.slice(1).toLowerCase()}
              <span className="tab-count">{counts[f]}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="search-bar-wrapper">
          <span className="search-icon">
            <Icon name="search" size="sm" color="var(--color-gray-400)" />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by subject, category, or student name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="error-banner">
            <Icon name="complaints" size="md" color="var(--color-error)" />
            <span>{error}</span>
            <button onClick={refresh}>Retry</button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="complaints-cards">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-complaint-card" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="check-circle" size="xl" color="var(--color-gray-300)" />
            </div>
            <h3>
              {filter === "ALL" ? "No complaints found" : `No ${filter.toLowerCase()} complaints`}
            </h3>
            <p>{search ? "Try a different search" : "All complaints are handled!"}</p>
          </div>
        )}

        {/* Cards */}
        {!loading && filtered.length > 0 && (
          <div className="complaints-cards">
            {filtered.map((c) => {
              const badge = badgeMap[c.status];
              const isUpdating = updatingId === c.id;
              const studentName = c.student
                ? `${c.student.user.firstName} ${c.student.user.lastName}`
                : "Unknown Student";
              const roomInfo = c.student?.roomAllocation?.room
                ? `${c.student.roomAllocation.room.building} — ${c.student.roomAllocation.room.roomNumber}`
                : null;

              return (
                <div key={c.id} className={`complaint-card ${isUpdating ? "updating" : ""}`}>
                  {/* Card header */}
                  <div className="cc-header">
                    <div className="cc-meta">
                      <span className="cc-category">{c.category}</span>
                      <span className={`status-badge ${badge.cls}`}>{badge.label}</span>
                    </div>
                    <span className="cc-date">{formatDate(c.createdAt)}</span>
                  </div>

                  {/* Subject + description */}
                  <div className="cc-body">
                    <h3 className="cc-subject">{c.subject}</h3>
                    <p className="cc-description">{c.description}</p>
                  </div>

                  {/* Student info */}
                  <div className="cc-student">
                    <span className="cc-student-avatar">
                      {studentName[0]?.toUpperCase()}
                    </span>
                    <div>
                      <p className="cc-student-name">{studentName}</p>
                      {roomInfo && <p className="cc-room">{roomInfo}</p>}
                    </div>
                  </div>

                  {/* Resolution note */}
                  {c.resolutionNote && (
                    <div className="cc-resolution">
                      <Icon name="check-circle" size="sm" color="var(--color-success)" />
                      <span>{c.resolutionNote}</span>
                    </div>
                  )}

                  {/* Actions */}
                  {(c.status === "OPEN" || c.status === "IN_PROGRESS") && (
                    <div className="cc-actions">
                      {c.status === "OPEN" && (
                        <button
                          className="action-btn btn-start"
                          disabled={isUpdating}
                          onClick={() => setProgressTarget(c.id)}
                        >
                          {isUpdating ? "…" : "▶ Mark In Progress"}
                        </button>
                      )}
                      <button
                        className="action-btn btn-complete"
                        disabled={isUpdating}
                        onClick={() => setResolveTarget(c.id)}
                      >
                        {isUpdating ? "…" : "✓ Resolve"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mark In Progress confirmation */}
      <ConfirmModal
        open={!!progressTarget}
        title="Mark as In Progress?"
        message="This will update the complaint status to In Progress."
        onConfirm={async () => {
          if (progressTarget) await markInProgress(progressTarget);
          setProgressTarget(null);
        }}
        onCancel={() => setProgressTarget(null)}
      />

      {/* Resolve modal */}
      <ResolveModal
        open={!!resolveTarget}
        onConfirm={async (note) => {
          if (resolveTarget) await resolveComplaint(resolveTarget, note);
          setResolveTarget(null);
        }}
        onCancel={() => setResolveTarget(null)}
      />
    </StaffDashboardLayout>
  );
};

export default StaffComplaints;
