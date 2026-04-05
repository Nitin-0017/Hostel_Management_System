// src/models/Staff.ts
// Extends User — demonstrates Inheritance + Polymorphism

import { User, Role } from "./User";

export class Staff extends User {
  private _employeeId: string;
  private _designation: string;
  private _department?: string;
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
    employeeId: string;
    designation: string;
    department?: string;
    joiningDate?: Date;
  }) {
    super({ ...data, role: Role.STAFF });
    this._employeeId = data.employeeId;
    this._designation = data.designation;
    this._department = data.department;
    this._joiningDate = data.joiningDate ?? new Date();
  }

  // ── Getters ──────────────────────────────────
  get employeeId(): string { return this._employeeId; }
  get designation(): string { return this._designation; }
  get department(): string | undefined { return this._department; }
  get joiningDate(): Date { return this._joiningDate; }

  // ── Setters ──────────────────────────────────
  set designation(value: string) { this._designation = value; }
  set department(value: string | undefined) { this._department = value; }

  // ── Polymorphic override ──────────────────────
  override getPermissions(): string[] {
    return [
      ...super.getPermissions(),
      "view_assigned_rooms",
      "update_cleaning_status",
      "view_cleaning_requests",
    ];
  }

  // ── Abstract implementation ───────────────────
  getProfileSummary(): Record<string, unknown> {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      employeeId: this._employeeId,
      designation: this._designation,
      department: this._department,
      joiningDate: this._joiningDate,
      role: this.role,
    };
  }
}