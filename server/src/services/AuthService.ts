import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import { DatabaseManager } from "../interfaces/IServices";
import { Student } from "../classes/Student";
import { Staff } from "../classes/Staff";
import { Admin } from "../classes/Admin";
import { Role } from "../classes/User";
import {
  StudentSignupInput,
  AdminSignupInput,
  StaffSignupInput,
  LoginInput,
} from "../validators/authValidators";

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@hostelhub.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@1234";

const JWT_SECRET  = process.env.JWT_SECRET  as string;
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";

interface TokenPayload {
  userId: string;
  subId:  string;
  role:   string;
}

export interface AuthResult {
  token: string;
  user:  Record<string, unknown>;
}

export class AuthService {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseManager.getInstance().client;
  }

  private signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES } as jwt.SignOptions);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Login with email and password
   */
  async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.db.user.findUnique({ where: { email: input.email } });
    if (!user) throw new Error("User not found");

    const isPasswordValid = await this.comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) throw new Error("Invalid password");

    const token = this.signToken({
      userId: user.id,
      subId: user.id,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  async studentSignup(input: StudentSignupInput): Promise<AuthResult> {
    const existingEmail = await this.db.user.findUnique({ where: { email: input.email } });
    if (existingEmail) throw new Error("Email already registered.");

    const existingEnrollment = await this.db.student.findUnique({
      where: { enrollmentNumber: input.enrollmentNumber },
    });
    if (existingEnrollment) throw new Error("Enrollment number already exists.");

    const passwordHash = await this.hashPassword(input.password);
    const userId    = uuidv4();
    const studentId = uuidv4();

    await this.db.$transaction([
      this.db.user.create({
        data: {
          id: userId,
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: "STUDENT",
        },
      }),
      this.db.student.create({
        data: {
          id: studentId,
          userId,
          enrollmentNumber: input.enrollmentNumber,
          course: input.course,
          year: input.year,
          parentName: input.parentName,
          parentPhone: input.parentPhone,
          address: input.address,
        },
      }),
    ]);
    const studentObj = new Student({
      id: studentId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      enrollmentNumber: input.enrollmentNumber,
      course: input.course,
      year: input.year,
      parentName: input.parentName,
      parentPhone: input.parentPhone,
      address: input.address,
    });
    const token = this.signToken({ userId, subId: studentId, role: Role.STUDENT });

    return {
      token,
      user: {
        ...studentObj.getProfileSummary(),
        permissions: studentObj.getPermissions(),
      },
    };
  }

  /**
   * Admin Signup
   * Creates a new admin user with Admin table entry
   */
  async adminSignup(input: AdminSignupInput): Promise<AuthResult> {
    // Check if email already exists
    const existingEmail = await this.db.user.findUnique({
      where: { email: input.email },
    });
    if (existingEmail) throw new Error("Email already registered.");

    // Hash password
    const passwordHash = await this.hashPassword(input.password);
    const userId = uuidv4();
    const adminId = uuidv4();

    // Create user and admin in transaction
    await this.db.$transaction([
      this.db.user.create({
        data: {
          id: userId,
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: "ADMIN",
          isActive: true,
        },
      }),
      this.db.admin.create({
        data: {
          id: adminId,
          userId,
          adminLevel: 1, // Default to Warden level
        },
      }),
    ]);

    // Create Admin object from domain model
    const adminObj = new Admin({
      id: adminId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
    });

    // Sign JWT token
    const token = this.signToken({
      userId,
      subId: adminId,
      role: Role.ADMIN,
    });

    return {
      token,
      user: {
        ...adminObj.getProfileSummary(),
        permissions: adminObj.getPermissions(),
      },
    };
  }

  async staffSignup(input: StaffSignupInput): Promise<AuthResult> {
    const existingEmail = await this.db.user.findUnique({ where: { email: input.email } });
    if (existingEmail) throw new Error("Email already registered.");

    const existingEmp = await this.db.staff.findUnique({
      where: { employeeId: input.employeeId },
    });
    if (existingEmp) throw new Error("Employee ID already exists.");
    const passwordHash = await this.hashPassword(input.password);

    const userId  = uuidv4();
    const staffId = uuidv4();

    await this.db.$transaction([
      this.db.user.create({
        data: {
          id: userId,
          email: input.email,
          passwordHash,
          firstName: input.firstName,
          lastName: input.lastName,
          phone: input.phone,
          role: "STAFF",
        },
      }),
      this.db.staff.create({
        data: {
          id: staffId,
          userId,
          employeeId: input.employeeId,
          designation: input.designation,
          department: input.department,
        },
      }),
    ]);

    const staffObj = new Staff({
      id: staffId,
      email: input.email,
      passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone,
      employeeId: input.employeeId,
      designation: input.designation,
      department: input.department,
    });

    const token = this.signToken({ userId, subId: staffId, role: Role.STAFF });

    return {
      token,
      user: {
        ...staffObj.getProfileSummary(),
        permissions: staffObj.getPermissions(),
      },
    };
  }

  async studentLogin(input: LoginInput): Promise<AuthResult> {
    const userRecord = await this.db.user.findUnique({
      where: { email: input.email },
      include: { student: true },
    });

    if (!userRecord || userRecord.role !== "STUDENT" || !userRecord.student) {
      throw new Error("Invalid email or password.");
    }

    if (!userRecord.isActive) throw new Error("Account is deactivated. Contact admin.");

    const valid = await this.comparePassword(input.password, userRecord.passwordHash);
    if (!valid) throw new Error("Invalid email or password.");

    const studentObj = new Student({
      id: userRecord.student.id,
      email: userRecord.email,
      passwordHash: userRecord.passwordHash,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      phone: userRecord.phone ?? undefined,
      enrollmentNumber: userRecord.student.enrollmentNumber,
      course: userRecord.student.course,
      year: userRecord.student.year,
      parentName: userRecord.student.parentName ?? undefined,
      parentPhone: userRecord.student.parentPhone ?? undefined,
      address: userRecord.student.address ?? undefined,
      joiningDate: userRecord.student.joiningDate,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    });

    const token = this.signToken({
      userId: userRecord.id,
      subId: userRecord.student.id,
      role: Role.STUDENT,
    });

    return {
      token,
      user: {
        ...studentObj.getProfileSummary(),
        permissions: studentObj.getPermissions(),
      },
    };
  }

  async staffLogin(input: LoginInput): Promise<AuthResult> {
    const userRecord = await this.db.user.findUnique({
      where: { email: input.email },
      include: { staff: true },
    });

    if (!userRecord || userRecord.role !== "STAFF" || !userRecord.staff) {
      throw new Error("Invalid email or password.");
    }

    if (!userRecord.isActive) throw new Error("Account is deactivated. Contact admin.");

    const valid = await this.comparePassword(input.password, userRecord.passwordHash);
    if (!valid) throw new Error("Invalid email or password.");

    const staffObj = new Staff({
      id: userRecord.staff.id,
      email: userRecord.email,
      passwordHash: userRecord.passwordHash,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      phone: userRecord.phone ?? undefined,
      employeeId: userRecord.staff.employeeId,
      designation: userRecord.staff.designation,
      department: userRecord.staff.department ?? undefined,
      joiningDate: userRecord.staff.joiningDate,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    });

    const token = this.signToken({
      userId: userRecord.id,
      subId: userRecord.staff.id,
      role: Role.STAFF,
    });

    return {
      token,
      user: {
        ...staffObj.getProfileSummary(),
        permissions: staffObj.getPermissions(),
      },
    };
  }

  async adminLogin(input: LoginInput): Promise<AuthResult> {
    if (input.email !== ADMIN_EMAIL) throw new Error("Invalid admin credentials.");
    if (input.password !== ADMIN_PASSWORD) throw new Error("Invalid admin credentials.");

    let userRecord = await this.db.user.findUnique({
      where: { email: ADMIN_EMAIL },
      include: { admin: true },
    });

    if (!userRecord) {
      const passwordHash = await this.hashPassword(ADMIN_PASSWORD);
      const userId  = uuidv4();
      const adminId = uuidv4();

      await this.db.$transaction([
        this.db.user.create({
          data: {
            id: userId,
            email: ADMIN_EMAIL,
            passwordHash,
            firstName: "Hostel",
            lastName: "Admin",
            role: "ADMIN",
          },
        }),
        this.db.admin.create({
          data: {
            id: adminId,
            userId,
            adminLevel: 2,
          },
        }),
      ]);

      userRecord = await this.db.user.findUnique({
        where: { email: ADMIN_EMAIL },
        include: { admin: true },
      });
    }

    const adminObj = new Admin({
      id: userRecord!.admin!.id,
      email: userRecord!.email,
      passwordHash: userRecord!.passwordHash,
      firstName: userRecord!.firstName,
      lastName: userRecord!.lastName,
      adminLevel: userRecord!.admin!.adminLevel,
    });

    const token = this.signToken({
      userId: userRecord!.id,
      subId: userRecord!.admin!.id,
      role: Role.ADMIN,
    });

    return {
      token,
      user: {
        ...adminObj.getProfileSummary(),
        permissions: adminObj.getPermissions(),
      },
    };
  }

  async getMe(userId: string, role: string): Promise<Record<string, unknown>> {
    const userRecord = await this.db.user.findUnique({
      where: { id: userId },
      include: { student: true, staff: true, admin: true },
    });

    if (!userRecord) throw new Error("User not found.");

    if (role === "STUDENT" && userRecord.student) {
      const obj = new Student({
        id: userRecord.student.id,
        email: userRecord.email,
        passwordHash: userRecord.passwordHash,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        phone: userRecord.phone ?? undefined,
        enrollmentNumber: userRecord.student.enrollmentNumber,
        course: userRecord.student.course,
        year: userRecord.student.year,
      });
      return { ...obj.getProfileSummary(), permissions: obj.getPermissions() };
    }

    if (role === "STAFF" && userRecord.staff) {
      const obj = new Staff({
        id: userRecord.staff.id,
        email: userRecord.email,
        passwordHash: userRecord.passwordHash,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        employeeId: userRecord.staff.employeeId,
        designation: userRecord.staff.designation,
      });
      return { ...obj.getProfileSummary(), permissions: obj.getPermissions() };
    }

    if (role === "ADMIN" && userRecord.admin) {
      const obj = new Admin({
        id: userRecord.admin.id,
        email: userRecord.email,
        passwordHash: userRecord.passwordHash,
        firstName: userRecord.firstName,
        lastName: userRecord.lastName,
        adminLevel: userRecord.admin.adminLevel,
      });
      return { ...obj.getProfileSummary(), permissions: obj.getPermissions() };
    }

    throw new Error("User record inconsistent.");
  }
}