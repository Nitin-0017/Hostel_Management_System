import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Skeleton from "../../../components/ui/Skeleton";

interface RoomCardProps {
  room: any;
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
          <Skeleton width="80%" height="20px" />
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

  const occupancyPercentage = (room.occupied / room.capacity) * 100;
  const isFull = room.occupied >= room.capacity;

  return (
    <div className="room-section-card">
      <div className="card-header">
        <Icon name="room" size="lg" color="var(--color-navy)" />
        <h2>Room Details</h2>
      </div>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Room Number</p>
            <p style={{ margin: "4px 0 0 0", fontSize: "1.25rem", fontWeight: 600, color: "var(--color-navy)" }}>{room.roomNumber}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.9rem" }}>Location</p>
            <p style={{ margin: "4px 0 0 0", fontSize: "1rem", fontWeight: 500, color: "var(--color-navy)" }}>Block {room.building}, Floor {room.floor}</p>
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--color-navy)", fontWeight: 500 }}>Occupancy</span>
            <span style={{ fontSize: "0.9rem", color: isFull ? "#dc2626" : "#16a34a", fontWeight: 600 }}>
              {room.occupied} / {room.capacity} {isFull ? "(Full)" : "(Available)"}
            </span>
          </div>
          <div style={{ width: "100%", height: "8px", backgroundColor: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
            <div 
              style={{ 
                height: "100%", 
                width: `${occupancyPercentage}%`, 
                backgroundColor: isFull ? "#ef4444" : "var(--color-primary)",
                transition: "width 1s ease-in-out"
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
