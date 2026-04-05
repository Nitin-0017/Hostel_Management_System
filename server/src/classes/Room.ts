// src/models/Room.ts

export enum RoomType {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  TRIPLE = "TRIPLE",
  DORMITORY = "DORMITORY",
}

export enum RoomStatus {
  AVAILABLE = "AVAILABLE",
  OCCUPIED = "OCCUPIED",
  MAINTENANCE = "MAINTENANCE",
  RESERVED = "RESERVED",
}

export class Room {
  private _id: string;
  private _roomNumber: string;
  private _floor: number;
  private _building?: string;
  private _type: RoomType;
  private _capacity: number;
  private _occupied: number;
  private _status: RoomStatus;
  private _amenities: string[];
  private _monthlyFee: number;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(data: {
    id: string;
    roomNumber: string;
    floor: number;
    building?: string;
    type: RoomType;
    capacity: number;
    occupied?: number;
    status?: RoomStatus;
    amenities?: string[];
    monthlyFee: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data.id;
    this._roomNumber = data.roomNumber;
    this._floor = data.floor;
    this._building = data.building;
    this._type = data.type;
    this._capacity = data.capacity;
    this._occupied = data.occupied ?? 0;
    this._status = data.status ?? RoomStatus.AVAILABLE;
    this._amenities = data.amenities ?? [];
    this._monthlyFee = data.monthlyFee;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }

  // ── Getters ──────────────────────────────────
  get id(): string { return this._id; }
  get roomNumber(): string { return this._roomNumber; }
  get floor(): number { return this._floor; }
  get building(): string | undefined { return this._building; }
  get type(): RoomType { return this._type; }
  get capacity(): number { return this._capacity; }
  get occupied(): number { return this._occupied; }
  get status(): RoomStatus { return this._status; }
  get amenities(): string[] { return [...this._amenities]; }
  get monthlyFee(): number { return this._monthlyFee; }
  get availableSlots(): number { return this._capacity - this._occupied; }
  get isAvailable(): boolean { return this._status === RoomStatus.AVAILABLE && this._occupied < this._capacity; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  // ── Setters ──────────────────────────────────
  set status(value: RoomStatus) { this._status = value; this._updatedAt = new Date(); }
  set monthlyFee(value: number) {
    if (value < 0) throw new Error("Fee cannot be negative.");
    this._monthlyFee = value;
    this._updatedAt = new Date();
  }

  // ── Business Logic Methods ────────────────────
  allocate(): void {
    if (!this.isAvailable) throw new Error(`Room ${this._roomNumber} is not available.`);
    this._occupied += 1;
    if (this._occupied >= this._capacity) this._status = RoomStatus.OCCUPIED;
    this._updatedAt = new Date();
  }

  deallocate(): void {
    if (this._occupied <= 0) throw new Error(`Room ${this._roomNumber} has no occupants.`);
    this._occupied -= 1;
    if (this._status === RoomStatus.OCCUPIED) this._status = RoomStatus.AVAILABLE;
    this._updatedAt = new Date();
  }

  setMaintenance(flag: boolean): void {
    this._status = flag ? RoomStatus.MAINTENANCE : (this._occupied > 0 ? RoomStatus.OCCUPIED : RoomStatus.AVAILABLE);
    this._updatedAt = new Date();
  }

  addAmenity(amenity: string): void {
    if (!this._amenities.includes(amenity)) {
      this._amenities.push(amenity);
      this._updatedAt = new Date();
    }
  }

  removeAmenity(amenity: string): void {
    this._amenities = this._amenities.filter(a => a !== amenity);
    this._updatedAt = new Date();
  }

  toJSON() {
    return {
      id: this._id,
      roomNumber: this._roomNumber,
      floor: this._floor,
      building: this._building,
      type: this._type,
      capacity: this._capacity,
      occupied: this._occupied,
      availableSlots: this.availableSlots,
      status: this._status,
      amenities: this._amenities,
      monthlyFee: this._monthlyFee,
      isAvailable: this.isAvailable,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}