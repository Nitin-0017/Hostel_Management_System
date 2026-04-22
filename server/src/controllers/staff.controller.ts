import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";

const { staff: service } = ServiceRegistry.getInstance();

export const getAssignedRooms = async (req: Request, res: Response): Promise<void> => {
  const assignments = await service.getAssignedRooms(req.user!.subId);
  res.json({ success: true, data: assignments });
};
