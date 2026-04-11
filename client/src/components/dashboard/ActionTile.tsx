import React from "react";
import "./ActionTile.css";

export type ActionTileColor = "primary" | "warning" | "info" | "success";

interface ActionTileProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  onClick?: () => void;
  color?: ActionTileColor;
  className?: string;
}


const ActionTile: React.FC<ActionTileProps> = ({
  icon,
  label,
  description,
  onClick,
  color = "primary",
  className = "",
}) => {
  return (
    <button
      className={`action-tile action-tile-${color} ${className}`}
      onClick={onClick}
    >
      <div className="tile-icon">{icon}</div>
      <div className="tile-content">
        <h4 className="tile-label">{label}</h4>
        {description && <p className="tile-description">{description}</p>}
      </div>
      <div className="tile-arrow">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </div>
    </button>
  );
};

export default ActionTile;
