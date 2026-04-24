import apiClient from "../config/apiClient";

export interface INotification {
  id: string;
  userId: string;
  sentById?: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

class NotificationService {
  /** Fetch the current user's notifications (student or staff) */
  async getMyNotifications(page = 1, pageSize = 50): Promise<{ data: INotification[]; total: number }> {
    // The base URL prefix (/student or /staff) is determined by the user's role
    // Try student first; the interceptor will handle 401s
    const res = await apiClient.get<{
      success: boolean;
      data: INotification[];
      total: number;
      page: number;
      pageSize: number;
    }>(`/student/notifications?page=${page}&pageSize=${pageSize}`);
    return { data: res.data.data, total: res.data.total };
  }

  /** Mark a single notification as read */
  async markRead(id: string): Promise<void> {
    await apiClient.patch(`/student/notifications/${id}/read`);
  }

  /** Mark all notifications as read */
  async markAllRead(): Promise<void> {
    await apiClient.patch("/student/notifications/read-all");
  }
}

export default new NotificationService();
