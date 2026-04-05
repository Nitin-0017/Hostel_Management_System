// src/models/Complaint.ts
 
export enum ComplaintStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}
 
export enum ComplaintCategory {
  MAINTENANCE = "MAINTENANCE",
  CLEANLINESS = "CLEANLINESS",
  FOOD = "FOOD",
  SECURITY = "SECURITY",
  NOISE = "NOISE",
  OTHER = "OTHER",
}
 
export class Complaint {
  private _id: string;
  private _studentId: string;
  private _resolvedById?: string;
  private _category: ComplaintCategory;
  private _subject: string;
  private _description: string;
  private _status: ComplaintStatus;
  private _resolvedAt?: Date;
  private _resolutionNote?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
 
  constructor(data: {
    id: string;
    studentId: string;
    resolvedById?: string;
    category: ComplaintCategory;
    subject: string;
    description: string;
    status?: ComplaintStatus;
    resolvedAt?: Date;
    resolutionNote?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data.id;
    this._studentId = data.studentId;
    this._resolvedById = data.resolvedById;
    this._category = data.category;
    this._subject = data.subject;
    this._description = data.description;
    this._status = data.status ?? ComplaintStatus.OPEN;
    this._resolvedAt = data.resolvedAt;
    this._resolutionNote = data.resolutionNote;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }
 
  get id() { return this._id; }
  get studentId() { return this._studentId; }
  get resolvedById() { return this._resolvedById; }
  get category() { return this._category; }
  get subject() { return this._subject; }
  get description() { return this._description; }
  get status() { return this._status; }
  get resolvedAt() { return this._resolvedAt; }
  get resolutionNote() { return this._resolutionNote; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
 
  markInProgress(): void {
    if (this._status !== ComplaintStatus.OPEN) throw new Error("Only OPEN complaints can be moved to IN_PROGRESS.");
    this._status = ComplaintStatus.IN_PROGRESS;
    this._updatedAt = new Date();
  }
 
  resolve(adminId: string, note: string): void {
    this._status = ComplaintStatus.RESOLVED;
    this._resolvedById = adminId;
    this._resolutionNote = note;
    this._resolvedAt = new Date();
    this._updatedAt = new Date();
  }
 
  reject(adminId: string, note: string): void {
    this._status = ComplaintStatus.REJECTED;
    this._resolvedById = adminId;
    this._resolutionNote = note;
    this._resolvedAt = new Date();
    this._updatedAt = new Date();
  }
 
  toJSON() {
    return {
      id: this._id, studentId: this._studentId, resolvedById: this._resolvedById,
      category: this._category, subject: this._subject, description: this._description,
      status: this._status, resolvedAt: this._resolvedAt, resolutionNote: this._resolutionNote,
      createdAt: this._createdAt, updatedAt: this._updatedAt,
    };
  }
}
 