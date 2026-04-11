import { createContext } from "react";
import type { IUser, IStudentSignupRequest } from "../types";


export interface IAuthContext {
  user: IUser | null;
  loginRole: "ADMIN" | "STUDENT" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: IStudentSignupRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setLoginRole: (role: "ADMIN" | "STUDENT" | null) => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);
