import React from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "success" | "warning" | "error";
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  onClick,
  variant = "default",
  hoverable = false,
}) => {
  return (
    <div
      className={`card card-${variant} ${hoverable ? "hoverable" : ""}`}
      onClick={onClick}
    >
      {(title || icon) && (
        <div className="card-header">
          {icon && <div className="card-icon">{icon}</div>}
          <div className="card-title-section">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}

      {children && <div className="card-body">{children}</div>}

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
