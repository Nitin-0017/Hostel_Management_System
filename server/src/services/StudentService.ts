import { PrismaClient } from "@prisma/client";
import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";

const db: PrismaClient = DatabaseManager.getInstance().client;

const userSelect = {
  id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, createdAt: true, updatedAt: true,
};

export class StudentService {
  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.student.findMany({ skip, take: pageSize, include: { user: { select: userSelect } }, orderBy: { createdAt: "desc" } }),
      db.student.count(),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string) {
    return db.student.findUnique({ where: { id }, include: { user: { select: userSelect } } });
  }

  async update(id: string, data: any) {
    const { firstName, lastName, phone, ...studentData } = data;
    const student = await db.student.findUnique({ where: { id } });
    if (!student) throw new Error("Student not found.");

    if (firstName || lastName || phone !== undefined) {
      await db.user.update({ where: { id: student.userId }, data: { firstName, lastName, phone } });
    }
    return db.student.update({ where: { id }, data: studentData, include: { user: { select: userSelect } } });
  }

  async remove(id: string) {
    const student = await db.student.findUnique({ where: { id } });
    if (!student) throw new Error("Student not found.");
    await db.user.delete({ where: { id: student.userId } });
  }

  async getProfile(studentId: string) {
    const student = await db.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: userSelect },
        allocations: { where: { status: "ACTIVE" }, include: { room: true }, take: 1 },
      },
    });
    if (!student) throw new Error("Student not found.");
    return student;
  }

  async deactivate(id: string) {
    const student = await db.student.findUnique({ where: { id } });
    if (!student) throw new Error("Student not found.");
    return db.user.update({ where: { id: student.userId }, data: { isActive: false } });
  }
}
