import { DatabaseManager } from "../interfaces/IServices";

const db = DatabaseManager.getInstance().client;

export class StaffService {
  async getAssignedRooms(staffId: string) {
    return db.staffRoomAssignment.findMany({
      where: { staffId, isActive: true },
      include: { room: true },
    });
  }
}
