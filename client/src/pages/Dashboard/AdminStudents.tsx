import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminStudent } from "../../services/adminService";
import "./AdminPages.css";

const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<IAdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getStudents(1, 200);
      setStudents(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Remove student ${name}? This action cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await adminService.removeStudent(id);
      setSuccessMsg(`${name} has been removed.`);
      fetchStudents();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to remove student");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const fullName = `${s.user.firstName} ${s.user.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      s.enrollmentNumber.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q)
    );
  });

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="users" size="lg" color="var(--color-navy)" />
              Students
            </h1>
            <p className="page-subtitle">Manage all registered students</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{students.length} total</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <div className="page-toolbar">
          <div className="search-wrap">
            <Icon name="activity" size="sm" color="var(--color-textSecondary)" />
            <input
              id="student-search"
              className="search-input"
              placeholder="Search by name, email, enrollment, or course…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="user" size="lg" color="var(--color-textSecondary)" />
            <p>{search ? "No students match your search." : "No students registered yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Enrollment No.</th>
                  <th>Course / Year</th>
                  <th>Email</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const name = `${s.user.firstName} ${s.user.lastName}`;
                  const roomLabel = s.roomAllocation?.room
                    ? `${s.roomAllocation.room.building}-${s.roomAllocation.room.roomNumber}`
                    : "—";
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="cell-primary">{name}</div>
                        <div className="cell-secondary">{s.user.phone || "—"}</div>
                      </td>
                      <td>{s.enrollmentNumber}</td>
                      <td>
                        <div className="cell-primary">{s.course}</div>
                        <div className="cell-secondary">Year {s.year}</div>
                      </td>
                      <td>{s.user.email}</td>
                      <td>
                        <span className={`status-chip ${s.roomAllocation ? "chip-success" : "chip-neutral"}`}>
                          {roomLabel}
                        </span>
                      </td>
                      <td>
                        <span className={`status-chip ${s.user.isActive ? "chip-success" : "chip-error"}`}>
                          {s.user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="action-btn action-btn-danger"
                          onClick={() => handleRemove(s.id, name)}
                          disabled={deletingId === s.id}
                        >
                          {deletingId === s.id ? "Removing…" : "Remove"}
                        </button>
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

export default AdminStudents;
