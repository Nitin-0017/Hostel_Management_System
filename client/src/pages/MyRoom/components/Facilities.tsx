import React from "react";
import Icon from "../../../components/dashboard/Icon";

interface FacilitiesProps {
  hasRoom: boolean;
}

const Facilities: React.FC<FacilitiesProps> = ({ hasRoom }) => {
  if (!hasRoom) return null;

  const facilities = [
    { name: "High-Speed WiFi", icon: "wifi" },
    { name: "Comfortable Bed", icon: "bed" },
    { name: "Study Table", icon: "book-open" },
    { name: "24/7 Electricity", icon: "zap" },
  ] as const;

  return (
    <div className="room-section-card">
      <div className="card-header">
        <Icon name="bolt" size="lg" color="var(--color-navy)" />
        <h2>Room Facilities</h2>
      </div>
      
      <div className="facilities-grid">
        {facilities.map((fac, idx) => (
          <div key={idx} className="facility-item">
            <Icon name={fac.icon} size="lg" className="facility-icon" />
            <span>{fac.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Facilities;
