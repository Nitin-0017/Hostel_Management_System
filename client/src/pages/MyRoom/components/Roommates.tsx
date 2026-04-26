import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Skeleton from "../../../components/ui/Skeleton";
import type { IRoomAllocationResponse } from "../../../services/roomService";

interface RoommatesProps {
  isLoading: boolean;
  hasRoom: boolean;
  room: IRoomAllocationResponse | null;
}

const Roommates: React.FC<RoommatesProps> = ({ isLoading, hasRoom, room }) => {
  if (isLoading) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Skeleton width="32px" height="32px" borderRadius="8px" />
          <Skeleton width="150px" height="24px" />
        </div>
        <div className="roommate-list">
          {[1, 2].map((i) => (
            <div key={i} className="roommate-item">
              <Skeleton width="48px" height="48px" borderRadius="50%" />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="16px" />
                <div style={{ marginTop: "8px" }}>
                  <Skeleton width="40%" height="12px" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasRoom || !room) return null;

  const r = room.room;
  const totalOccupants = r.occupied;
  const capacity = r.capacity;
  // Slots: 1 is the current student, rest are other occupants
  const otherOccupants = Math.max(0, totalOccupants - 1);
  const emptySlots = Math.max(0, capacity - totalOccupants);

  return (
    <div className="room-section-card">
      <div className="card-header">
        <Icon name="users" size="lg" color="var(--color-navy)" />
        <h2>Room Occupancy</h2>
      </div>

      {/* Summary row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          backgroundColor: "#f8fafc",
          borderRadius: "10px",
          marginBottom: "16px",
          border: "1px solid #f1f5f9",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#2f4156" }}>{totalOccupants}</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Occupied</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#2f4156" }}>{capacity}</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Capacity</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: emptySlots > 0 ? "#16a34a" : "#dc2626" }}>{emptySlots}</p>
          <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Available</p>
        </div>
      </div>

      {/* Slot indicators */}
      <div className="roommate-list">
        {/* Current student */}
        <div className="roommate-item">
          <div className="roommate-avatar" style={{ backgroundColor: "#2f4156" }}>You</div>
          <div className="roommate-info">
            <h3>You (Current Student)</h3>
            <p>Room {r.roomNumber} · {r.type ? r.type.charAt(0) + r.type.slice(1).toLowerCase() : ""}</p>
          </div>
        </div>

        {/* Other occupants (count only — no names from API) */}
        {Array.from({ length: otherOccupants }).map((_, i) => (
          <div key={`occupant-${i}`} className="roommate-item">
            <div className="roommate-avatar" style={{ backgroundColor: "#567c8d" }}>
              {i + 1}
            </div>
            <div className="roommate-info">
              <h3>Roommate {i + 1}</h3>
              <p>Allocated to this room</p>
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="roommate-item" style={{ opacity: 0.45 }}>
            <div
              className="roommate-avatar"
              style={{ backgroundColor: "#e2e8f0", color: "#94a3b8", border: "2px dashed #cbd5e1" }}
            >
              —
            </div>
            <div className="roommate-info">
              <h3 style={{ color: "#94a3b8" }}>Empty Slot</h3>
              <p>Available for allocation</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roommates;
