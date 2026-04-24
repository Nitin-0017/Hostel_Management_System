import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import AdminDashboardLayout from "../../components/layout/AdminDashboardLayout";
import { useAuth } from "../../hooks/useAuth";
import SupportForm from "./components/SupportForm";
import TicketList from "./components/TicketList";
import supportService from "../../services/supportService";
import type { ISupportTicket } from "../../services/supportService";
import "./Support.css";

const Support: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<ISupportTicket[]>([]);
  const [loading, setLoading] = useState(true);

  const Layout = user?.role === "ADMIN" ? AdminDashboardLayout : DashboardLayout;

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supportService.getTickets();
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <Layout>
      <div className="support-page">
        <header className="support-header">
          <div>
            <h1>Help & Support</h1>
            <p>Need help? Raise a ticket and our team will get back to you.</p>
          </div>
        </header>

        <div className="support-grid">
          <main>
            <TicketList tickets={tickets} loading={loading} />
          </main>
          <aside>
            <SupportForm onSuccess={fetchTickets} />
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default Support;
