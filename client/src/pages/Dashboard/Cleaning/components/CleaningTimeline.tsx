import React from 'react';
import type { ICleaningRequest } from '../../../../services/cleaningService';
import Icon from '../../../../components/dashboard/Icon';

interface TimelineProps {
  request: ICleaningRequest;
}

const CleaningTimeline: React.FC<TimelineProps> = ({ request }) => {
  const isInProgress = request.status === 'IN_PROGRESS';
  const isCompleted = request.status === 'COMPLETED';

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="timeline">
      {/* Requested Step */}
      <div className={`timeline-step completed`}>
        <div className="step-dot">
          <Icon name="check-circle" size="sm" />
        </div>
        <div className="step-label">Requested</div>
        <div className="step-date">{formatDate(request.requestedAt)}</div>
      </div>

      {/* Assigned/In Progress Step */}
      <div className={`timeline-step ${isInProgress ? 'active' : isCompleted ? 'completed' : ''}`}>
        <div className="step-dot">
          {isCompleted ? <Icon name="check-circle" size="sm" /> : <Icon name="activity" size="sm" />}
        </div>
        <div className="step-label">{request.assignedStaffId ? 'Assigned' : 'Pending Assignment'}</div>
        {request.scheduledAt && <div className="step-date">{formatDate(request.scheduledAt)}</div>}
      </div>

      {/* Completed Step */}
      <div className={`timeline-step ${isCompleted ? 'completed' : ''}`}>
        <div className="step-dot">
          <Icon name="star" size="sm" />
        </div>
        <div className="step-label">Completed</div>
        {request.completedAt && <div className="step-date">{formatDate(request.completedAt)}</div>}
      </div>
    </div>
  );
};

export default CleaningTimeline;
