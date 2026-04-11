import apiClient from "../config/apiClient";
import type {
  ILoginRequest,
  IStudentSignupRequest,
  IAdminSignupRequest,
  IAuthResponse,
  IUser,
} from "../types";



class AuthService {
  private readonly TOKEN_KEY = "authToken";
  private readonly REFRESH_TOKEN_KEY = "refreshToken";
  private readonly USER_KEY = "user";

  /**
   * Login user with email and password
   * Design Pattern: Strategy Pattern (can extend with OAuth, SSO, etc.)
   *
   * @param credentials - Email and password
   * @returns Auth response with token and user data
   */
  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    try {
      const response = await apiClient.post<IAuthResponse>(
        "/auth/login",
        credentials
      );


      if (response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem(
          this.REFRESH_TOKEN_KEY,
          response.data.refreshToken
        );
      }


      if (response.data.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      const err = error as Record<string, unknown>;
      const errorMessage =
        ((err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >)?.message ||
        (err as Record<string, unknown>).message ||
        "Login failed. Please try again.";

      throw new Error(String(errorMessage));
    }
  }

  /**
   * Register new student
   * Design Pattern: Strategy Pattern (extensible for different user types)
   *
   * @param data - Student signup data
   * @returns Auth response with token and user data
   */
  async signupStudent(data: IStudentSignupRequest): Promise<IAuthResponse> {
    try {
      const response = await apiClient.post<IAuthResponse>(
        "/auth/student/signup",
        data
      );


      if (response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem(
          this.REFRESH_TOKEN_KEY,
          response.data.refreshToken
        );
      }


      if (response.data.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      const err = error as Record<string, unknown>;
      const errorMessage =
        ((err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >)?.message ||
        (err as Record<string, unknown>).message ||
        "Signup failed. Please try again.";

      throw new Error(String(errorMessage));
    }
  }

  /**
   * Register new admin
   * Design Pattern: Strategy Pattern (extensible for different user types)
   *
   * @param data - Admin signup data
   * @returns Auth response with token and user data
   */
  async signupAdmin(data: IAdminSignupRequest): Promise<IAuthResponse> {
    try {
      const response = await apiClient.post<IAuthResponse>(
        "/auth/admin/signup",
        data
      );


      if (response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
      }
      if (response.data.refreshToken) {
        localStorage.setItem(
          this.REFRESH_TOKEN_KEY,
          response.data.refreshToken
        );
      }


      if (response.data.user) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      const err = error as Record<string, unknown>;
      const errorMessage =
        ((err.response as Record<string, unknown>)?.data as Record<
          string,
          unknown
        >)?.message ||
        (err as Record<string, unknown>).message ||
        "Admin signup failed. Please try again.";

      throw new Error(String(errorMessage));
    }
  }

 
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get current logged-in user from localStorage
   *
   * @returns User object or null if not logged in
   */
  getCurrentUser(): IUser | null {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   *
   * @returns True if token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored authentication token
   *
   * @returns JWT token or null
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get stored refresh token
   *
   * @returns Refresh token or null
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<IAuthResponse>("/auth/refresh", {
        refreshToken,
      });

      if (response.data.token) {
        localStorage.setItem(this.TOKEN_KEY, response.data.token);
        return response.data.token;
      }

      throw new Error("No token in refresh response");
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}


export default new AuthService();