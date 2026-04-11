import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import {
  studentSignupSchema,
  adminSignupSchema,
  staffSignupSchema,
} from "../validators/authValidators";

/**
 * Design Pattern: Adapter Pattern
 * Adapts HTTP requests/responses to service interfaces
 */

const authService = new AuthService();

/**
 * POST /api/auth/login
 * Login user with email and password
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    // Call auth service
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

/**
 * POST /api/auth/student/signup
 * Register new student
 */
export const studentSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate student signup input
    const validatedInput = studentSignupSchema.parse(req.body);
    const result = await authService.studentSignup(validatedInput);

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

/**
 * POST /api/auth/admin/signup
 * Register new admin
 */
export const adminSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate admin signup input
    const validatedInput = adminSignupSchema.parse(req.body);
    const result = await authService.adminSignup(validatedInput);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Admin signup failed",
    });
  }
};

/**
 * POST /api/auth/staff/signup
 * Register new staff
 */
export const staffSignup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await authService.staffSignup(req.body);

    res.status(201).json({
      success: true,
      message: "Staff registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || "Signup failed",
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout user (just for API completeness)
 */
export const logout = (req: Request, res: Response): void => {
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

/**
 * GET /api/auth/me
 * Get current logged-in user
 */
export const getCurrentUser = (req: Request, res: Response): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};
