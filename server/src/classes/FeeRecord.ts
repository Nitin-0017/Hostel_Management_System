export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  WAIVED = "WAIVED",
}
 
export enum PaymentMethod {
  ONLINE = "ONLINE",
  CASH = "CASH",
  BANK_TRANSFER = "BANK_TRANSFER",
  UPI = "UPI",
}
 
export class FeeRecord {
  private _id: string;
  private _studentId: string;
  private _amount: number;
  private _month: number;
  private _year: number;
  private _dueDate: Date;
  private _paidAt?: Date;
  private _status: FeeStatus;
  private _paymentMethod?: PaymentMethod;
  private _transactionId?: string;
  private _remarks?: string;
  private _createdAt: Date;
  private _updatedAt: Date;
 
  constructor(data: {
    id: string;
    studentId: string;
    amount: number;
    month: number;
    year: number;
    dueDate: Date;
    paidAt?: Date;
    status?: FeeStatus;
    paymentMethod?: PaymentMethod;
    transactionId?: string;
    remarks?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data.id;
    this._studentId = data.studentId;
    this._amount = data.amount;
    this._month = data.month;
    this._year = data.year;
    this._dueDate = data.dueDate;
    this._paidAt = data.paidAt;
    this._status = data.status ?? FeeStatus.PENDING;
    this._paymentMethod = data.paymentMethod;
    this._transactionId = data.transactionId;
    this._remarks = data.remarks;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }
 
  get id() { return this._id; }
  get studentId() { return this._studentId; }
  get amount() { return this._amount; }
  get month() { return this._month; }
  get year() { return this._year; }
  get dueDate() { return this._dueDate; }
  get paidAt() { return this._paidAt; }
  get status() { return this._status; }
  get paymentMethod() { return this._paymentMethod; }
  get transactionId() { return this._transactionId; }
  get remarks() { return this._remarks; }
  get isOverdue(): boolean { return this._status === FeeStatus.PENDING && new Date() > this._dueDate; }
  get createdAt() { return this._createdAt; }
  get updatedAt() { return this._updatedAt; }
 
  // Strategy Pattern hook — called by PaymentProcessor
  markPaid(method: PaymentMethod, transactionId?: string): void {
    if (this._status === FeeStatus.PAID) throw new Error("Fee already paid.");
    this._status = FeeStatus.PAID;
    this._paymentMethod = method;
    this._transactionId = transactionId;
    this._paidAt = new Date();
    this._updatedAt = new Date();
  }
 
  markOverdue(): void {
    if (this._status === FeeStatus.PENDING && new Date() > this._dueDate) {
      this._status = FeeStatus.OVERDUE;
      this._updatedAt = new Date();
    }
  }
 
  waive(remarks: string): void {
    this._status = FeeStatus.WAIVED;
    this._remarks = remarks;
    this._updatedAt = new Date();
  }
 
  toJSON() {
    return {
      id: this._id, studentId: this._studentId, amount: this._amount,
      month: this._month, year: this._year, dueDate: this._dueDate,
      paidAt: this._paidAt, status: this._status, paymentMethod: this._paymentMethod,
      transactionId: this._transactionId, isOverdue: this.isOverdue,
      createdAt: this._createdAt, updatedAt: this._updatedAt,
    };
  }
}
 
