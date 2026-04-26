import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminCleaningRequest, IAdminStaff } from "../../services/adminService";
import "./AdminPages.css";

type FilterStatus = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";

const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const AdminCleaning: React.FC = () => {
  const [requests, setRequests] = useState<IAdminCleaningRequest[]>([]);
  const [staffList, setStaffList] = useState<IAdminStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("ALL");

  // Assign modal
  const [assignId, setAssignId] = useState<string | null>(null);
  const [assignStaffId, setAssignStaffId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        adminService.getCleaningRequests(1, 200),
        adminService.getStaff(1, 200),
      ]);
      setRequests(c.data);
      setStaffList(s.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load cleaning requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAssign = async () => {
    if (!assignId || !assignStaffId) return;
    setAssigning(true);
    try {
      await adminService.assignCleaningRequest(assignId, assignStaffId);
      showSuccess("Cleaning request assigned to staff.");
      setAssignId(null);
      setAssignStaffId("");
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to assign request");
    } finally {
      setAssigning(false);
    }
  };

  const FILTERS: { label: string; value: FilterStatus }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
  ];

  const filtered = requests.filter((r) => filter === "ALL" || r.status === filter);

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="zap" size="lg" color="var(--color-navy)" />
              Cleaning Requests
            </h1>
            <p className="page-subtitle">View student cleaning requests and assign to staff</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{requests.length} total</span>
            {pendingCount > 0 && (
              <span className="count-badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                {pendingCount} pending
              </span>
            )}
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Filters */}
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              className={`filter-tab ${filter === f.value ? "active" : ""}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
              <span className="tab-count">
                {f.value === "ALL"
                  ? requests.length
                  : requests.filter((r) => r.status === f.value).length}
              </span>
            </button>
          ))}
        </div>

        {/* Assign modal */}
        {assignId && (
          <div className="modal-overlay" onClick={() => setAssignId(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="form-title">Assign to Staff</h3>
              <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "var(--color-textSecondary)" }}>
                Select a staff member to handle this cleaning request.
              </p>
              <select
                className="form-input"
                value={assignStaffId}
                onChange={(e) => setAssignStaffId(e.target.value)}
              >
                <option value="">— Select Staff —</option>
                {staffList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.user.firstName} {s.user.lastName} ({s.employeeId} · {s.designation})
                  </option>
                ))}
              </select>
              <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button className="ghost-btn" onClick={() => setAssignId(null)}>Cancel</button>
                <button className="primary-btn" onClick={handleAssign} disabled={!assignStaffId || assigning}>
                  {assigning ? "Assigning…" : "Assign"}
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading cleaning requests…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="zap" size="lg" color="var(--color-textSecondary)" />
            <p>{filter !== "ALL" ? "No requests match this filter." : "No cleaning requests yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Requested</th>
                  <th>Assigned Staff</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((req) => {
                  const studentName = req.student
                    ? `${req.student.user.firstName} ${req.student.user.lastName}`
                    : req.studentId.slice(0, 8) + "…";
                  const roomLabel = req.room
                    ? `${req.room.building ? req.room.building + "-" : ""}${req.room.roomNumber}`
                    : "—";
                  const staffName = req.assignedStaff
                    ? `${req.assignedStaff.user.firstName} ${req.assignedStaff.user.lastName}`
                    : "—";

                  const statusClass =
                    req.status === "PENDING"
                      ? "chip-warning"
                      : req.status === "IN_PROGRESS"
                      ? "chip-info"
                      : "chip-success";

                  const statusLabel =
                    req.status === "IN_PROGRESS" ? "In Progress" : req.status === "COMPLETED" ? "Completed" : "Pending";

                  return (
                    <tr key={req.id}>
                      <td>
                        <div className="cell-primary">{studentName}</div>
                        {req.student && (
                          <div className="cell-secondary">{req.student.enrollmentNumber}</div>
                        )}
                      </td>
                      <td>{roomLabel}</td>
                      <td>
                        <span className={`status-chip ${statusClass}`}>{statusLabel}</span>
                      </td>
                      <td>{formatDate(req.requestedAt)}</td>
                      <td>{staffName}</td>
                      <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {req.notes || "—"}
                      </td>
                      <td>
                        {req.status === "PENDING" && (
                          <button
                            className="action-btn action-btn-primary"
                            onClick={() => setAssignId(req.id)}
                          >
                            Assign
                          </button>
                        )}
                        {req.status === "IN_PROGRESS" && (
                          <span style={{ fontSize: "0.8rem", color: "var(--color-textSecondary)" }}>
                            Assigned
                          </span>
                        )}
                        {req.status === "COMPLETED" && (
                          <span style={{ fontSize: "0.8rem", color: "var(--color-success)" }}>
                            ✓ Done
                          </span>
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

export default AdminCleaning;
