import React from "react";
import "./StatCard.css";

interface StatCardProps {
  label: string;
  value: string | number | React.ReactNode;
  icon: React.ReactNode;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  color?: "primary" | "success" | "warning" | "error" | "info";
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  color = "primary",
  onClick,
}) => {
  return (
    <div
      className={`stat-card stat-${color} ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className="stat-header">
        <div className={`stat-icon icon-${color}`}>{icon}</div>
        {trend && (
          <div className={`trend trend-${trend.direction}`}>
            <span className="trend-icon">
              {trend.direction === "up" ? "↑" : "↓"}
            </span>
            <span className="trend-value">{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>

      <div className="stat-body">
        <div className="stat-value">{value}</div>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
