import apiClient from "../config/apiClient";
import type { IUser } from "../types";

export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function normalizeUser(user: any) {
  // Backend sometimes returns fullName instead of firstName/lastName
  if (user.fullName && (!user.firstName || !user.lastName)) {
    const parts = String(user.fullName).trim().split(" ");
    user.firstName = parts[0] ?? "";
    user.lastName = (parts.slice(1).join(" ") || parts[0]) ?? "";
  }
  return user;
}

class UserService {
  async getProfile(): Promise<IUser> {
    const res = await apiClient.get<{ success: boolean; data: any }>("/student/profile");
    return normalizeUser(res.data.data);
  }

  async updateProfile(data: IUpdateProfileRequest): Promise<IUser> {
    const res = await apiClient.put<{ success: boolean; data: any }>("/student/profile", data);
    return normalizeUser(res.data.data);
  }

  async getMe(): Promise<IUser> {
    const res = await apiClient.get<{ success: boolean; data: any }>("/users/me");
    return normalizeUser(res.data.data);
  }

  async updateUser(data: { firstName?: string; lastName?: string; phone?: string }): Promise<IUser> {
    const res = await apiClient.put<{ success: boolean; data: any }>("/users/update", data);
    return normalizeUser(res.data.data);
  }

  async changePassword(data: any): Promise<any> {
    const res = await apiClient.put<{ success: boolean; message: string }>("/users/change-password", data);
    return res.data;
  }
}

export default new UserService();
