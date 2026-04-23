import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Button from "../../../components/dashboard/Button";
import Skeleton from "../../../components/ui/Skeleton";
import type { ICleaningResponse } from "../../../services/cleaningService";

interface CleaningCardProps {
  cleanings: ICleaningResponse[];
  isLoading: boolean;
  hasRoom: boolean;
  onRequestCleaning: () => void;
}

const CleaningCard: React.FC<CleaningCardProps> = ({ cleanings, isLoading, hasRoom, onRequestCleaning }) => {
  if (!hasRoom) return null;

  if (isLoading) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Skeleton width="32px" height="32px" borderRadius="8px" />
          <Skeleton width="150px" height="24px" />
        </div>
        <Skeleton width="100%" height="60px" borderRadius="12px" />
      </div>
    );
  }

  // Get the most recent cleaning request
  const latestCleaning = cleanings.length > 0 
    ? cleanings.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())[0] 
    : null;

  return (
    <div className="room-section-card">
      <div className="card-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Icon name="cleaning" size="lg" color="var(--color-navy)" />
          <h2>Cleaning Status</h2>
        </div>
        <Button label="Request Cleaning" size="sm" onClick={onRequestCleaning} />
      </div>
      
      {latestCleaning ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Latest Request</p>
            <p style={{ margin: "4px 0 0 0", fontWeight: 500, color: "var(--color-navy)" }}>
              {new Date(latestCleaning.requestedAt).toLocaleDateString()}
            </p>
          </div>
          <div>
            <span className={`status-badge ${latestCleaning.status.toLowerCase()}`}>
              {latestCleaning.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="empty-state" style={{ padding: "16px 0" }}>
          No recent cleaning requests.
        </div>
      )}
    </div>
  );
};

export default CleaningCard;
