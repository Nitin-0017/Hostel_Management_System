import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";
import { Complaint, ComplaintCategory, ComplaintStatus } from "../classes/Complaint";

const db = DatabaseManager.getInstance().client;

function toComplaint(row: any): Complaint {
  return new Complaint({
    id: row.id,
    studentId: row.studentId,
    resolvedById: row.resolvedById ?? undefined,
    category: row.category as ComplaintCategory,
    subject: row.subject,
    description: row.description,
    status: row.status as ComplaintStatus,
    resolvedAt: row.resolvedAt ?? undefined,
    resolutionNote: row.resolutionNote ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class ComplaintService {
  async submit(studentId: string, data: { category: string; subject: string; description: string }): Promise<Complaint> {
    const row = await db.complaint.create({ data: { studentId, ...data } as any });
    return toComplaint(row);
  }

  async getById(id: string): Promise<Complaint | null> {
    const row = await db.complaint.findUnique({ where: { id }, include: { student: { include: { user: true } } } });
    return row ? toComplaint(row) : null;
  }

  async getByStudent(studentId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Complaint>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.complaint.findMany({ where: { studentId }, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      db.complaint.count({ where: { studentId } }),
    ]);
    return { data: rows.map(toComplaint), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.complaint.findMany({ skip, take: pageSize, include: { student: { include: { user: true } } }, orderBy: { createdAt: "desc" } }),
      db.complaint.count(),
    ]);
    return { data: rows.map(r => ({ ...toComplaint(r).toJSON(), student: (r as any).student })), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async resolve(id: string, adminId: string, resolutionNote: string): Promise<Complaint> {
    const row = await db.complaint.findUnique({ where: { id } });
    if (!row) throw new Error("Complaint not found.");
    const complaint = toComplaint(row);
    complaint.resolve(adminId, resolutionNote);
    const updated = await db.complaint.update({
      where: { id },
      data: { status: complaint.status, resolvedById: complaint.resolvedById, resolvedAt: complaint.resolvedAt, resolutionNote: complaint.resolutionNote },
    });
    return toComplaint(updated);
  }

  async reject(id: string, adminId: string, resolutionNote: string): Promise<Complaint> {
    const row = await db.complaint.findUnique({ where: { id } });
    if (!row) throw new Error("Complaint not found.");
    const complaint = toComplaint(row);
    complaint.reject(adminId, resolutionNote);
    const updated = await db.complaint.update({
      where: { id },
      data: { status: complaint.status, resolvedById: complaint.resolvedById, resolvedAt: complaint.resolvedAt, resolutionNote: complaint.resolutionNote },
    });
    return toComplaint(updated);
  }

  async markInProgress(id: string): Promise<Complaint> {
    const row = await db.complaint.findUnique({ where: { id } });
    if (!row) throw new Error("Complaint not found.");
    const complaint = toComplaint(row);
    complaint.markInProgress();
    const updated = await db.complaint.update({ where: { id }, data: { status: complaint.status } });
    return toComplaint(updated);
  }
}
