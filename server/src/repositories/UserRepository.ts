import { PrismaClient } from "@prisma/client";
import { User, Role } from "../classes/User";
import { Student } from "../classes/Student";
import { Admin } from "../classes/Admin";
import { DatabaseManager } from "../interfaces/IServices";

/**
 * Design Pattern: Repository Pattern
 * Abstracts data persistence and retrieval
 * Isolates domain logic from data access logic
 *
 * Uses Prisma ORM for database operations
 */

export class UserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseManager.getInstance().client;
  }

  /**
   * Save user to database
   *
   * @param user - User entity to save
   * @returns Saved user
   */
  async save(user: User): Promise<User> {
    const userRecord = await this.db.user.upsert({
      where: { id: user.id },
      update: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
      create: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        passwordHash: "", // Will be set separately
      },
    });
    return this.mapToEntity(userRecord);
  }

  /**
   * Find user by ID
   *
   * @param id - User ID
   * @returns User entity or null
   */
  async findById(id: string): Promise<User | null> {
    const userRecord = await this.db.user.findUnique({
      where: { id },
    });
    return userRecord ? this.mapToEntity(userRecord) : null;
  }

  /**
   * Find user by email
   *
   * @param email - User email
   * @returns User entity or null
   */
  async findByEmail(email: string): Promise<User | null> {
    const userRecord = await this.db.user.findUnique({
      where: { email },
    });
    return userRecord ? this.mapToEntity(userRecord) : null;
  }

  /**
   * Find all users
   *
   * @returns Array of users
   */
  async findAll(): Promise<User[]> {
    const userRecords = await this.db.user.findMany();
    return userRecords.map((record) => this.mapToEntity(record));
  }

  /**
   * Find users by role
   *
   * @param role - User role (STUDENT, ADMIN, STAFF)
   * @returns Array of users with given role
   */
  async findByRole(role: Role): Promise<User[]> {
    const userRecords = await this.db.user.findMany({
      where: { role },
    });
    return userRecords.map((record) => this.mapToEntity(record));
  }

  /**
   * Update user
   *
   * @param id - User ID
   * @param updates - Partial user data
   * @returns Updated user
   */
  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const updated = await this.db.user.update({
      where: { id },
      data: {
        firstName: updates.firstName,
        lastName: updates.lastName,
        email: updates.email,
        phone: updates.phone,
        isActive: updates.isActive,
      },
    }).catch(() => null);
    return updated ? this.mapToEntity(updated) : null;
  }

  /**
   * Delete user
   *
   * @param id - User ID
   * @returns Success status
   */
  async delete(id: string): Promise<boolean> {
    try {
      await this.db.user.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Map database record to User entity
   * (Helper method for Prisma integration)
   *
   * @param record - Database record
   * @returns User entity (Student, Admin, or Staff)
   */
  private mapToEntity(record: any): User {
    switch (record.role) {
      case Role.STUDENT:
        return new Student({
          id: record.id,
          email: record.email,
          passwordHash: record.passwordHash,
          firstName: record.firstName,
          lastName: record.lastName,
          phone: record.phone,
          isActive: record.isActive,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          enrollmentNumber: record.enrollmentNumber,
          course: record.course,
          year: record.year,
          parentName: record.parentName,
          parentPhone: record.parentPhone,
          address: record.address,
          joiningDate: record.joiningDate,
        });

      case Role.ADMIN:
        return new Admin({
          id: record.id,
          email: record.email,
          passwordHash: record.passwordHash,
          firstName: record.firstName,
          lastName: record.lastName,
          phone: record.phone,
          isActive: record.isActive,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
          adminLevel: record.adminLevel,
        });

      default:
        throw new Error(`Unknown user role: ${record.role}`);
    }
  }
}
