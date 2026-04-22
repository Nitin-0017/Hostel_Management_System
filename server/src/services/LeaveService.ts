import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";
import { LeaveRequest, LeaveStatus } from "../classes/LeaveRequest";

const db = DatabaseManager.getInstance().client;

function toLeave(row: any): LeaveRequest {
  return new LeaveRequest({
    id: row.id,
    studentId: row.studentId,
    approvedById: row.approvedById ?? undefined,
    fromDate: row.fromDate,
    toDate: row.toDate,
    reason: row.reason,
    status: row.status as LeaveStatus,
    reviewedAt: row.reviewedAt ?? undefined,
    adminRemarks: row.adminRemarks ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class LeaveService {
  async apply(studentId: string, data: { fromDate: Date; toDate: Date; reason: string }): Promise<LeaveRequest> {
    const row = await db.leaveRequest.create({ data: { studentId, ...data } });
    return toLeave(row);
  }

  async getById(id: string): Promise<LeaveRequest | null> {
    const row = await db.leaveRequest.findUnique({ where: { id }, include: { student: { include: { user: true } } } });
    return row ? toLeave(row) : null;
  }

  async getByStudent(studentId: string, options: PaginationOptions = {}): Promise<PaginatedResult<LeaveRequest>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.leaveRequest.findMany({ where: { studentId }, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      db.leaveRequest.count({ where: { studentId } }),
    ]);
    return { data: rows.map(toLeave), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.leaveRequest.findMany({ skip, take: pageSize, include: { student: { include: { user: true } } }, orderBy: { createdAt: "desc" } }),
      db.leaveRequest.count(),
    ]);
    return { data: rows.map(r => ({ ...toLeave(r).toJSON(), student: (r as any).student })), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async approve(id: string, adminId: string, adminRemarks?: string): Promise<LeaveRequest> {
    const row = await db.leaveRequest.findUnique({ where: { id } });
    if (!row) throw new Error("Leave request not found.");
    const leave = toLeave(row);
    leave.approve(adminId, adminRemarks);
    const updated = await db.leaveRequest.update({
      where: { id },
      data: { status: leave.status, approvedById: leave.approvedById, reviewedAt: leave.reviewedAt, adminRemarks: leave.adminRemarks },
    });
    return toLeave(updated);
  }

  async reject(id: string, adminId: string, adminRemarks: string): Promise<LeaveRequest> {
    const row = await db.leaveRequest.findUnique({ where: { id } });
    if (!row) throw new Error("Leave request not found.");
    const leave = toLeave(row);
    leave.reject(adminId, adminRemarks);
    const updated = await db.leaveRequest.update({
      where: { id },
      data: { status: leave.status, approvedById: leave.approvedById, reviewedAt: leave.reviewedAt, adminRemarks: leave.adminRemarks },
    });
    return toLeave(updated);
  }

  async cancel(id: string, studentId: string): Promise<LeaveRequest> {
    const row = await db.leaveRequest.findUnique({ where: { id } });
    if (!row) throw new Error("Leave request not found.");
    if (row.studentId !== studentId) throw new Error("Unauthorized.");
    const leave = toLeave(row);
    leave.cancel();
    const updated = await db.leaveRequest.update({ where: { id }, data: { status: leave.status } });
    return toLeave(updated);
  }
}
