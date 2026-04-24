import apiClient from "../config/apiClient";

// ── Shared paginated wrapper ─────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Student types ────────────────────────────────────────────────────────────
export interface IAdminStudent {
  id: string;
  userId: string;
  enrollmentNumber: string;
  course: string;
  year: number;
  joiningDate: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    isActive: boolean;
    createdAt: string;
  };
  roomAllocation?: {
    room: {
      roomNumber: string;
      building: string;
      floor: number;
    };
  } | null;
}

// ── Room types ───────────────────────────────────────────────────────────────
export interface IAdminRoom {
  id: string;
  roomNumber: string;
  floor: number;
  building: string;
  capacity: number;
  occupied: number;
  type: string;
  isAvailable: boolean;
  createdAt: string;
}

// ── Complaint types ──────────────────────────────────────────────────────────
export interface IAdminComplaint {
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
  };
}

// ── Leave types ──────────────────────────────────────────────────────────────
export interface IAdminLeave {
  id: string;
  studentId: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  adminRemarks?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  student?: {
    user: { firstName: string; lastName: string; email: string };
    enrollmentNumber: string;
  };
}

// ── Report types ─────────────────────────────────────────────────────────────
export interface IAdminReport {
  id: string;
  adminId: string;
  title: string;
  type: "OCCUPANCY" | "COMPLAINT" | "LEAVE";
  data: Record<string, unknown>;
  generatedAt: string;
}

// ── Notification payload ─────────────────────────────────────────────────────
export interface ISendNotificationPayload {
  type: string;
  title: string;
  message: string;
  broadcast?: boolean;
  userId?: string;
  userIds?: string[];
}

// ── Service class ────────────────────────────────────────────────────────────
class AdminService {
  // Students
  async getStudents(page = 1, pageSize = 50): Promise<PaginatedResponse<IAdminStudent>> {
    const res = await apiClient.get<{ success: boolean; data: IAdminStudent[]; total: number; page: number; pageSize: number }>(
      `/admin/students?page=${page}&pageSize=${pageSize}`
    );
    return { data: res.data.data, total: res.data.total, page: res.data.page, pageSize: res.data.pageSize };
  }

  async updateStudent(id: string, payload: Partial<{ enrollmentNumber: string; course: string; year: number }>): Promise<IAdminStudent> {
    const res = await apiClient.put<{ success: boolean; data: IAdminStudent }>(`/admin/students/${id}`, payload);
    return res.data.data;
  }

  async removeStudent(id: string): Promise<void> {
    await apiClient.delete(`/admin/students/${id}`);
  }

  // Rooms
  async getRooms(page = 1, pageSize = 50): Promise<PaginatedResponse<IAdminRoom>> {
    const res = await apiClient.get<{ success: boolean; data: IAdminRoom[]; total: number; page: number; pageSize: number }>(
      `/admin/rooms?page=${page}&pageSize=${pageSize}`
    );
    return { data: res.data.data, total: res.data.total, page: res.data.page, pageSize: res.data.pageSize };
  }

  async getAvailableRooms(): Promise<IAdminRoom[]> {
    const res = await apiClient.get<{ success: boolean; data: IAdminRoom[] }>("/admin/rooms/available");
    return res.data.data;
  }

  async createRoom(payload: { roomNumber: string; floor: number; building: string; capacity: number; type: string }): Promise<IAdminRoom> {
    const res = await apiClient.post<{ success: boolean; data: IAdminRoom }>("/admin/rooms", payload);
    return res.data.data;
  }

  async updateRoom(id: string, payload: Partial<IAdminRoom>): Promise<IAdminRoom> {
    const res = await apiClient.put<{ success: boolean; data: IAdminRoom }>(`/admin/rooms/${id}`, payload);
    return res.data.data;
  }

  async deleteRoom(id: string): Promise<void> {
    await apiClient.delete(`/admin/rooms/${id}`);
  }

  async allocateRoom(studentId: string, roomId: string): Promise<unknown> {
    const res = await apiClient.post<{ success: boolean; data: unknown }>("/admin/rooms/allocate", { studentId, roomId });
    return res.data.data;
  }

  async deallocateRoom(studentId: string, roomId: string): Promise<void> {
    await apiClient.post("/admin/rooms/deallocate", { studentId, roomId });
  }

  // Complaints
  async getComplaints(page = 1, pageSize = 50): Promise<PaginatedResponse<IAdminComplaint>> {
    const res = await apiClient.get<{ success: boolean; data: IAdminComplaint[]; total: number; page: number; pageSize: number }>(
      `/admin/complaints?page=${page}&pageSize=${pageSize}`
    );
    return { data: res.data.data, total: res.data.total, page: res.data.page, pageSize: res.data.pageSize };
  }

  async resolveComplaint(id: string, resolutionNote: string): Promise<IAdminComplaint> {
    const res = await apiClient.patch<{ success: boolean; data: IAdminComplaint }>(`/admin/complaints/${id}/resolve`, { resolutionNote });
    return res.data.data;
  }

  async rejectComplaint(id: string, resolutionNote: string): Promise<IAdminComplaint> {
    const res = await apiClient.patch<{ success: boolean; data: IAdminComplaint }>(`/admin/complaints/${id}/reject`, { resolutionNote });
    return res.data.data;
  }

  async markComplaintInProgress(id: string): Promise<IAdminComplaint> {
    const res = await apiClient.patch<{ success: boolean; data: IAdminComplaint }>(`/admin/complaints/${id}/in-progress`);
    return res.data.data;
  }

  // Leaves
  async getLeaves(page = 1, pageSize = 50): Promise<PaginatedResponse<IAdminLeave>> {
    const res = await apiClient.get<{ success: boolean; data: IAdminLeave[]; total: number; page: number; pageSize: number }>(
      `/admin/leaves?page=${page}&pageSize=${pageSize}`
    );
    return { data: res.data.data, total: res.data.total, page: res.data.page, pageSize: res.data.pageSize };
  }

  async approveLeave(id: string, adminRemarks: string): Promise<IAdminLeave> {
    const res = await apiClient.patch<{ success: boolean; data: IAdminLeave }>(`/admin/leaves/${id}/approve`, { adminRemarks });
    return res.data.data;
  }

  async rejectLeave(id: string, adminRemarks: string): Promise<IAdminLeave> {
    const res = await apiClient.patch<{ success: boolean; data: IAdminLeave }>(`/admin/leaves/${id}/reject`, { adminRemarks });
    return res.data.data;
  }

  // Notifications / Announcements
  async sendNotification(payload: ISendNotificationPayload): Promise<unknown> {
    const res = await apiClient.post<{ success: boolean; data: unknown }>("/admin/notifications", payload);
    return res.data.data;
  }

  // Reports
  async getReports(): Promise<IAdminReport[]> {
    const res = await apiClient.get<{ success: boolean; data: IAdminReport[] }>("/admin/reports");
    return res.data.data;
  }

  async generateOccupancyReport(): Promise<IAdminReport> {
    const res = await apiClient.post<{ success: boolean; data: IAdminReport }>("/admin/reports/occupancy");
    return res.data.data;
  }

  async generateComplaintReport(): Promise<IAdminReport> {
    const res = await apiClient.post<{ success: boolean; data: IAdminReport }>("/admin/reports/complaints");
    return res.data.data;
  }

  async generateLeaveReport(): Promise<IAdminReport> {
    const res = await apiClient.post<{ success: boolean; data: IAdminReport }>("/admin/reports/leaves");
    return res.data.data;
  }
}

export default new AdminService();
