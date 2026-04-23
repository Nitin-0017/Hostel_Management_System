import React, { useState } from 'react';
import type { IComplaintResponse } from '../../../services/complaintService';
import ComplaintTimeline from './ComplaintTimeline';

interface ComplaintCardProps {
  complaint: IComplaintResponse;
}

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "OPEN": return "open";
      case "IN_PROGRESS": return "in_progress";
      case "RESOLVED": return "resolved";
      case "REJECTED": return "rejected";
      default: return "";
    }
  };

  const formatStatus = (status: string) => {
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "OPEN") return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="complaint-card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="card-header">
        <div>
          <span className="card-category">{complaint.category}</span>
          <h3 className="card-title">{complaint.subject}</h3>
        </div>
        <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
          {formatStatus(complaint.status)}
        </span>
      </div>

      <div className="card-body">
        <p style={{ WebkitLineClamp: isExpanded ? 'unset' : 2 }}>
          {complaint.description}
        </p>
      </div>

      {isExpanded && (
        <ComplaintTimeline status={complaint.status} createdAt={complaint.createdAt} />
      )}

      <div className="card-footer">
        <span className="card-date">Created {formatDate(complaint.createdAt)}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease'
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>
  );
};

export default ComplaintCard;
