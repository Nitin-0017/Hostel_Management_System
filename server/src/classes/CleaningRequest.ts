export enum CleaningStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}
 
export class CleaningRequest {
  private _id: string;
  private _studentId: string;
  private _roomId: string;
  private _assignedStaffId?: string;
  private _status: CleaningStatus;
  private _requestedAt: Date;
  private _scheduledAt?: Date;
  private _completedAt?: Date;
  private _notes?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
 
  constructor(data: {
    id: string;
    studentId: string;
    roomId: string;
    assignedStaffId?: string;
    status?: CleaningStatus;
    requestedAt?: Date;
    scheduledAt?: Date;
    completedAt?: Date;
    notes?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data.id;
    this._studentId = data.studentId;
    this._roomId = data.roomId;
    this._assignedStaffId = data.assignedStaffId;
    this._status = data.status ?? CleaningStatus.PENDING;
    this._requestedAt = data.requestedAt ?? new Date();
    this._scheduledAt = data.scheduledAt;
    this._completedAt = data.completedAt;
    this._notes = data.notes;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }
 
  get id() { return this._id; }
  get studentId() { return this._studentId; }
  get roomId() { return this._roomId; }
  get assignedStaffId() { return this._assignedStaffId; }
  get status() { return this._status; }
  get requestedAt() { return this._requestedAt; }
  get scheduledAt() { return this._scheduledAt; }
  get completedAt() { return this._completedAt; }
  get notes() { return this._notes; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
 
  assignStaff(staffId: string, scheduledAt?: Date): void {
    this._assignedStaffId = staffId;
    this._scheduledAt = scheduledAt;
    this._status = CleaningStatus.IN_PROGRESS;
    this._updatedAt = new Date();
  }
 
  markCompleted(note?: string): void {
    if (this._status === CleaningStatus.COMPLETED) throw new Error("Already completed.");
    this._status = CleaningStatus.COMPLETED;
    this._completedAt = new Date();
    this._notes = note ?? this._notes;
    this._updatedAt = new Date();
  }
 
  toJSON() {
    return {
      id: this._id, studentId: this._studentId, roomId: this._roomId,
      assignedStaffId: this._assignedStaffId, status: this._status,
      requestedAt: this._requestedAt, scheduledAt: this._scheduledAt,
      completedAt: this._completedAt, notes: this._notes,
      createdAt: this._createdAt, updatedAt: this._updatedAt,
    };
  }
}
 


