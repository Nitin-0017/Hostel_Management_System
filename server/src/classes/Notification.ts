export enum NotificationType {
  FEE_REMINDER = "FEE_REMINDER",
  ROOM_ALLOCATION = "ROOM_ALLOCATION",
  LEAVE_UPDATE = "LEAVE_UPDATE",
  COMPLAINT_UPDATE = "COMPLAINT_UPDATE",
  GENERAL = "GENERAL",
  CLEANING_ASSIGNED = "CLEANING_ASSIGNED",
}
 
export class Notification {
  private _id: string;
  private _userId: string;
  private _sentById?: string;
  private _type: NotificationType;
  private _title: string;
  private _message: string;
  private _isRead: boolean;
  private _readAt?: Date;
  private _createdAt: Date;
 
  constructor(data: {
    id: string;
    userId: string;
    sentById?: string;
    type: NotificationType;
    title: string;
    message: string;
    isRead?: boolean;
    readAt?: Date;
    createdAt?: Date;
  }) {
    this._id = data.id;
    this._userId = data.userId;
    this._sentById = data.sentById;
    this._type = data.type;
    this._title = data.title;
    this._message = data.message;
    this._isRead = data.isRead ?? false;
    this._readAt = data.readAt;
    this._createdAt = data.createdAt ?? new Date();
  }
 
  get id() { return this._id; }
  get userId() { return this._userId; }
  get sentById() { return this._sentById; }
  get type() { return this._type; }
  get title() { return this._title; }
  get message() { return this._message; }
  get isRead() { return this._isRead; }
  get readAt() { return this._readAt; }
  get createdAt() { return this._createdAt; }
 
  markRead(): void {
    if (!this._isRead) {
      this._isRead = true;
      this._readAt = new Date();
    }
  }
 
  toJSON() {
    return {
      id: this._id, userId: this._userId, sentById: this._sentById,
      type: this._type, title: this._title, message: this._message,
      isRead: this._isRead, readAt: this._readAt, createdAt: this._createdAt,
    };
  }
}
