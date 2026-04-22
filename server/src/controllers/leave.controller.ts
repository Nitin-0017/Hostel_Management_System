import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { applyLeaveSchema, reviewLeaveSchema } from "../validators/domainValidators";

const { leave: service } = ServiceRegistry.getInstance();

export const applyLeave = async (req: Request, res: Response): Promise<void> => {
  const parsed = applyLeaveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const leave = await service.apply(req.user!.subId, {
      fromDate: new Date(parsed.data.fromDate),
      toDate: new Date(parsed.data.toDate),
      reason: parsed.data.reason,
    });
    res.status(201).json({ success: true, data: leave.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyLeaves = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await service.getByStudent(req.user!.subId, { page, pageSize });
  res.json({ success: true, ...result, data: result.data.map(l => l.toJSON()) });
};

export const cancelLeave = async (req: Request, res: Response): Promise<void> => {
  try {
    const leave = await service.cancel(req.params.id as string, req.user!.subId);
    res.json({ success: true, data: leave.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getAllLeaves = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await service.getAll({ page, pageSize });
  res.json({ success: true, ...result });
};

export const approveLeave = async (req: Request, res: Response): Promise<void> => {
  const parsed = reviewLeaveSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const leave = await service.approve(req.params.id as string, req.user!.subId, parsed.data.adminRemarks);
    res.json({ success: true, data: leave.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rejectLeave = async (req: Request, res: Response): Promise<void> => {
  const { adminRemarks } = req.body;
  if (!adminRemarks) {
    res.status(422).json({ success: false, message: "adminRemarks is required for rejection." });
    return;
  }
  try {
    const leave = await service.reject(req.params.id as string, req.user!.subId, adminRemarks);
    res.json({ success: true, data: leave.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
