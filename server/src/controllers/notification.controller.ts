import { Request, Response } from "express";
import { ServiceRegistry } from "../interfaces/ServiceRegistry";
import { sendNotificationSchema } from "../validators/domainValidators";

const { notification: service } = ServiceRegistry.getInstance();

export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const result = await service.getByUser(req.user!.userId, { page, pageSize });
  res.json({ success: true, ...result, data: result.data.map(n => n.toJSON()) });
};

export const markRead = async (req: Request, res: Response): Promise<void> => {
  try {
    await service.markRead(req.params.id as string, req.user!.userId);
    res.json({ success: true, message: "Marked as read." });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const markAllRead = async (req: Request, res: Response): Promise<void> => {
  await service.markAllRead(req.user!.userId);
  res.json({ success: true, message: "All notifications marked as read." });
};

export const sendNotification = async (req: Request, res: Response): Promise<void> => {
  const parsed = sendNotificationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, errors: parsed.error.issues.map(e => e.message) });
    return;
  }
  try {
    const { userId, userIds, broadcast, type, title, message } = parsed.data;
    const sentById = req.user!.userId;

    if (broadcast) {
      const result = await service.broadcastAll(type, title, message, sentById);
      res.json({ success: true, data: result });
    } else if (userIds && userIds.length > 0) {
      const result = await service.broadcast(userIds, type, title, message, sentById);
      res.json({ success: true, data: result });
    } else if (userId) {
      const notif = await service.send(userId, type, title, message, sentById);
      res.json({ success: true, data: notif.toJSON() });
    } else {
      res.status(422).json({ success: false, message: "Provide userId, userIds, or broadcast:true." });
    }
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};
