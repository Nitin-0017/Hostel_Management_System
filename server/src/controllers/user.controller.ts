import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import {
  studentSignupSchema,
  staffSignupSchema,
  loginSchema,
} from "../validators/authValidators";

const authService = new AuthService();

// ── Helper: send validation errors cleanly ────────────────────────────────────
function sendValidationError(res: Response, errors: any[]) {
  res.status(422).json({
    success: false,
    message: "Validation failed.",
    errors: errors.map((e) => e.message),
  });
}

// ── POST /api/auth/student/signup ─────────────────────────────────────────────
export const studentSignup = async (req: Request, res: Response): Promise<void> => {
  const parsed = studentSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  try {
    const result = await authService.studentSignup(parsed.data);
    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/staff/signup ───────────────────────────────────────────────
export const staffSignup = async (req: Request, res: Response): Promise<void> => {
  const parsed = staffSignupSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  try {
    const result = await authService.staffSignup(parsed.data);
    res.status(201).json({
      success: true,
      message: "Staff registered successfully.",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/student/login ──────────────────────────────────────────────
export const studentLogin = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  try {
    const result = await authService.studentLogin(parsed.data);
    res.status(200).json({
      success: true,
      message: "Student login successful.",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/staff/login ────────────────────────────────────────────────
export const staffLogin = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  try {
    const result = await authService.staffLogin(parsed.data);
    res.status(200).json({
      success: true,
      message: "Staff login successful.",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/admin/login ────────────────────────────────────────────────
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    sendValidationError(res, parsed.error.issues);
    return;
  }

  try {
    const result = await authService.adminLogin(parsed.data);
    res.status(200).json({
      success: true,
      message: "Admin login successful.",
      data: result,
    });
  } catch (err: any) {
    res.status(401).json({ success: false, message: err.message });
  }
};

// ── GET /api/auth/me  (requires Bearer token) ────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.user!;
    const user = await authService.getMe(userId, role);
    res.status(200).json({ success: true, data: user });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};