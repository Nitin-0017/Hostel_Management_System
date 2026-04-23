import React from 'react';

interface ComplaintTimelineProps {
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

const ComplaintTimeline: React.FC<ComplaintTimelineProps> = ({ status, createdAt }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const steps = [
    { key: "OPEN", label: "Created" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
  ];

  if (status === "REJECTED") {
    steps[2] = { key: "REJECTED", label: "Rejected" };
  }

  // Determine current active step index
  let activeIndex = 0;
  if (status === "IN_PROGRESS") activeIndex = 1;
  if (status === "RESOLVED" || status === "REJECTED") activeIndex = 2;

  return (
    <div className="complaint-timeline-wrapper">
      <div className="timeline">
        {steps.map((step, index) => {
          const isCompleted = index <= activeIndex;
          const isActive = index === activeIndex;

          return (
            <div key={step.key} className={`timeline-item ${isCompleted ? 'active' : ''}`}>
              <div className="timeline-dot">
                {isCompleted && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isActive && status === 'REJECTED' ? "#dc2626" : "white"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {status === 'REJECTED' && isActive ? (
                      <path d="M18 6L6 18M6 6l12 12" />
                    ) : (
                      <polyline points="20 6 9 17 4 12" />
                    )}
                  </svg>
                )}
              </div>
              <div className="timeline-content">
                <h4 className="timeline-title">{step.label}</h4>
                {index === 0 && <span className="timeline-date">{formatDate(createdAt)}</span>}
                {isActive && index !== 0 && <span className="timeline-date">Current status</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;
