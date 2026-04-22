import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { requestCleaningSchema, assignCleaningSchema, updateCleaningStatusSchema } from "../validators/domainValidators";

const registry = ServiceRegistry.getInstance();

export const requestCleaning = async (req: Request, res: Response): Promise<void> => {
  const parsed = requestCleaningSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const allocation = await registry.room.getStudentRoom(req.user!.subId);
    if (!allocation) { res.status(400).json({ success: false, message: "No active room allocation." }); return; }
    const request = await registry.cleaning.request(req.user!.subId, allocation.roomId as string, parsed.data.notes);
    res.status(201).json({ success: true, data: request.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyCleaning = async (req: Request, res: Response): Promise<void> => {
  const data = await registry.cleaning.getByStudent(req.user!.subId);
  res.json({ success: true, data: data.map(c => c.toJSON()) });
};

export const getStaffCleaning = async (req: Request, res: Response): Promise<void> => {
  const data = await registry.cleaning.getByStaff(req.user!.subId);
  res.json({ success: true, data });
};

export const updateCleaningStatus = async (req: Request, res: Response): Promise<void> => {
  const parsed = updateCleaningStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const result = await registry.cleaning.updateStatus(req.params.id as string, req.user!.subId, parsed.data.status, parsed.data.note);
    res.json({ success: true, data: result?.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllCleaning = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await registry.cleaning.getAll({ page, pageSize });
  res.json({ success: true, ...result });
};

export const assignCleaning = async (req: Request, res: Response): Promise<void> => {
  const parsed = assignCleaningSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const result = await registry.cleaning.assignStaff(
      req.params.id as string,
      parsed.data.staffId,
      parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
    );
    res.json({ success: true, data: result.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
