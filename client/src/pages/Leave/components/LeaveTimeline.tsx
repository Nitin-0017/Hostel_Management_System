import React from "react";
import type { ILeaveResponse } from "../../../services/leaveService";
import Icon from "../../../components/dashboard/Icon";

interface LeaveTimelineProps {
  leave: ILeaveResponse;
}

const LeaveTimeline: React.FC<LeaveTimelineProps> = ({ leave }) => {
  const appliedDate = new Date(leave.createdAt).toLocaleDateString();
  const reviewedDate = leave.reviewedAt ? new Date(leave.reviewedAt).toLocaleDateString() : null;

  return (
    <div className="leave-timeline">
      <div className={`timeline-step ${leave.createdAt ? "completed" : ""}`}>
        <div className="step-icon"><Icon name="activity" size="sm" /></div>
        <div className="step-content">
          <h4>Applied</h4>
          <p>{appliedDate}</p>
        </div>
      </div>
      <div className={`timeline-connector ${leave.reviewedAt || leave.status !== "PENDING" ? "active" : ""}`}></div>
      <div className={`timeline-step ${leave.reviewedAt || leave.status !== "PENDING" ? "completed" : "pending"}`}>
        <div className="step-icon"><Icon name="bell" size="sm" /></div>
        <div className="step-content">
          <h4>Reviewed</h4>
          <p>{reviewedDate || "Pending Review"}</p>
        </div>
      </div>
      <div className={`timeline-connector ${leave.status === "APPROVED" || leave.status === "REJECTED" ? "active" : ""}`}></div>
      <div className={`timeline-step ${leave.status === "APPROVED" ? "success" : leave.status === "REJECTED" ? "danger" : "pending"}`}>
        <div className="step-icon">
          <Icon name={leave.status === "APPROVED" ? "fees" : leave.status === "REJECTED" ? "complaints" : "room"} size="sm" />
        </div>
        <div className="step-content">
          <h4>{leave.status === "PENDING" ? "Decision" : leave.status}</h4>
          {leave.adminRemarks && <p className="admin-remarks">Note: {leave.adminRemarks}</p>}
        </div>
      </div>
    </div>
  );
};

export default LeaveTimeline;
