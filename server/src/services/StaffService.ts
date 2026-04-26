import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";

const db = DatabaseManager.getInstance().client;

const userSelect = {
  id: true, email: true, firstName: true, lastName: true, phone: true, isActive: true, createdAt: true, updatedAt: true,
};

export class StaffService {
  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<any>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      db.staff.findMany({
        skip,
        take: pageSize,
        include: { user: { select: userSelect } },
        orderBy: { createdAt: "desc" },
      }),
      db.staff.count(),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getAssignedRooms(staffId: string) {
    return db.staffRoomAssignment.findMany({
      where: { staffId, isActive: true },
      include: { room: true },
    });
  }
}
