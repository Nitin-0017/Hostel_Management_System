import React, { useState } from "react";
import StaffDashboardLayout from "../../../components/layout/StaffDashboardLayout";
import Icon from "../../../components/dashboard/Icon";
import { useStaffRooms } from "../../../hooks/useStaffRooms";
import "./StaffRooms.css";

const StaffRooms: React.FC = () => {
  const { rooms, loading, error, refresh } = useStaffRooms();
  const [search, setSearch] = useState("");

  const filtered = rooms.filter(
    (r) =>
      r.roomNumber?.toLowerCase().includes(search.toLowerCase()) ||
      (r.building ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const occupancyPct = (room: typeof rooms[0]) =>
    room.capacity > 0 ? Math.round((room.occupied / room.capacity) * 100) : 0;

  const occupancyColor = (pct: number) => {
    if (pct >= 90) return "var(--color-error)";
    if (pct >= 60) return "var(--color-warning)";
    return "var(--color-success)";
  };

  return (
    <StaffDashboardLayout>
      <div className="staff-page">
        {/* Page header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1>
              <Icon name="room" size="lg" color="var(--color-teal)" /> Assigned Rooms
            </h1>
            <p>Rooms under your responsibility</p>
          </div>
          <div className="page-header-right">
            <button className="btn-secondary" onClick={refresh}>
              <Icon name="activity" size="sm" /> Refresh
            </button>
          </div>
        </div>

        {/* Search bar */}
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
          <div className="rooms-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-room-card" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">
              <Icon name="room" size="xl" color="var(--color-gray-300)" />
            </div>
            <h3>{search ? "No rooms match your search" : "No rooms assigned yet"}</h3>
            <p>
              {search
                ? "Try a different search term"
                : "Contact your admin to get rooms assigned"}
            </p>
          </div>
        )}

        {/* Rooms grid */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="rooms-summary">
              <span className="summary-chip">
                <Icon name="room" size="sm" /> {filtered.length} Rooms
              </span>
              <span className="summary-chip chip-success">
                <Icon name="check-circle" size="sm" />
                {filtered.filter((r) => r.isAvailable).length} Available
              </span>
              <span className="summary-chip chip-warning">
                <Icon name="cleaning" size="sm" />
                {filtered.filter((r) => !r.isAvailable).length} Occupied / Unavailable
              </span>
            </div>

            <div className="rooms-grid">
              {filtered.map((room) => {
                const pct = occupancyPct(room);
                const color = occupancyColor(pct);
                return (
                  <div key={room.id} className="room-card">
                    {/* Card top */}
                    <div className="room-card-top">
                      <div className="room-number-badge">
                        <Icon name="room" size="md" color="var(--color-white)" />
                        <span>{room.roomNumber}</span>
                      </div>
                      <span
                        className={`availability-badge ${
                          room.isAvailable ? "available" : "occupied"
                        }`}
                      >
                        {room.isAvailable ? "Available" : "Occupied"}
                      </span>
                    </div>

                    {/* Room details */}
                    <div className="room-details">
                      <div className="room-detail-row">
                        <span className="detail-label">Block / Floor</span>
                        <span className="detail-value">
                          {room.building} — Floor {room.floor}
                        </span>
                      </div>
                      <div className="room-detail-row">
                        <span className="detail-label">Type</span>
                        <span className="detail-value">
                          {room.type ?? "Standard"}
                        </span>
                      </div>
                      <div className="room-detail-row">
                        <span className="detail-label">Occupancy</span>
                        <span className="detail-value">
                          {room.occupied} / {room.capacity}
                        </span>
                      </div>
                    </div>

                    {/* Occupancy progress */}
                    <div className="room-occupancy">
                      <div className="occ-track">
                        <div
                          className="occ-fill"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                      <span className="occ-label" style={{ color }}>
                        {pct}%
                      </span>
                    </div>

                    {/* Clean status chip */}
                    <div className="room-status-row">
                      <span
                        className={`clean-status ${
                          room.cleaningStatus === "CLEAN" ||
                          room.cleaningStatus === undefined
                            ? "clean"
                            : room.cleaningStatus === "IN_PROGRESS"
                            ? "in-progress"
                            : "needs-cleaning"
                        }`}
                      >
                        <span className="cs-dot" />
                        {room.cleaningStatus === "IN_PROGRESS"
                          ? "Cleaning in progress"
                          : room.cleaningStatus === "NEEDS_CLEANING"
                          ? "Needs cleaning"
                          : "Clean"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </StaffDashboardLayout>
  );
};

export default StaffRooms;
