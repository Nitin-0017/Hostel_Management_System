export enum LeaveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}
 
export class LeaveRequest {
  private _id: string;
  private _studentId: string;
  private _approvedById?: string;
  private _fromDate: Date;
  private _toDate: Date;
  private _reason: string;
  private _status: LeaveStatus;
  private _reviewedAt?: Date;
  private _adminRemarks?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
 
  constructor(data: {
    id: string;
    studentId: string;
    approvedById?: string;
    fromDate: Date;
    toDate: Date;
    reason: string;
    status?: LeaveStatus;
    reviewedAt?: Date;
    adminRemarks?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    if (data.fromDate > data.toDate) throw new Error("fromDate must be before toDate.");
    this._id = data.id;
    this._studentId = data.studentId;
    this._approvedById = data.approvedById;
    this._fromDate = data.fromDate;
    this._toDate = data.toDate;
    this._reason = data.reason;
    this._status = data.status ?? LeaveStatus.PENDING;
    this._reviewedAt = data.reviewedAt;
    this._adminRemarks = data.adminRemarks;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }
 
  get id() { return this._id; }
  get studentId() { return this._studentId; }
  get approvedById() { return this._approvedById; }
  get fromDate() { return this._fromDate; }
  get toDate() { return this._toDate; }
  get reason() { return this._reason; }
  get status() { return this._status; }
  get reviewedAt() { return this._reviewedAt; }
  get adminRemarks() { return this._adminRemarks; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
 
  get durationDays(): number {
    return Math.ceil((this._toDate.getTime() - this._fromDate.getTime()) / (1000 * 60 * 60 * 24));
  }
 
  approve(adminId: string, remarks?: string): void {
    if (this._status !== LeaveStatus.PENDING) throw new Error("Only PENDING leaves can be approved.");
    this._status = LeaveStatus.APPROVED;
    this._approvedById = adminId;
    this._adminRemarks = remarks;
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }
 
  reject(adminId: string, remarks: string): void {
    if (this._status !== LeaveStatus.PENDING) throw new Error("Only PENDING leaves can be rejected.");
    this._status = LeaveStatus.REJECTED;
    this._approvedById = adminId;
    this._adminRemarks = remarks;
    this._reviewedAt = new Date();
    this._updatedAt = new Date();
  }
 
  cancel(): void {
    if (this._status !== LeaveStatus.PENDING) throw new Error("Only PENDING leaves can be cancelled.");
    this._status = LeaveStatus.CANCELLED;
    this._updatedAt = new Date();
  }
 
  toJSON() {
    return {
      id: this._id, studentId: this._studentId, approvedById: this._approvedById,
      fromDate: this._fromDate, toDate: this._toDate, reason: this._reason,
      status: this._status, durationDays: this.durationDays, reviewedAt: this._reviewedAt,
      adminRemarks: this._adminRemarks, createdAt: this._createdAt, updatedAt: this._updatedAt,
    };
  }
}
 
