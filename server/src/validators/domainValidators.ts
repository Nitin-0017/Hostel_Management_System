import { z } from "zod";

// ── Room ──────────────────────────────────────────────────────────────────────
export const createRoomSchema = z.object({
  roomNumber: z.string().min(1),
  floor: z.number().int().min(0),
  building: z.string().optional(),
  type: z.enum(["SINGLE", "DOUBLE", "TRIPLE", "DORMITORY"]),
  capacity: z.number().int().min(1),
  monthlyFee: z.number().positive(),
  amenities: z.string().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE", "RESERVED"]).optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const allocateRoomSchema = z.object({
  studentId: z.string().min(1),
  roomId: z.string().min(1),
});

// ── Student ───────────────────────────────────────────────────────────────────
export const updateStudentSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  course: z.string().optional(),
  year: z.number().int().min(1).max(6).optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  address: z.string().optional(),
});

// ── Complaint ─────────────────────────────────────────────────────────────────
export const submitComplaintSchema = z.object({
  category: z.enum(["MAINTENANCE", "CLEANLINESS", "FOOD", "SECURITY", "NOISE", "OTHER"]),
  subject: z.string().min(1),
  description: z.string().min(1),
});

export const resolveComplaintSchema = z.object({
  resolutionNote: z.string().min(1),
});

// ── Leave ─────────────────────────────────────────────────────────────────────
export const applyLeaveSchema = z.object({
  fromDate: z.string().datetime(),
  toDate: z.string().datetime(),
  reason: z.string().min(1),
});

export const reviewLeaveSchema = z.object({
  adminRemarks: z.string().optional(),
});

// ── Cleaning ──────────────────────────────────────────────────────────────────
export const requestCleaningSchema = z.object({
  notes: z.string().optional(),
});

export const assignCleaningSchema = z.object({
  staffId: z.string().min(1),
  scheduledAt: z.string().datetime().optional(),
});

export const updateCleaningStatusSchema = z.object({
  status: z.enum(["IN_PROGRESS", "COMPLETED"]),
  note: z.string().optional(),
});

// ── Notification ──────────────────────────────────────────────────────────────
export const sendNotificationSchema = z.object({
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  broadcast: z.boolean().optional(),
  type: z.enum(["FEE_REMINDER", "ROOM_ALLOCATION", "LEAVE_UPDATE", "COMPLAINT_UPDATE", "GENERAL", "CLEANING_ASSIGNED"]),
  title: z.string().min(1),
  message: z.string().min(1),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type SubmitComplaintInput = z.infer<typeof submitComplaintSchema>;
export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>;
