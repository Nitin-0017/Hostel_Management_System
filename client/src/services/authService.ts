import apiClient from "../config/apiClient";
import type {
  ILoginRequest,
  IStudentSignupRequest,
  IStaffSignupRequest,
  IAuthResponse,
  IUser,
} from "../types";

export type AuthRole = "ADMIN" | "STUDENT" | "STAFF" | null;

const TOKEN_KEY = "authToken";
const USER_KEY = "user";

function normalizeUser(user: Record<string, unknown>): Record<string, unknown> {
  // Backend getProfileSummary() returns `fullName` instead of firstName/lastName.
  // Split it so the frontend IUser shape is always consistent.
  if (user.fullName && (!user.firstName || !user.lastName)) {
    const parts = String(user.fullName).trim().split(" ");
    user.firstName = parts[0] ?? "";
    user.lastName  = (parts.slice(1).join(" ") || parts[0]) ?? "";
  }
  return user;
}

function saveSession(data: IAuthResponse): void {
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user) {
    const normalized = normalizeUser({ ...(data.user as Record<string, unknown>) });
    localStorage.setItem(USER_KEY, JSON.stringify(normalized));
    // Keep data.user in sync so callers get the normalized object too
    (data as Record<string, unknown>).user = normalized;
  }
}

function extractError(error: unknown): never {
  const err = error as Record<string, unknown>;
  const msg =
    ((err.response as Record<string, unknown>)?.data as Record<string, unknown>)?.message ||
    (err as Record<string, unknown>).message ||
    "Request failed. Please try again.";
  throw new Error(String(msg));
}

const LOGIN_ENDPOINTS: Record<string, string> = {
  ADMIN: "/users/admin/login",
  STUDENT: "/users/student/login",
  STAFF: "/users/staff/login",
};

class AuthService {
  async login(credentials: ILoginRequest, role: AuthRole): Promise<IAuthResponse> {
    const endpoint = role ? LOGIN_ENDPOINTS[role] : LOGIN_ENDPOINTS["STUDENT"];
    try {
      const res = await apiClient.post<{ success: boolean; data: IAuthResponse }>(
        endpoint,
        credentials
      );
      const data = res.data.data;
      saveSession(data);
      return data;
    } catch (error) {
      extractError(error);
    }
  }

  async signupStudent(data: IStudentSignupRequest): Promise<IAuthResponse> {
    try {
      const res = await apiClient.post<{ success: boolean; data: IAuthResponse }>(
        "/users/student/signup",
        data
      );
      const resData = res.data.data;
      saveSession(resData);
      return resData;
    } catch (error) {
      extractError(error);
    }
  }

  async signupStaff(data: IStaffSignupRequest): Promise<IAuthResponse> {
    try {
      const res = await apiClient.post<{ success: boolean; data: IAuthResponse }>(
        "/users/staff/signup",
        data
      );
      const resData = res.data.data;
      saveSession(resData);
      return resData;
    } catch (error) {
      extractError(error);
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  getCurrentUser(): IUser | null {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return normalizeUser(parsed) as unknown as IUser;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}

export default new AuthService();
