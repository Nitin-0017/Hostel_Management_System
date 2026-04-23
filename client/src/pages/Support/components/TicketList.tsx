import React from "react";
import TicketCard from "./TicketCard";
import type { ISupportTicket } from "../../../services/supportService";

interface TicketListProps {
  tickets: ISupportTicket[];
  loading: boolean;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, loading }) => {
  if (loading) {
    return (
      <div className="ticket-list-container">
        <div className="ticket-list-header">
          <h3>My Tickets</h3>
        </div>
        <div className="loading-state">Loading your tickets...</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="ticket-list-container">
        <div className="ticket-list-header">
          <h3>My Tickets</h3>
        </div>
        <div className="empty-tickets">
          <p>You haven't raised any support tickets yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-list-container">
      <div className="ticket-list-header">
        <h3>My Tickets ({tickets.length})</h3>
      </div>
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
};

export default TicketList;
