import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminStaff } from "../../services/adminService";
import "./AdminPages.css";

const AdminStaff: React.FC = () => {
  const [staff, setStaff] = useState<IAdminStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getStaff(1, 200);
      setStaff(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load staff");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    const fullName = `${s.user.firstName} ${s.user.lastName}`.toLowerCase();
    return (
      fullName.includes(q) ||
      s.user.email.toLowerCase().includes(q) ||
      s.employeeId.toLowerCase().includes(q) ||
      s.designation.toLowerCase().includes(q) ||
      (s.department && s.department.toLowerCase().includes(q))
    );
  });

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="users" size="lg" color="var(--color-navy)" />
              Staff
            </h1>
            <p className="page-subtitle">Manage all registered staff members</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{staff.length} total</span>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}

        <div className="page-toolbar">
          <div className="search-wrap">
            <Icon name="activity" size="sm" color="var(--color-textSecondary)" />
            <input
              id="staff-search"
              className="search-input"
              placeholder="Search by name, email, employee ID, or designation…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner" />
            <p>Loading staff…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="user" size="lg" color="var(--color-textSecondary)" />
            <p>{search ? "No staff match your search." : "No staff registered yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const name = `${s.user.firstName} ${s.user.lastName}`;
                  return (
                    <tr key={s.id}>
                      <td>
                        <div className="cell-primary">{name}</div>
                        <div className="cell-secondary">{s.user.phone || "—"}</div>
                      </td>
                      <td>{s.employeeId}</td>
                      <td>{s.designation}</td>
                      <td>{s.department || "—"}</td>
                      <td>{s.user.email}</td>
                      <td>
                        <span className={`status-chip ${s.user.isActive ? "chip-success" : "chip-error"}`}>
                          {s.user.isActive ? "Active" : "Inactive"}
                        </span>
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

export default AdminStaff;
