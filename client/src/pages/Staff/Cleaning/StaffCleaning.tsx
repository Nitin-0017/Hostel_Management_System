import React, { useState } from "react";
import StaffDashboardLayout from "../../../components/layout/StaffDashboardLayout";
import Icon from "../../../components/dashboard/Icon";
import { useStaffCleaning } from "../../../hooks/useStaffCleaning";
import type { IStaffCleaningRequest } from "../../../services/staffService";
import "./StaffCleaning.css";

type FilterStatus = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

const ConfirmModal: React.FC<{
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  confirmColor?: string;
}> = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm", confirmColor }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="modal-cancel" onClick={onCancel}>Cancel</button>
          <button
            className="modal-confirm"
            style={confirmColor ? { background: confirmColor } : undefined}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffCleaning: React.FC = () => {
  const { requests, loading, error, updatingId, startCleaning, completeCleaning, refresh } =
    useStaffCleaning();

  const [filter, setFilter] = useState<FilterStatus>("ALL");
  const [search, setSearch] = useState("");
  const [confirm, setConfirm] = useState<{
    open: boolean;
    id: string;
    action: "start" | "complete";
  }>({ open: false, id: "", action: "start" });

  const filtered = requests
    .filter((r) => filter === "ALL" || r.status === filter)
    .filter((r) => {
      const q = search.toLowerCase();
      return (
        r.room?.roomNumber?.toLowerCase().includes(q) ||
        r.room?.building?.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    IN_PROGRESS: requests.filter((r) => r.status === "IN_PROGRESS").length,
    COMPLETED: requests.filter((r) => r.status === "COMPLETED").length,
  };

  const handleConfirm = async () => {
    if (confirm.action === "start") await startCleaning(confirm.id);
    else await completeCleaning(confirm.id);
    setConfirm({ open: false, id: "", action: "start" });
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: IStaffCleaningRequest["status"]) => {
    const map = {
      PENDING: { label: "Pending", cls: "status-pending" },
      IN_PROGRESS: { label: "In Progress", cls: "status-in-progress" },
      COMPLETED: { label: "Completed", cls: "status-completed" },
    };
    return map[status] ?? { label: status, cls: "" };
  };

  return (
    <StaffDashboardLayout>
      <div className="staff-page">
        {/* Header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>
              <Icon name="cleaning" size="lg" color="var(--color-teal)" /> Cleaning Requests
            </h1>
            <p>Manage and update all cleaning assignments</p>
          </div>
          <div className="page-header-right">
            <button className="btn-secondary" onClick={refresh}>
              <Icon name="activity" size="sm" /> Refresh
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="filter-tabs">
          {(["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as FilterStatus[]).map((f) => (
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
            placeholder="Search by room number or block…"
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
          <div className="cleaning-list">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-cleaning-row" />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="check-circle" size="xl" color="var(--color-gray-300)" />
            </div>
            <h3>{filter === "ALL" ? "No cleaning requests" : `No ${filter.toLowerCase()} requests`}</h3>
            <p>
              {search
                ? "Try a different search"
                : filter === "COMPLETED"
                ? "No requests completed yet"
                : "All clear! Nothing to clean right now."}
            </p>
          </div>
        )}

        {/* Table */}
        {!loading && filtered.length > 0 && (
          <div className="cleaning-table-wrapper">
            <table className="cleaning-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Room</th>
                  <th>Block / Floor</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Completed</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req, idx) => {
                  const badge = getStatusBadge(req.status);
                  const isUpdating = updatingId === req.id;
                  return (
                    <tr key={req.id} className={isUpdating ? "row-updating" : ""}>
                      <td className="td-idx">{idx + 1}</td>
                      <td className="td-room">
                        <span className="room-num">
                          <Icon name="room" size="sm" color="var(--color-teal)" />
                          {req.room?.roomNumber ?? "—"}
                        </span>
                      </td>
                      <td className="td-block">
                        {req.room
                          ? `${req.room.building} — Floor ${req.room.floor}`
                          : "—"}
                      </td>
                      <td>
                        <span className={`status-badge ${badge.cls}`}>{badge.label}</span>
                      </td>
                      <td className="td-date">{formatDate(req.requestedAt)}</td>
                      <td className="td-date">
                        {req.completedAt ? formatDate(req.completedAt) : "—"}
                      </td>
                      <td className="td-notes">{req.notes ?? "—"}</td>
                      <td className="td-actions">
                        {req.status === "PENDING" && (
                          <button
                            className="action-btn btn-start"
                            disabled={isUpdating}
                            onClick={() =>
                              setConfirm({ open: true, id: req.id, action: "start" })
                            }
                          >
                            {isUpdating ? "…" : "▶ Start"}
                          </button>
                        )}
                        {req.status === "IN_PROGRESS" && (
                          <button
                            className="action-btn btn-complete"
                            disabled={isUpdating}
                            onClick={() =>
                              setConfirm({ open: true, id: req.id, action: "complete" })
                            }
                          >
                            {isUpdating ? "…" : "✓ Complete"}
                          </button>
                        )}
                        {req.status === "COMPLETED" && (
                          <span className="done-chip">Done ✅</span>
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

      {/* Confirmation modal */}
      <ConfirmModal
        open={confirm.open}
        title={
          confirm.action === "start"
            ? "Start Cleaning?"
            : "Mark as Completed?"
        }
        message={
          confirm.action === "start"
            ? "This will change the status to In Progress. Proceed?"
            : "Are you sure you want to mark this cleaning request as Completed?"
        }
        confirmLabel={confirm.action === "start" ? "Start" : "Mark Complete"}
        confirmColor={
          confirm.action === "start"
            ? "var(--color-info)"
            : "var(--color-success)"
        }
        onConfirm={handleConfirm}
        onCancel={() => setConfirm({ open: false, id: "", action: "start" })}
      />
    </StaffDashboardLayout>
  );
};

export default StaffCleaning;
