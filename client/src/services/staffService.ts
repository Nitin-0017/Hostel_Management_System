import apiClient from "../config/apiClient";

// ── Room types ────────────────────────────────────────────────────────────────
export interface IStaffRoom {
  id: string;
  roomNumber: string;
  floor: number;
  building: string;
  capacity: number;
  occupied: number;
  type: string;
  isAvailable: boolean;
  cleaningStatus?: "CLEAN" | "NEEDS_CLEANING" | "IN_PROGRESS";
}

// ── Cleaning types ─────────────────────────────────────────────────────────────
export interface IStaffCleaningRequest {
  id: string;
  studentId: string;
  roomId: string;
  assignedStaffId: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  requestedAt: string;
  scheduledAt: string | null;
  completedAt: string | null;
  notes: string | null;
  room?: {
    roomNumber: string;
    building: string;
    floor: number;
  };
  student?: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
}

// ── Staff complaints (re-using admin complaint shape) ──────────────────────────
export interface IStaffComplaint {
  id: string;
  studentId: string;
  category: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  resolutionNote?: string | null;
  createdAt: string;
  updatedAt: string;
  student?: {
    user: { firstName: string; lastName: string; email: string };
    enrollmentNumber: string;
    roomAllocation?: { room: { roomNumber: string; building: string } } | null;
  };
}

// ── Notification types ─────────────────────────────────────────────────────────
export interface IStaffNotification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// ── Service class ──────────────────────────────────────────────────────────────
class StaffService {
  // ── Rooms ──────────────────────────────────────────────────────────────────
  async getAssignedRooms(): Promise<IStaffRoom[]> {
    const res = await apiClient.get<{ success: boolean; data: IStaffRoom[] }>(
      "/staff/rooms"
    );
    return res.data.data;
  }

  // ── Cleaning Requests ──────────────────────────────────────────────────────
  async getCleaningRequests(): Promise<IStaffCleaningRequest[]> {
    const res = await apiClient.get<{
      success: boolean;
      data: IStaffCleaningRequest[];
    }>("/staff/cleaning");
    return res.data.data;
  }

  async updateCleaningStatus(
    id: string,
    status: "IN_PROGRESS" | "COMPLETED"
  ): Promise<IStaffCleaningRequest> {
    const res = await apiClient.patch<{
      success: boolean;
      data: IStaffCleaningRequest;
    }>(`/staff/cleaning/${id}/status`, { status });
    return res.data.data;
  }

  // ── Complaints (No dedicated backend route currently) ───────────────────
  async getComplaints(): Promise<IStaffComplaint[]> {
    // Return empty array to prevent 403 Forbidden errors from hitting admin routes
    return [];
  }

  async markComplaintInProgress(id: string): Promise<IStaffComplaint> {
    throw new Error("Complaint management is not configured for staff yet.");
  }

  async resolveComplaint(id: string, note: string): Promise<IStaffComplaint> {
    throw new Error("Complaint management is not configured for staff yet.");
  }

  // ── Notifications ──────────────────────────────────────────────────────────
  async getNotifications(
    page = 1,
    pageSize = 30
  ): Promise<{ data: IStaffNotification[]; total: number }> {
    const res = await apiClient.get<{
      success: boolean;
      data: IStaffNotification[];
      total: number;
    }>(`/staff/notifications?page=${page}&pageSize=${pageSize}`);
    return { data: res.data.data, total: res.data.total };
  }

  async markNotificationRead(id: string): Promise<void> {
    await apiClient.patch(`/staff/notifications/${id}/read`);
  }

  async markAllNotificationsRead(): Promise<void> {
    await apiClient.patch("/staff/notifications/read-all");
  }
}

export default new StaffService();
