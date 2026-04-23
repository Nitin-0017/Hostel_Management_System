import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Button from "../../../components/dashboard/Button";
import Skeleton from "../../../components/ui/Skeleton";
import type { IComplaintResponse } from "../../../services/complaintService";

interface ComplaintSectionProps {
  complaints: IComplaintResponse[];
  isLoading: boolean;
  hasRoom: boolean;
  onRaiseComplaint: () => void;
}

const ComplaintSection: React.FC<ComplaintSectionProps> = ({ complaints, isLoading, hasRoom, onRaiseComplaint }) => {
  if (!hasRoom) return null;

  if (isLoading) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Skeleton width="32px" height="32px" borderRadius="8px" />
          <Skeleton width="150px" height="24px" />
        </div>
        <div className="item-list">
          {[1, 2].map(i => (
            <Skeleton key={i} width="100%" height="70px" borderRadius="12px" />
          ))}
        </div>
      </div>
    );
  }

  // Filter for recent complaints
  const recentComplaints = complaints
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="room-section-card">
      <div className="card-header" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Icon name="complaints" size="lg" color="var(--color-navy)" />
          <h2>Room Complaints</h2>
        </div>
        <Button label="Raise Complaint" size="sm" onClick={onRaiseComplaint} />
      </div>
      
      <div className="item-list">
        {recentComplaints.length > 0 ? (
          recentComplaints.map(complaint => (
            <div key={complaint.id} className="list-item">
              <div className="item-main">
                <p className="item-title">{complaint.subject}</p>
                <p className="item-date">{new Date(complaint.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                {complaint.status}
              </span>
            </div>
          ))
        ) : (
          <div className="empty-state">
            No complaints recorded.
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintSection;
