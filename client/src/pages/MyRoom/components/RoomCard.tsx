import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Skeleton from "../../../components/ui/Skeleton";
import type { IRoomAllocationResponse } from "../../../services/roomService";

interface RoomCardProps {
  room: IRoomAllocationResponse | null;
  isLoading: boolean;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, isLoading }) => {
  if (isLoading) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Skeleton width="32px" height="32px" borderRadius="8px" />
          <Skeleton width="150px" height="24px" />
        </div>
        <div className="skeleton-wrapper">
          <Skeleton width="100%" height="20px" />
          <Skeleton width="80%"  height="20px" />
          <Skeleton width="60%"  height="20px" />
          <Skeleton width="100%" height="12px" borderRadius="10px" />
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Icon name="room" size="lg" color="var(--color-navy)" />
          <h2>Room Details</h2>
        </div>
        <div className="empty-state">You are not currently allocated a room.</div>
      </div>
    );
  }

  // Backend returns allocation.room as the nested room object
  const r = room.room;
  const occupancyPct = r.capacity > 0 ? Math.round((r.occupied / r.capacity) * 100) : 0;
  const isFull = r.occupied >= r.capacity;

  // Parse amenities — stored as JSON string or comma-separated
  let amenitiesList: string[] = [];
  if (r.amenities) {
    try {
      const parsed = JSON.parse(r.amenities);
      amenitiesList = Array.isArray(parsed) ? parsed : [String(parsed)];
    } catch {
      amenitiesList = r.amenities.split(",").map((a) => a.trim()).filter(Boolean);
    }
  }

  const formatDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "N/A";

  const rows: { label: string; value: string }[] = [
    { label: "Room Number",  value: r.roomNumber },
    { label: "Building / Block", value: r.building || "N/A" },
    { label: "Floor",        value: r.floor !== undefined ? `Floor ${r.floor}` : "N/A" },
    { label: "Room Type",    value: r.type ? r.type.charAt(0) + r.type.slice(1).toLowerCase() : "N/A" },
    { label: "Monthly Fee",  value: r.monthlyFee ? `₹${r.monthlyFee.toLocaleString()}` : "N/A" },
    { label: "Room Status",  value: r.status ? r.status.charAt(0) + r.status.slice(1).toLowerCase() : "N/A" },
    { label: "Allocated On", value: formatDate(room.allocatedAt) },
  ];

  return (
    <div className="room-section-card">
      <div className="card-header">
        <Icon name="room" size="lg" color="var(--color-navy)" />
        <h2>Room Details</h2>
      </div>

      {/* Detail rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {rows.map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>{label}</span>
            <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-navy)" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Occupancy bar */}
      <div style={{ marginTop: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>Occupancy</span>
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: isFull ? "#dc2626" : "#16a34a" }}>
            {r.occupied} / {r.capacity} {isFull ? "(Full)" : "(Available)"}
          </span>
        </div>
        <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${occupancyPct}%`,
              backgroundColor: isFull ? "#ef4444" : "#2f4156",
              borderRadius: "10px",
              transition: "width 0.8s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Amenities */}
      {amenitiesList.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.875rem", color: "#64748b", fontWeight: 500 }}>Amenities</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {amenitiesList.map((a) => (
              <span
                key={a}
                style={{
                  padding: "4px 12px",
                  backgroundColor: "#f1f5f9",
                  borderRadius: "20px",
                  fontSize: "0.8rem",
                  color: "#2f4156",
                  fontWeight: 500,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomCard;
