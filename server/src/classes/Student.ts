import { User, Role } from "./User";

export interface IStudentProfile {
  enrollmentNumber: string;
  course: string;
  year: number;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  joiningDate: Date;
}

export class Student extends User {
  private _enrollmentNumber: string;
  private _course: string;
  private _year: number;
  private _parentName?: string;
  private _parentPhone?: string;
  private _address?: string;
  private _joiningDate: Date;

  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    enrollmentNumber: string;
    course: string;
    year: number;
    parentName?: string;
    parentPhone?: string;
    address?: string;
    joiningDate?: Date;
  }) {
    super({ ...data, role: Role.STUDENT });
    this._enrollmentNumber = data.enrollmentNumber;
    this._course = data.course;
    this._year = data.year;
    this._parentName = data.parentName;
    this._parentPhone = data.parentPhone;
    this._address = data.address;
    this._joiningDate = data.joiningDate ?? new Date();
  }

  // ── Getters ──────────────────────────────────
  get enrollmentNumber(): string { return this._enrollmentNumber; }
  get course(): string { return this._course; }
  get year(): number { return this._year; }
  get parentName(): string | undefined { return this._parentName; }
  get parentPhone(): string | undefined { return this._parentPhone; }
  get address(): string | undefined { return this._address; }
  get joiningDate(): Date { return this._joiningDate; }

  // ── Setters ──────────────────────────────────
  set course(value: string) { this._course = value; }
  set year(value: number) {
    if (value < 1 || value > 6) throw new Error("Year must be between 1 and 6.");
    this._year = value;
  }
  set parentName(value: string | undefined) { this._parentName = value; }
  set parentPhone(value: string | undefined) { this._parentPhone = value; }
  set address(value: string | undefined) { this._address = value; }

  // ── Polymorphic override ──────────────────────
  override getPermissions(): string[] {
    return [
      ...super.getPermissions(),
      "view_room_details",
      "submit_complaint",
      "track_complaint",
      "apply_leave",
      "view_leave_status",
      "receive_notifications",
      "request_room_cleaning",
      "view_fee_records",
    ];
  }

  // ── Abstract implementation ───────────────────
  getProfileSummary(): Record<string, unknown> {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      enrollmentNumber: this._enrollmentNumber,
      course: this._course,
      year: this._year,
      joiningDate: this._joiningDate,
      role: this.role,
    };
  }
}