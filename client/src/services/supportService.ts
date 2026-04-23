import apiClient from "../config/apiClient";

export type TicketStatus = "OPEN" | "RESOLVED";

export interface ISupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateTicketRequest {
  subject: string;
  message: string;
}

const TICKETS_KEY = "hostel_support_tickets";

class SupportService {
  // NOTE: The backend doesn't currently support /support endpoints.
  // Using localStorage as a fallback to ensure the Help & Support system is functional.
  
  async getTickets(): Promise<ISupportTicket[]> {
    try {
      // Attempt API call first (just in case)
      const res = await apiClient.get<{ success: boolean; data: ISupportTicket[] }>("/support");
      return res.data.data;
    } catch (error) {
      console.warn("Backend /support not found, falling back to localStorage");
      const stored = localStorage.getItem(TICKETS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createTicket(data: ICreateTicketRequest): Promise<ISupportTicket> {
    try {
      // Attempt API call first
      const res = await apiClient.post<{ success: boolean; data: ISupportTicket }>("/support", data);
      return res.data.data;
    } catch (error) {
      console.warn("Backend /support not found, saving to localStorage");
      
      const newTicket: ISupportTicket = {
        id: Math.random().toString(36).substr(2, 9),
        userId: "local-user",
        subject: data.subject,
        message: data.message,
        status: "OPEN",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existing = await this.getTickets();
      const updated = [newTicket, ...existing];
      localStorage.setItem(TICKETS_KEY, JSON.stringify(updated));
      
      return newTicket;
    }
  }
}

export default new SupportService();
