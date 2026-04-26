import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { updateStudentSchema } from "../validators/domainValidators";

const registry = ServiceRegistry.getInstance();

export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await registry.student.getAll({ page, pageSize });
  res.json({ success: true, ...result });
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  const student = await registry.student.getById(req.params.id as string);
  if (!student) { res.status(404).json({ success: false, message: "Student not found." }); return; }
  res.json({ success: true, data: student });
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  const parsed = updateStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const student = await registry.student.update(req.params.id as string, parsed.data);
    res.json({ success: true, data: student });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const removeStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    await registry.student.remove(req.params.id as string);
    res.json({ success: true, message: "Student removed." });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const generateOccupancyReport = async (req: Request, res: Response): Promise<void> => {
  const report = await registry.report.generateOccupancy(req.user!.subId);
  res.json({ success: true, data: report });
};

export const generateComplaintReport = async (req: Request, res: Response): Promise<void> => {
  const report = await registry.report.generateComplaint(req.user!.subId);
  res.json({ success: true, data: report });
};

export const generateLeaveReport = async (req: Request, res: Response): Promise<void> => {
  const report = await registry.report.generateLeave(req.user!.subId);
  res.json({ success: true, data: report });
};

export const getReports = async (req: Request, res: Response): Promise<void> => {
  const reports = await registry.report.getAll(req.user!.subId);
  res.json({ success: true, data: reports });
};

export const getAllStaff = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 10;
  const result = await registry.staff.getAll({ page, pageSize });
  res.json({ success: true, ...result });
};
