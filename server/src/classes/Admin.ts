// src/models/Admin.ts
// Extends User — demonstrates Inheritance + Polymorphism

import { User, Role } from "./User";

export class Admin extends User {
  private _adminLevel: number; // 1 = Warden, 2 = Super Admin

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
    adminLevel?: number;
  }) {
    super({ ...data, role: Role.ADMIN });
    this._adminLevel = data.adminLevel ?? 1;
  }

  // ── Getters ──────────────────────────────────
  get adminLevel(): number { return this._adminLevel; }
  get isSuperAdmin(): boolean { return this._adminLevel === 2; }

  // ── Setters ──────────────────────────────────
  set adminLevel(value: number) {
    if (value < 1 || value > 2) throw new Error("Admin level must be 1 or 2.");
    this._adminLevel = value;
  }

  // ── Polymorphic override ──────────────────────
  override getPermissions(): string[] {
    const base = [
      ...super.getPermissions(),
      "view_add_student",
      "update_student",
      "remove_student",
      "view_add_room",
      "update_room",
      "remove_room",
      "allocate_room",
      "deallocate_room",
      "check_room_availability",
      "view_resolve_complaints",
      "view_leaves",
      "approve_reject_leaves",
      "generate_reports",
      "send_notifications",
      "view_cleaning_status",
      "assign_cleaning_staff",
    ];
    if (this.isSuperAdmin) {
      base.push("manage_admins", "manage_staff", "system_settings");
    }
    return base;
  }

  // ── Abstract implementation ───────────────────
  getProfileSummary(): Record<string, unknown> {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      adminLevel: this._adminLevel,
      isSuperAdmin: this.isSuperAdmin,
      role: this.role,
    };
  }
}