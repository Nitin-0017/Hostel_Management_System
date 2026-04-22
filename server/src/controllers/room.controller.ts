import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { createRoomSchema, updateRoomSchema, allocateRoomSchema } from "../validators/domainValidators";

const { room: service } = ServiceRegistry.getInstance();

export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const parsed = createRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const room = await service.create(parsed.data);
    res.status(201).json({ success: true, data: room.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await service.getAll({ page, pageSize });
  res.json({ success: true, ...result, data: result.data.map(r => r.toJSON()) });
};

export const getRoomById = async (req: Request, res: Response): Promise<void> => {
  const room = await service.getById(req.params.id as string);
  if (!room) { res.status(404).json({ success: false, message: "Room not found." }); return; }
  res.json({ success: true, data: room.toJSON() });
};

export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  const parsed = updateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const room = await service.update(req.params.id as string, parsed.data);
    res.json({ success: true, data: room.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    await service.remove(req.params.id as string);
    res.json({ success: true, message: "Room deleted." });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAvailableRooms = async (_req: Request, res: Response): Promise<void> => {
  const rooms = await service.getAvailable();
  res.json({ success: true, data: rooms.map(r => r.toJSON()) });
};

export const allocateRoom = async (req: Request, res: Response): Promise<void> => {
  const parsed = allocateRoomSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const allocation = await service.allocate(parsed.data.studentId, parsed.data.roomId);
    res.status(201).json({ success: true, data: allocation });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const deallocateRoom = async (req: Request, res: Response): Promise<void> => {
  const { studentId, roomId } = req.body;
  if (!studentId || !roomId) {
    res.status(422).json({ success: false, message: "studentId and roomId are required." });
    return;
  }
  try {
    await service.deallocate(studentId, roomId);
    res.json({ success: true, message: "Room deallocated." });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyRoom = async (req: Request, res: Response): Promise<void> => {
  const allocation = await service.getStudentRoom(req.user!.subId);
  if (!allocation) { res.status(404).json({ success: false, message: "No active room allocation." }); return; }
  res.json({ success: true, data: allocation });
};
