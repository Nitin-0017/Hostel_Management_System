import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { submitComplaintSchema, resolveComplaintSchema } from "../validators/domainValidators";

const { complaint: service } = ServiceRegistry.getInstance();

export const submitComplaint = async (req: Request, res: Response): Promise<void> => {
  const parsed = submitComplaintSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const complaint = await service.submit(req.user!.subId, parsed.data);
    res.status(201).json({ success: true, data: complaint.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const getMyComplaints = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await service.getByStudent(req.user!.subId, { page, pageSize });
  res.json({ success: true, ...result, data: result.data.map(c => c.toJSON()) });
};

export const getAllComplaints = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await service.getAll({ page, pageSize });
  res.json({ success: true, ...result });
};

export const getComplaintById = async (req: Request, res: Response): Promise<void> => {
  const complaint = await service.getById(req.params.id as string);
  if (!complaint) { res.status(404).json({ success: false, message: "Complaint not found." }); return; }
  res.json({ success: true, data: complaint.toJSON() });
};

export const resolveComplaint = async (req: Request, res: Response): Promise<void> => {
  const parsed = resolveComplaintSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const complaint = await service.resolve(req.params.id as string, req.user!.subId, parsed.data.resolutionNote);
    res.json({ success: true, data: complaint.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const rejectComplaint = async (req: Request, res: Response): Promise<void> => {
  const parsed = resolveComplaintSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const complaint = await service.reject(req.params.id as string, req.user!.subId, parsed.data.resolutionNote);
    res.json({ success: true, data: complaint.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const markComplaintInProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const complaint = await service.markInProgress(req.params.id as string);
    res.json({ success: true, data: complaint.toJSON() });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
