import apiClient from "../config/apiClient";
import type { IUser } from "../types";

export interface IUpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

function normalizeUser(raw: any): any {
  // Backend getProfile() returns a nested Prisma object:
  // { id (studentId), enrollmentNumber, course, year, user: { firstName, ... }, allocations: [...] }
  // Flatten it so the frontend always gets a consistent flat IUser shape.
  let user = raw;

  if (raw?.user && typeof raw.user === "object") {
    // Nested student/staff profile shape — merge user fields to top level
    user = {
      ...raw.user,           // firstName, lastName, email, phone, isActive, createdAt, updatedAt
      subId: raw.id,         // student/staff record id
      enrollmentNumber: raw.enrollmentNumber,
      course: raw.course,
      year: raw.year,
      employeeId: raw.employeeId,
      designation: raw.designation,
      department: raw.department,
      joiningDate: raw.joiningDate,
      // current room from allocations
      room: raw.allocations?.[0]?.room ?? null,
    };
  }

  // Backend getProfileSummary() returns fullName instead of firstName/lastName
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

  // Routes to the correct profile update endpoint based on role.
  // STUDENT  → PUT /student/profile
  // STAFF    → no backend route yet; updates localStorage only
  // ADMIN    → no backend route yet; updates localStorage only
  async updateUser(
    data: { firstName?: string; lastName?: string; phone?: string },
    role?: string
  ): Promise<IUser> {
    if (role === "STUDENT") {
      const res = await apiClient.put<{ success: boolean; data: any }>("/student/profile", data);
      return normalizeUser(res.data.data);
    }

    // For ADMIN / STAFF: no backend update route exists.
    // Persist the change locally so the UI reflects it immediately.
    const stored = localStorage.getItem("user");
    const current = stored ? JSON.parse(stored) : {};
    const updated = normalizeUser({ ...current, ...data });
    localStorage.setItem("user", JSON.stringify(updated));
    return updated as IUser;
  }

  async changePassword(data: any): Promise<any> {
    const res = await apiClient.put<{ success: boolean; message: string }>("/users/change-password", data);
    return res.data;
  }
}

export default new UserService();
