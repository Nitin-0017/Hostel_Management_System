import React from "react";
import Icon from "../../../components/dashboard/Icon";
import Skeleton from "../../../components/ui/Skeleton";

interface RoommatesProps {
  isLoading: boolean;
  hasRoom: boolean;
}

const Roommates: React.FC<RoommatesProps> = ({ isLoading, hasRoom }) => {
  // Since we don't have a roommates API right now, we will show a mock layout or a placeholder
  // when a room is allocated.
  
  if (isLoading) {
    return (
      <div className="room-section-card">
        <div className="card-header">
          <Skeleton width="32px" height="32px" borderRadius="8px" />
          <Skeleton width="150px" height="24px" />
        </div>
        <div className="roommate-list">
          {[1, 2].map(i => (
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

  if (!hasRoom) {
    return null; // Don't show roommates if no room
  }

  return (
    <div className="room-section-card">
      <div className="card-header">
        <Icon name="users" size="lg" color="var(--color-navy)" />
        <h2>Roommates</h2>
      </div>
      
      <div className="roommate-list">
        {/* Mock Roommates since API doesn't provide it yet */}
        <div className="roommate-item">
          <div className="roommate-avatar">JD</div>
          <div className="roommate-info">
            <h3>John Doe</h3>
            <p>Computer Science &bull; 2nd Year</p>
          </div>
        </div>
        <div className="roommate-item">
          <div className="roommate-avatar" style={{ backgroundColor: "#10b981" }}>SM</div>
          <div className="roommate-info">
            <h3>Smith Michaels</h3>
            <p>Electrical Eng &bull; 2nd Year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roommates;
