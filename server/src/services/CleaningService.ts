import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";
import { CleaningRequest, CleaningStatus } from "../classes/CleaningRequest";

const db = DatabaseManager.getInstance().client;

function toCleaning(row: any): CleaningRequest {
  return new CleaningRequest({
    id: row.id,
    studentId: row.studentId,
    roomId: row.roomId,
    assignedStaffId: row.assignedStaffId ?? undefined,
    status: row.status as CleaningStatus,
    requestedAt: row.requestedAt,
    scheduledAt: row.scheduledAt ?? undefined,
    completedAt: row.completedAt ?? undefined,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class CleaningService {
  async request(studentId: string, roomId: string, notes?: string): Promise<CleaningRequest> {
    const row = await db.cleaningRequest.create({ data: { studentId, roomId, notes } });
    return toCleaning(row);
  }

  async getById(id: string): Promise<CleaningRequest | null> {
    const row = await db.cleaningRequest.findUnique({
      where: { id },
      include: { student: { include: { user: true } }, room: true, assignedStaff: { include: { user: true } } },
    });
    return row ? toCleaning(row) : null;
  }

  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.cleaningRequest.findMany({
        skip, take: pageSize,
        include: { student: { include: { user: true } }, room: true, assignedStaff: { include: { user: true } } },
        orderBy: { createdAt: "desc" },
      }),
      db.cleaningRequest.count(),
    ]);
    return {
      data: rows.map(r => ({ ...toCleaning(r).toJSON(), student: (r as any).student, room: (r as any).room, assignedStaff: (r as any).assignedStaff })),
      total, page, pageSize, totalPages: Math.ceil(total / pageSize),
    };
  }

  async getByStudent(studentId: string): Promise<CleaningRequest[]> {
    const rows = await db.cleaningRequest.findMany({ where: { studentId }, include: { room: true }, orderBy: { createdAt: "desc" } });
    return rows.map(toCleaning);
  }

  async getByStaff(staffId: string): Promise<any[]> {
    const rows = await db.cleaningRequest.findMany({
      where: { assignedStaffId: staffId },
      include: { room: true, student: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(r => ({ ...toCleaning(r).toJSON(), room: (r as any).room, student: (r as any).student }));
  }

  async assignStaff(requestId: string, staffId: string, scheduledAt?: Date): Promise<CleaningRequest> {
    const row = await db.cleaningRequest.findUnique({ where: { id: requestId } });
    if (!row) throw new Error("Cleaning request not found.");
    const cleaning = toCleaning(row);
    cleaning.assignStaff(staffId, scheduledAt);
    const updated = await db.cleaningRequest.update({
      where: { id: requestId },
      data: { assignedStaffId: cleaning.assignedStaffId, status: cleaning.status, scheduledAt: cleaning.scheduledAt },
    });
    return toCleaning(updated);
  }

  async updateStatus(requestId: string, staffId: string, status: "IN_PROGRESS" | "COMPLETED", note?: string): Promise<CleaningRequest> {
    const row = await db.cleaningRequest.findUnique({ where: { id: requestId } });
    if (!row) throw new Error("Cleaning request not found.");
    if (row.assignedStaffId !== staffId) throw new Error("Not assigned to this request.");
    const cleaning = toCleaning(row);

    if (status === "COMPLETED") {
      cleaning.markCompleted(note);
    } else {
      // IN_PROGRESS — already set by assignStaff, but staff can re-confirm
      (cleaning as any)["_status"] = CleaningStatus.IN_PROGRESS;
    }

    const [updated] = await db.$transaction([
      db.cleaningRequest.update({
        where: { id: requestId },
        data: { status: cleaning.status, completedAt: cleaning.completedAt ?? null },
      }),
      db.cleaningStatusLog.create({ data: { cleaningRequestId: requestId, staffId, status: cleaning.status, note } }),
    ]);
    return toCleaning(updated);
  }
}
