import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";
import { Room, RoomType, RoomStatus } from "../classes/Room";

const db = DatabaseManager.getInstance().client;

function toRoom(row: any): Room {
  return new Room({
    id: row.id,
    roomNumber: row.roomNumber,
    floor: row.floor,
    building: row.building ?? undefined,
    type: row.type as RoomType,
    capacity: row.capacity,
    occupied: row.occupied,
    status: row.status as RoomStatus,
    amenities: row.amenities ? JSON.parse(row.amenities) : [],
    monthlyFee: Number(row.monthlyFee),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  });
}

export class RoomService {
  async create(data: any): Promise<Room> {
    const row = await db.room.create({ data });
    return toRoom(row);
  }

  async getAll(options: PaginationOptions = {}): Promise<PaginatedResult<Room>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.room.findMany({ skip, take: pageSize, orderBy: { roomNumber: "asc" } }),
      db.room.count(),
    ]);
    return { data: rows.map(toRoom), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getById(id: string): Promise<Room | null> {
    const row = await db.room.findUnique({ where: { id } });
    return row ? toRoom(row) : null;
  }

  async update(id: string, data: any): Promise<Room> {
    const row = await db.room.findUnique({ where: { id } });
    if (!row) throw new Error("Room not found.");
    const updated = await db.room.update({ where: { id }, data });
    return toRoom(updated);
  }

  async remove(id: string): Promise<void> {
    const row = await db.room.findUnique({ where: { id } });
    if (!row) throw new Error("Room not found.");
    const active = await db.roomAllocation.count({ where: { roomId: id, status: "ACTIVE" } });
    if (active > 0) throw new Error("Cannot delete room with active allocations.");
    await db.room.delete({ where: { id } });
  }

  async getAvailable(): Promise<Room[]> {
    const rows = await db.room.findMany({ where: { status: "AVAILABLE" } });
    return rows.map(toRoom);
  }

  async allocate(studentId: string, roomId: string): Promise<any> {
    const row = await db.room.findUnique({ where: { id: roomId } });
    if (!row) throw new Error("Room not found.");
    const room = toRoom(row);
    room.allocate(); // throws if not available

    const existing = await db.roomAllocation.findFirst({ where: { studentId, status: "ACTIVE" } });
    if (existing) throw new Error("Student already has an active room allocation.");

    const [allocation] = await db.$transaction([
      db.roomAllocation.create({ data: { studentId, roomId, status: "ACTIVE" } }),
      db.room.update({ where: { id: roomId }, data: { occupied: room.occupied, status: room.status } }),
    ]);
    return allocation;
  }

  async deallocate(studentId: string, roomId: string): Promise<void> {
    const allocation = await db.roomAllocation.findFirst({ where: { studentId, roomId, status: "ACTIVE" } });
    if (!allocation) throw new Error("No active allocation found.");

    const row = await db.room.findUnique({ where: { id: roomId } });
    if (!row) throw new Error("Room not found.");
    const room = toRoom(row);
    room.deallocate(); // throws if no occupants

    await db.$transaction([
      db.roomAllocation.update({ where: { id: allocation.id }, data: { status: "VACATED", vacatedAt: new Date() } }),
      db.room.update({ where: { id: roomId }, data: { occupied: room.occupied, status: room.status } }),
    ]);
  }

  async getStudentRoom(studentId: string): Promise<any> {
    return db.roomAllocation.findFirst({
      where: { studentId, status: "ACTIVE" },
      include: { room: true },
    });
  }
}
