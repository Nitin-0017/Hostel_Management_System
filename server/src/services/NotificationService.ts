import { DatabaseManager, PaginatedResult, PaginationOptions } from "../interfaces/IServices";
import { Notification, NotificationType } from "../classes/Notification";

const db = DatabaseManager.getInstance().client;

function toNotification(row: any): Notification {
  return new Notification({
    id: row.id,
    userId: row.userId,
    sentById: row.sentById ?? undefined,
    type: row.type as NotificationType,
    title: row.title,
    message: row.message,
    isRead: row.isRead,
    readAt: row.readAt ?? undefined,
    createdAt: row.createdAt,
  });
}

export class NotificationService {
  async send(userId: string, type: string, title: string, message: string, sentById?: string): Promise<Notification> {
    const row = await db.notification.create({ data: { userId, type: type as any, title, message, sentById } });
    return toNotification(row);
  }

  async broadcast(userIds: string[], type: string, title: string, message: string, sentById?: string): Promise<{ sent: number }> {
    await db.notification.createMany({
      data: userIds.map(userId => ({ userId, type: type as any, title, message, sentById })),
    });
    return { sent: userIds.length };
  }

  async broadcastAll(type: string, title: string, message: string, sentById?: string): Promise<{ sent: number }> {
    const users = await db.user.findMany({ where: { isActive: true }, select: { id: true } });
    return this.broadcast(users.map(u => u.id), type, title, message, sentById);
  }

  async getByUser(userId: string, options: PaginationOptions = {}): Promise<PaginatedResult<Notification>> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const [rows, total] = await Promise.all([
      db.notification.findMany({ where: { userId }, skip, take: pageSize, orderBy: { createdAt: "desc" } }),
      db.notification.count({ where: { userId } }),
    ]);
    return { data: rows.map(toNotification), total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async markRead(id: string, userId: string): Promise<void> {
    const row = await db.notification.findUnique({ where: { id } });
    if (!row || row.userId !== userId) throw new Error("Notification not found.");
    const notif = toNotification(row);
    notif.markRead();
    await db.notification.update({ where: { id }, data: { isRead: notif.isRead, readAt: notif.readAt } });
  }

  async markAllRead(userId: string): Promise<void> {
    await db.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
  }
}
