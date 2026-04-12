import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IStudentSignupRequest, IStaffSignupRequest } from "../types";
import authService from "../services/authService";
import { AuthContext } from "./AuthContextDef";
import type { AuthRole } from "./AuthContextDef";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loginRole, setLoginRole] = useState<AuthRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = authService.getCurrentUser();
      if (stored) setUser(stored);
    } catch (e) {
      console.error("Failed to restore auth state:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const extractMessage = (err: unknown): string => {
    const e = err as Record<string, unknown>;
    return String(
      ((e.response as Record<string, unknown>)?.data as Record<string, unknown>)?.message ||
        (e as Record<string, unknown>).message ||
        "Operation failed"
    );
  };

  // Returns the resolved user role on success so callers can navigate.
  // Throws on failure — callers must catch and stay on their page.
  const login = async (email: string, password: string, role?: AuthRole): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login({ email, password }, role ?? loginRole);
      if (!res.user) throw new Error("No user data in response");
      setUser(res.user);
      return res.user.role as string;
    } catch (err) {
      setError(extractMessage(err));
      throw err;          // re-throw so Login page stays put
    } finally {
      setIsLoading(false);
    }
  };

  // Returns resolved role on success; throws on failure.
  const signupStudent = async (data: IStudentSignupRequest): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.signupStudent(data);
      if (!res.user) throw new Error("No user data in response");
      setUser(res.user);
      return res.user.role as string;
    } catch (err) {
      setError(extractMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signupStaff = async (data: IStaffSignupRequest): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.signupStaff(data);
      if (!res.user) throw new Error("No user data in response");
      setUser(res.user);
      return res.user.role as string;
    } catch (err) {
      setError(extractMessage(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loginRole,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signupStudent,
        signupStaff,
        logout,
        clearError: () => setError(null),
        setLoginRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
