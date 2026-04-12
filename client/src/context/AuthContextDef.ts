import { createContext } from "react";
import type { IUser, IStudentSignupRequest, IStaffSignupRequest } from "../types";

export type AuthRole = "ADMIN" | "STUDENT" | "STAFF" | null;

export interface IAuthContext {
  user: IUser | null;
  loginRole: AuthRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role?: AuthRole) => Promise<void>;
  signupStudent: (data: IStudentSignupRequest) => Promise<void>;
  signupStaff: (data: IStaffSignupRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoginRole: (role: AuthRole) => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
