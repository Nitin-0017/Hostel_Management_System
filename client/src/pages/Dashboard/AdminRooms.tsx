import React, { useEffect, useState, useCallback } from "react";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import Icon from "../../components/dashboard/Icon";
import adminService from "../../services/adminService";
import type { IAdminRoom, IAdminStudent, IAdminStaff } from "../../services/adminService";
import "./AdminPages.css";

const AdminRooms: React.FC = () => {
  const [rooms, setRooms] = useState<IAdminRoom[]>([]);
  const [students, setStudents] = useState<IAdminStudent[]>([]);
  const [staffList, setStaffList] = useState<IAdminStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Create room form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    building: "",
    floor: "",
    capacity: "",
    type: "SINGLE",
    monthlyFee: "",
  });

  // Allocate room modal
  const [allocateRoomId, setAllocateRoomId] = useState<string | null>(null);
  const [allocateStudentId, setAllocateStudentId] = useState("");
  const [allocateStaffId, setAllocateStaffId] = useState("");
  const [allocateType, setAllocateType] = useState<"STUDENT" | "STAFF">("STUDENT");
  const [allocating, setAllocating] = useState(false);
  const [allocateError, setAllocateError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [r, s, st] = await Promise.all([
        adminService.getRooms(1, 200),
        adminService.getStudents(1, 200),
        adminService.getStaff(1, 200),
      ]);
      setRooms(r.data);
      setStudents(s.data);
      setStaffList(st.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to load rooms");
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

  const handleCreateRoom = async () => {
    if (!newRoom.roomNumber || !newRoom.building || !newRoom.floor || !newRoom.capacity || !newRoom.monthlyFee) {
      setError("All fields are required.");
      return;
    }
    setCreating(true);
    try {
      await adminService.createRoom({
        roomNumber: newRoom.roomNumber,
        building: newRoom.building,
        floor: Number(newRoom.floor),
        capacity: Number(newRoom.capacity),
        type: newRoom.type,
        monthlyFee: Number(newRoom.monthlyFee),
      });
      showSuccess(`Room ${newRoom.building}-${newRoom.roomNumber} created.`);
      setNewRoom({ roomNumber: "", building: "", floor: "", capacity: "", type: "SINGLE", monthlyFee: "" });
      setShowCreateForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create room");
    } finally {
      setCreating(false);
    }
  };

  const handleAllocate = async () => {
    if (!allocateRoomId) return;
    if (allocateType === "STUDENT" && !allocateStudentId) return;
    if (allocateType === "STAFF" && !allocateStaffId) return;
    setAllocating(true);
    setAllocateError(null);
    try {
      if (allocateType === "STAFF") {
        await adminService.allocateRoom({ staffId: allocateStaffId, roomId: allocateRoomId });
      } else {
        await adminService.allocateRoom({ studentId: allocateStudentId, roomId: allocateRoomId });
      }
      showSuccess("Room allocated successfully.");
      setAllocateRoomId(null);
      setAllocateStudentId("");
      setAllocateStaffId("");
      setAllocateType("STUDENT");
      fetchData();
    } catch (err: any) {
      setAllocateError(err.response?.data?.message || err.message || "Failed to allocate room");
    } finally {
      setAllocating(false);
    }
  };

  const handleDeleteRoom = async (id: string, label: string) => {
    if (!window.confirm(`Delete room ${label}? This cannot be undone.`)) return;
    try {
      await adminService.deleteRoom(id);
      showSuccess(`Room ${label} deleted.`);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete room");
    }
  };

  const filtered = rooms.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.roomNumber.toLowerCase().includes(q) ||
      r.building.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  });

  // Students without a room allocation (for allocate dropdown)
  const unallocatedStudents = students.filter((s) => !s.roomAllocation);

  return (
    <AdminDashboardLayout>
      <div className="admin-page">
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <Icon name="room" size="lg" color="var(--color-navy)" />
              Rooms
            </h1>
            <p className="page-subtitle">Manage hostel rooms and allocations</p>
          </div>
          <div className="page-header-meta">
            <span className="count-badge">{rooms.length} total</span>
            <button className="primary-btn" onClick={() => setShowCreateForm(!showCreateForm)}>
              + Add Room
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}<button onClick={() => setError(null)}>×</button></div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        {/* Create Room Form */}
        {showCreateForm && (
          <div className="form-card">
            <h3 className="form-title">Add New Room</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>Room Number</label>
                <input className="form-input" placeholder="e.g. 101" value={newRoom.roomNumber} onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Building / Block</label>
                <input className="form-input" placeholder="e.g. A" value={newRoom.building} onChange={(e) => setNewRoom({ ...newRoom, building: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Floor</label>
                <input className="form-input" type="number" placeholder="1" value={newRoom.floor} onChange={(e) => setNewRoom({ ...newRoom, floor: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Capacity</label>
                <input className="form-input" type="number" placeholder="2" value={newRoom.capacity} onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Type</label>
                <select className="form-input" value={newRoom.type} onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}>
                  <option value="SINGLE">Single</option>
                  <option value="DOUBLE">Double</option>
                  <option value="TRIPLE">Triple</option>
                  <option value="DORMITORY">Dormitory</option>
                </select>
              </div>
              <div className="form-field">
                <label>Monthly Fee (₹)</label>
                <input className="form-input" type="number" placeholder="e.g. 5000" value={newRoom.monthlyFee} onChange={(e) => setNewRoom({ ...newRoom, monthlyFee: e.target.value })} />
              </div>
            </div>
            <div className="form-actions">
              <button className="ghost-btn" onClick={() => setShowCreateForm(false)}>Cancel</button>
              <button className="primary-btn" onClick={handleCreateRoom} disabled={creating}>
                {creating ? "Creating…" : "Create Room"}
              </button>
            </div>
          </div>
        )}

        {/* Allocate Modal */}
        {allocateRoomId && (
          <div className="modal-overlay" onClick={() => setAllocateRoomId(null)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="form-title">Allocate Room</h3>
              <p style={{ marginBottom: "1rem", fontSize: "0.9rem", color: "var(--color-textSecondary)" }}>
                Select a type and choose a person to assign to this room.
              </p>

              {allocateError && (
                <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
                  {allocateError}
                  <button onClick={() => setAllocateError(null)}>×</button>
                </div>
              )}

              {/* Type toggle */}
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
                <button
                  className={`action-btn ${allocateType === "STUDENT" ? "action-btn-primary" : "action-btn-secondary"}`}
                  style={{ flex: 1 }}
                  onClick={() => { setAllocateType("STUDENT"); setAllocateStaffId(""); }}
                >
                  Student
                </button>
                <button
                  className={`action-btn ${allocateType === "STAFF" ? "action-btn-primary" : "action-btn-secondary"}`}
                  style={{ flex: 1 }}
                  onClick={() => { setAllocateType("STAFF"); setAllocateStudentId(""); }}
                >
                  Staff
                </button>
              </div>

              {allocateType === "STUDENT" ? (
                <select
                  className="form-input"
                  value={allocateStudentId}
                  onChange={(e) => setAllocateStudentId(e.target.value)}
                >
                  <option value="">— Select Student —</option>
                  {unallocatedStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.firstName} {s.user.lastName} ({s.enrollmentNumber})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  className="form-input"
                  value={allocateStaffId}
                  onChange={(e) => setAllocateStaffId(e.target.value)}
                >
                  <option value="">— Select Staff —</option>
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.user.firstName} {s.user.lastName} ({s.employeeId})
                    </option>
                  ))}
                </select>
              )}

              <div className="form-actions" style={{ marginTop: "1rem" }}>
                <button className="ghost-btn" onClick={() => setAllocateRoomId(null)}>Cancel</button>
                <button
                  className="primary-btn"
                  onClick={handleAllocate}
                  disabled={
                    (allocateType === "STUDENT" && !allocateStudentId) ||
                    (allocateType === "STAFF" && !allocateStaffId) ||
                    allocating
                  }
                >
                  {allocating ? "Allocating…" : "Allocate"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="page-toolbar">
          <div className="search-wrap">
            <Icon name="activity" size="sm" color="var(--color-textSecondary)" />
            <input
              id="room-search"
              className="search-input"
              placeholder="Search by room number, building, or type…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state"><div className="spinner" /><p>Loading rooms…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Icon name="room" size="lg" color="var(--color-textSecondary)" />
            <p>{search ? "No rooms match your search." : "No rooms created yet."}</p>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Room</th>
                  <th>Building</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Occupancy</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((room) => {
                  const occupancyPct = room.capacity > 0 ? Math.round((room.occupied / room.capacity) * 100) : 0;
                  return (
                    <tr key={room.id}>
                      <td className="cell-primary">{room.roomNumber}</td>
                      <td>{room.building}</td>
                      <td>{room.floor}</td>
                      <td style={{ textTransform: "capitalize" }}>{room.type}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ flex: 1, height: "6px", background: "#e5e7eb", borderRadius: "3px", minWidth: "60px" }}>
                            <div style={{ height: "100%", width: `${occupancyPct}%`, background: occupancyPct >= 100 ? "#ef4444" : "#2F4156", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "0.8rem", color: "var(--color-textSecondary)" }}>{room.occupied}/{room.capacity}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-chip ${room.isAvailable ? "chip-success" : "chip-error"}`}>
                          {room.isAvailable ? "Available" : "Full"}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {room.isAvailable && (
                            <button className="action-btn action-btn-primary" onClick={() => setAllocateRoomId(room.id)}>
                              Allocate
                            </button>
                          )}
                          <button
                            className="action-btn action-btn-danger"
                            onClick={() => handleDeleteRoom(room.id, `${room.building}-${room.roomNumber}`)}
                          >
                            Delete
                          </button>
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

export default AdminRooms;
