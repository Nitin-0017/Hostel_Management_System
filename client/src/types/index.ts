export enum UserRole {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  STAFF = "STAFF",
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IStudent extends IUser {
  enrollmentNumber: string;
  course: string;
  year: number;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  joiningDate: string;
}

export interface IAdmin extends IUser {
  department?: string;
  permissions: string[];
}

export interface IStaff extends IUser {
  staffId: string;
  department?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  token?: string;
  refreshToken?: string;
  user?: IUser | IStudent | IAdmin | IStaff;
  statusCode?: number;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IStudentSignupRequest extends ILoginRequest {
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  course: string;
  year: number;
  phone?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
}

// Matches backend staffSignupSchema exactly
export interface IStaffSignupRequest extends ILoginRequest {
  firstName: string;
  lastName: string;
  employeeId: string;
  designation: string;
  department?: string;
  phone?: string;
}

export interface IAdminSignupRequest extends ILoginRequest {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface IErrorResponse {
  success: false;
  message: string;
  errors?: string[];
  statusCode: number;
}

export interface IRoom {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  type: "single" | "double" | "triple";
  isAvailable: boolean;
  occupants?: IStudent[];
  createdAt: string;
  updatedAt: string;
}

export enum ComplaintStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
}

export interface IComplaint {
  id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  priority: "low" | "medium" | "high";
  studentId: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface ILeaveRequest {
  id: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IFeeRecord {
  id: string;
  studentId: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "pending" | "paid" | "overdue";
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  statusCode?: number;
}
