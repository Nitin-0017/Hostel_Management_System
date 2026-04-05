import { z } from "zod";

export const studentSignupSchema = z.object({
  // User fields
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().optional(),

  // Student-specific fields
  enrollmentNumber: z.string().min(1, "Enrollment number is required."),
  course: z.string().min(1, "Course is required."),
  year: z.number().int().min(1).max(6),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
});

export const staffSignupSchema = z.object({
  // User fields
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().optional(),

  // Staff-specific fields
  employeeId: z.string().min(1, "Employee ID is required."),
  designation: z.string().min(1, "Designation is required."),
  department: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required."),
});

export type StudentSignupInput = z.infer<typeof studentSignupSchema>;
export type StaffSignupInput   = z.infer<typeof staffSignupSchema>;
export type LoginInput         = z.infer<typeof loginSchema>;