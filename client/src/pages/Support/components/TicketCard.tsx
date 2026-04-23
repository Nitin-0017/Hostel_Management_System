import React from "react";
import type { ISupportTicket } from "../../../services/supportService";

interface TicketCardProps {
  ticket: ISupportTicket;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Submitted today";
    if (diffDays === 1) return "Submitted yesterday";
    return `Submitted ${diffDays} days ago`;
  };

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
        <h4 className="ticket-subject">{ticket.subject}</h4>
        <span className={`ticket-status ${ticket.status.toLowerCase()}`}>
          {ticket.status}
        </span>
      </div>
      <p className="ticket-message">{ticket.message}</p>
      <div className="ticket-footer">
        <span className="ticket-id">#{ticket.id.slice(-6).toUpperCase()}</span>
        <span className="ticket-date">{formatDate(ticket.createdAt)}</span>
      </div>
    </div>
  );
};

export default TicketCard;
