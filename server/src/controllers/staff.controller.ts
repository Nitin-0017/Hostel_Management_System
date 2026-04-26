import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";

const { staff: service } = ServiceRegistry.getInstance();

export const getAssignedRooms = async (req: Request, res: Response): Promise<void> => {
  const assignments = await service.getAssignedRooms(req.user!.subId);
  const rooms = assignments.map((a: any) => ({
    id: a.room.id,
    roomNumber: a.room.roomNumber,
    floor: a.room.floor,
    building: a.room.building ?? "",
    capacity: a.room.capacity,
    occupied: a.room.occupied,
    type: a.room.type,
    status: a.room.status,
    isAvailable: a.room.status === "AVAILABLE" && a.room.occupied < a.room.capacity,
  }));
  res.json({ success: true, data: rooms });
};
