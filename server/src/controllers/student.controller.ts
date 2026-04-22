import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { updateStudentSchema } from "../validators/domainValidators";

const { student: service } = ServiceRegistry.getInstance();

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await service.getProfile(req.user!.subId);
    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(404).json({ success: false, message: err.message });
  }
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  const parsed = updateStudentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const updated = await service.update(req.user!.subId, parsed.data);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
