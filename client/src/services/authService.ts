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

function saveSession(data: IAuthResponse): void {
  if (data.token) localStorage.setItem(TOKEN_KEY, data.token);
  if (data.user) localStorage.setItem(USER_KEY, JSON.stringify(data.user));
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
      return raw ? JSON.parse(raw) : null;
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
