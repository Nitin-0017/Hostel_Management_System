import React, { useState } from 'react';
import type { ICleaningRequest } from '../../../../services/cleaningService';
import CleaningTimeline from './CleaningTimeline';

interface CleaningCardProps {
  request: ICleaningRequest;
}

const CleaningCard: React.FC<CleaningCardProps> = ({ request }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="cleaning-card" onClick={() => setIsExpanded(!isExpanded)}>
      <div className="card-header">
        <div className="room-info">
          <div className="room-badge">
            Room {request.room?.roomNumber || 'N/A'}
          </div>
          <div className="date-info">
            Requested on {formatDate(request.requestedAt)}
          </div>
        </div>
        <div className={`status-badge ${request.status.toLowerCase()}`}>
          {request.status.replace('_', ' ')}
        </div>
      </div>

      {isExpanded && (
        <div className="card-details">
          <CleaningTimeline request={request} />
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {request.assignedStaff && (
              <div className="staff-info">
                <h4>Assigned Staff</h4>
                <p>{request.assignedStaff.user.firstName} {request.assignedStaff.user.lastName}</p>
              </div>
            )}
            
            {request.notes && (
              <div className="notes-info" style={{ gridColumn: request.assignedStaff ? 'auto' : '1 / -1' }}>
                <h4>Additional Notes</h4>
                <p>{request.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CleaningCard;
