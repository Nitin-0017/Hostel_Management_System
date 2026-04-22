import { PrismaClient } from "@prisma/client";
import { DatabaseManager } from "../interfaces/IServices";

const db: PrismaClient = DatabaseManager.getInstance().client;

export class ReportService {
  async generateOccupancy(adminId: string) {
    const [rooms, totalStudents] = await Promise.all([
      db.room.findMany(),
      db.student.count(),
    ]);
    const data = {
      totalRooms: rooms.length,
      totalCapacity: rooms.reduce((s, r) => s + r.capacity, 0),
      totalOccupied: rooms.reduce((s, r) => s + r.occupied, 0),
      totalStudents,
      byStatus: {
        AVAILABLE: rooms.filter(r => r.status === "AVAILABLE").length,
        OCCUPIED: rooms.filter(r => r.status === "OCCUPIED").length,
        MAINTENANCE: rooms.filter(r => r.status === "MAINTENANCE").length,
        RESERVED: rooms.filter(r => r.status === "RESERVED").length,
      },
    };
    return db.report.create({ data: { adminId, title: "Occupancy Report", type: "OCCUPANCY", data } });
  }

  async generateComplaint(adminId: string) {
    const complaints = await db.complaint.groupBy({ by: ["status"], _count: { id: true } });
    const data = {
      byStatus: Object.fromEntries(complaints.map(c => [c.status, c._count.id])),
      total: complaints.reduce((s, c) => s + c._count.id, 0),
    };
    return db.report.create({ data: { adminId, title: "Complaint Report", type: "COMPLAINT", data } });
  }

  async generateLeave(adminId: string) {
    const leaves = await db.leaveRequest.groupBy({ by: ["status"], _count: { id: true } });
    const data = {
      byStatus: Object.fromEntries(leaves.map(l => [l.status, l._count.id])),
      total: leaves.reduce((s, l) => s + l._count.id, 0),
    };
    return db.report.create({ data: { adminId, title: "Leave Report", type: "LEAVE", data } });
  }

  async getAll(adminId: string) {
    return db.report.findMany({ where: { adminId }, orderBy: { generatedAt: "desc" } });
  }
}
