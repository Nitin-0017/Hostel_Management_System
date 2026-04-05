import { Student } from "../classes/Student";
import { Staff } from "../classes/Staff";
import { Room } from "../classes/Room";
import { PrismaClient } from "@prisma/client";
import { Notification, NotificationType } from "../classes/Notification";
import { CleaningRequest } from "../classes/CleaningRequest";
import { LeaveRequest } from "../classes/LeaveRequest";
import { Complaint, ComplaintCategory } from "../classes/Complaint";
import { FeeRecord, PaymentMethod } from "../classes/FeeRecord";
 
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
 
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}
 
export interface IStudentService {
  registerStudent(data: Omit<Student, "id" | "createdAt" | "updatedAt"> & { password: string }): Promise<Student>;
  getStudentById(id: string): Promise<Student | null>;
  getStudentByEnrollment(enrollment: string): Promise<Student | null>;
  getAllStudents(options?: PaginationOptions): Promise<PaginatedResult<Student>>;
  updateStudent(id: string, data: Partial<Student>): Promise<Student>;
  removeStudent(id: string): Promise<void>;
  getStudentProfile(id: string): Promise<Record<string, unknown>>;
}
 
export interface IStaffService {
  createStaff(data: Omit<Staff, "id" | "createdAt" | "updatedAt"> & { password: string }): Promise<Staff>;
  getStaffById(id: string): Promise<Staff | null>;
  getAllStaff(options?: PaginationOptions): Promise<PaginatedResult<Staff>>;
  updateStaff(id: string, data: Partial<Staff>): Promise<Staff>;
  removeStaff(id: string): Promise<void>;
  getAssignedRooms(staffId: string): Promise<Room[]>;
}
 
export interface IRoomService {
  createRoom(data: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room>;
  getRoomById(id: string): Promise<Room | null>;
  getRoomByNumber(roomNumber: string): Promise<Room | null>;
  getAllRooms(options?: PaginationOptions): Promise<PaginatedResult<Room>>;
  updateRoom(id: string, data: Partial<Room>): Promise<Room>;
  removeRoom(id: string): Promise<void>;
  checkAvailability(roomId: string): Promise<boolean>;
  allocateRoom(studentId: string, roomId: string): Promise<{ allocationId: string }>;
  deallocateRoom(studentId: string, roomId: string): Promise<void>;
  getAvailableRooms(): Promise<Room[]>;
}
 
export interface IFeeService {
  createFeeRecord(studentId: string, month: number, year: number, amount: number, dueDate: Date): Promise<FeeRecord>;
  getFeeRecord(id: string): Promise<FeeRecord | null>;
  getStudentFees(studentId: string, options?: PaginationOptions): Promise<PaginatedResult<FeeRecord>>;
  recordPayment(feeId: string, method: PaymentMethod, transactionId?: string): Promise<FeeRecord>;
  markOverdue(): Promise<number>; // returns count of records updated
  waiveFee(feeId: string, adminId: string, remarks: string): Promise<FeeRecord>;
  getFeeSummary(month: number, year: number): Promise<{ total: number; paid: number; pending: number; overdue: number }>;
}
 
export interface IComplaintService {
  submitComplaint(studentId: string, category: ComplaintCategory, subject: string, description: string): Promise<Complaint>;
  getComplaintById(id: string): Promise<Complaint | null>;
  getStudentComplaints(studentId: string, options?: PaginationOptions): Promise<PaginatedResult<Complaint>>;
  getAllComplaints(options?: PaginationOptions): Promise<PaginatedResult<Complaint>>;
  resolveComplaint(complaintId: string, adminId: string, note: string): Promise<Complaint>;
  rejectComplaint(complaintId: string, adminId: string, note: string): Promise<Complaint>;
  markInProgress(complaintId: string): Promise<Complaint>;
}
 
export interface ILeaveService {
  applyLeave(studentId: string, fromDate: Date, toDate: Date, reason: string): Promise<LeaveRequest>;
  getLeaveById(id: string): Promise<LeaveRequest | null>;
  getStudentLeaves(studentId: string, options?: PaginationOptions): Promise<PaginatedResult<LeaveRequest>>;
  getAllLeaves(options?: PaginationOptions): Promise<PaginatedResult<LeaveRequest>>;
  approveLeave(leaveId: string, adminId: string, remarks?: string): Promise<LeaveRequest>;
  rejectLeave(leaveId: string, adminId: string, remarks: string): Promise<LeaveRequest>;
  cancelLeave(leaveId: string, studentId: string): Promise<LeaveRequest>;
}
 
export interface INotificationService {
  sendNotification(userId: string, type: NotificationType, title: string, message: string, sentById?: string): Promise<Notification>;
  broadcastNotification(userIds: string[], type: NotificationType, title: string, message: string, sentById?: string): Promise<Notification[]>;
  getUserNotifications(userId: string, options?: PaginationOptions): Promise<PaginatedResult<Notification>>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
 
export interface ICleaningService {
  requestCleaning(studentId: string, roomId: string, notes?: string): Promise<CleaningRequest>;
  getCleaningRequest(id: string): Promise<CleaningRequest | null>;
  getAllRequests(options?: PaginationOptions): Promise<PaginatedResult<CleaningRequest>>;
  getStaffRequests(staffId: string): Promise<CleaningRequest[]>;
  assignStaff(requestId: string, staffId: string, scheduledAt?: Date): Promise<CleaningRequest>;
  markCompleted(requestId: string, staffId: string, note?: string): Promise<CleaningRequest>;
}
 
export interface IAuthService {
  login(email: string, password: string): Promise<{ token: string; user: Record<string, unknown> }>;
  logout(token: string): Promise<void>;
  verifyToken(token: string): Promise<{ userId: string; role: string }>;
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, hash: string): Promise<boolean>;
}
 
export interface IReportService {
  generateOccupancyReport(adminId: string): Promise<Record<string, unknown>>;
  generateFeeReport(adminId: string, month: number, year: number): Promise<Record<string, unknown>>;
  generateComplaintReport(adminId: string): Promise<Record<string, unknown>>;
  generateLeaveReport(adminId: string): Promise<Record<string, unknown>>;
}
 
export interface IPaymentStrategy {
  processPayment(feeId: string, amount: number, meta?: Record<string, unknown>): Promise<{ success: boolean; transactionId: string }>;
}
 
export class OnlinePaymentStrategy implements IPaymentStrategy {
  async processPayment(feeId: string, amount: number, meta?: Record<string, unknown>): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[OnlinePayment] Processing ₹${amount} for fee ${feeId}`, meta);
    const transactionId = `TXN_ONLINE_${Date.now()}`;
    return { success: true, transactionId };
  }
}
 
export class ManualPaymentStrategy implements IPaymentStrategy {
  async processPayment(feeId: string, amount: number, meta?: Record<string, unknown>): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[ManualPayment] Recording ₹${amount} for fee ${feeId}`, meta);
    const transactionId = `TXN_MANUAL_${Date.now()}`;
    return { success: true, transactionId };
  }
}
 
export class UPIPaymentStrategy implements IPaymentStrategy {
  async processPayment(feeId: string, amount: number, meta?: Record<string, unknown>): Promise<{ success: boolean; transactionId: string }> {
    console.log(`[UPIPayment] Processing ₹${amount} for fee ${feeId} via UPI`, meta);
    const transactionId = `TXN_UPI_${Date.now()}`;
    return { success: true, transactionId };
  }
}
 
export class PaymentProcessor {
  private strategy: IPaymentStrategy;
 
  constructor(strategy: IPaymentStrategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy: IPaymentStrategy): void {
    this.strategy = strategy;
  }
 
  async execute(feeId: string, amount: number, meta?: Record<string, unknown>) {
    return this.strategy.processPayment(feeId, amount, meta);
  }
}
 
export interface INotificationObserver {
  update(event: string, data: Record<string, unknown>): Promise<void>;
}
 
export interface INotificationSubject {
  subscribe(event: string, observer: INotificationObserver): void;
  unsubscribe(event: string, observer: INotificationObserver): void;
  notify(event: string, data: Record<string, unknown>): Promise<void>;
}
 
export class HostelEventBus implements INotificationSubject {
  private observers: Map<string, INotificationObserver[]> = new Map();
 
  subscribe(event: string, observer: INotificationObserver): void {
    if (!this.observers.has(event)) this.observers.set(event, []);
    this.observers.get(event)!.push(observer);
  }
 
  unsubscribe(event: string, observer: INotificationObserver): void {
    const list = this.observers.get(event) ?? [];
    this.observers.set(event, list.filter(o => o !== observer));
  }
 
  async notify(event: string, data: Record<string, unknown>): Promise<void> {
    const list = this.observers.get(event) ?? [];
    await Promise.all(list.map(o => o.update(event, data)));
  }
}
 
export class FeeReminderObserver implements INotificationObserver {
  async update(event: string, data: Record<string, unknown>): Promise<void> {
    if (event === "fee.overdue") {
      console.log(`[FeeReminderObserver] Fee overdue for student ${data.studentId}`);
    }
  }
}
 
export class RoomAllocationObserver implements INotificationObserver {
  async update(event: string, data: Record<string, unknown>): Promise<void> {
    if (event === "room.allocated") {
      console.log(`[RoomAllocationObserver] Room ${data.roomId} allocated to ${data.studentId}`);
    }
  }
}
 
export class DatabaseManager {
  private static instance: DatabaseManager;
  private _client: PrismaClient;
 
  private constructor() {
    this._client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
    });
  }
 
  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }
 
  get client(): PrismaClient {
    return this._client;
  }
 
  async connect(): Promise<void> {
    await this._client.$connect();
    console.log("[DatabaseManager] Connected to MySQL via Prisma.");
  }
 
  async disconnect(): Promise<void> {
    await this._client.$disconnect();
    console.log("[DatabaseManager] Disconnected.");
  }
}