import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IUser, IStudentSignupRequest } from "../types";
import authService from "../services/authService";
import { AuthContext } from "./AuthContextDef";

interface AuthProviderProps {
  children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loginRole, setLoginRole] = useState<"ADMIN" | "STUDENT" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Failed to restore auth state:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);


  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login({ email, password });

      if (response.user) {
        setUser(response.user);
      } else {
        throw new Error("No user data in response");
      }
    } catch (err) {
      const error_obj = err as Record<string, unknown>;
      const errorMessage =
        ((error_obj.response as Record<string, Record<string, unknown>>)
          ?.data as Record<string, unknown>)?.message ||
        (error_obj as Record<string, unknown>).message ||
        "Login failed";
      setError(String(errorMessage));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };


  const signup = async (data: IStudentSignupRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      let response;
      

      if (loginRole === "ADMIN") {
        response = await authService.signupAdmin({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
        });
      } else {
        response = await authService.signupStudent(data);
      }

      if (response.user) {
        setUser(response.user);
      } else {
        throw new Error("No user data in response");
      }
    } catch (err) {
      const error_obj = err as Record<string, unknown>;
      const errorMessage =
        ((error_obj.response as Record<string, Record<string, unknown>>)
          ?.data as Record<string, unknown>)?.message ||
        (error_obj as Record<string, unknown>).message ||
        "Signup failed";
      setError(String(errorMessage));
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

 
  const clearError = (): void => {
    setError(null);
  };

  const value = {
    user,
    loginRole,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    signup,
    logout,
    clearError,
    setLoginRole,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};