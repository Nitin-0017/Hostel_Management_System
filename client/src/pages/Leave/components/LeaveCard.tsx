import React, { useState } from "react";
import type { ILeaveResponse } from "../../../services/leaveService";
import LeaveTimeline from "./LeaveTimeline";


interface LeaveCardProps {
  leave: ILeaveResponse;
}

const LeaveCard: React.FC<LeaveCardProps> = ({ leave }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fromDate = new Date(leave.fromDate);
  const toDate = new Date(leave.toDate);
  const timeDiff = toDate.getTime() - fromDate.getTime();
  const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "success";
      case "REJECTED": return "danger";
      case "PENDING": return "warning";
      case "CANCELLED": return "gray";
      default: return "info";
    }
  };

  return (
    <div className={`leave-card ${isExpanded ? "expanded" : ""}`} onClick={() => setIsExpanded(!isExpanded)}>
      <div className="leave-card-header">
        <div className="leave-dates">
          <div className="date-box">
            <span className="date-label">From</span>
            <span className="date-value">{fromDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <span className="date-arrow">→</span>
          <div className="date-box">
            <span className="date-label">To</span>
            <span className="date-value">{toDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          <div className="days-badge">
            {days} {days === 1 ? "Day" : "Days"}
          </div>
        </div>
        <div className={`status-badge ${getStatusColor(leave.status)}`}>
          {leave.status}
        </div>
      </div>

      <div className="leave-reason-preview">
        <p className="reason-text">
          {isExpanded ? leave.reason : `${leave.reason.substring(0, 80)}${leave.reason.length > 80 ? '...' : ''}`}
        </p>
      </div>

      {isExpanded && (
        <div className="leave-card-details" onClick={(e) => e.stopPropagation()}>
          <div className="divider"></div>
          <h4 className="timeline-title">Approval Timeline</h4>
          <LeaveTimeline leave={leave} />
        </div>
      )}
      
      <div className="leave-card-footer">
        <span className="applied-ago">Applied {Math.floor((new Date().getTime() - new Date(leave.createdAt).getTime()) / (1000 * 3600 * 24))} days ago</span>
        <button className="expand-btn" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}>
          {isExpanded ? "Show Less" : "View Details"}
        </button>
      </div>
    </div>
  );
};

export default LeaveCard;
