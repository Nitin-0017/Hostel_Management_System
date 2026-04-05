export enum Role {
  STUDENT = "STUDENT",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export abstract class User implements IUser {
  private _id: string;
  private _email: string;
  private _passwordHash: string;
  private _firstName: string;
  private _lastName: string;
  private _phone?: string;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;
  protected _role: Role;

  constructor(data: {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this._id = data.id;
    this._email = data.email;
    this._passwordHash = data.passwordHash;
    this._firstName = data.firstName;
    this._lastName = data.lastName;
    this._phone = data.phone;
    this._role = data.role;
    this._isActive = data.isActive ?? true;
    this._createdAt = data.createdAt ?? new Date();
    this._updatedAt = data.updatedAt ?? new Date();
  }

  get id(): string { return this._id; }
  get email(): string { return this._email; }
  get firstName(): string { return this._firstName; }
  get lastName(): string { return this._lastName; }
  get fullName(): string { return `${this._firstName} ${this._lastName}`; }
  get phone(): string | undefined { return this._phone; }
  get role(): Role { return this._role; }
  get isActive(): boolean { return this._isActive; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  set email(value: string) {
    if (!value.includes("@")) throw new Error("Invalid email address.");
    this._email = value;
    this._updatedAt = new Date();
  }
  set firstName(value: string) { this._firstName = value; this._updatedAt = new Date(); }
  set lastName(value: string) { this._lastName = value; this._updatedAt = new Date(); }
  set phone(value: string | undefined) { this._phone = value; this._updatedAt = new Date(); }
  set isActive(value: boolean) { this._isActive = value; this._updatedAt = new Date(); }

  setPasswordHash(hash: string): void {
    this._passwordHash = hash;
    this._updatedAt = new Date();
  }
  getPasswordHash(): string { return this._passwordHash; }

  abstract getProfileSummary(): Record<string, unknown>;

  getPermissions(): string[] {
    return ["view_profile", "update_profile", "login", "logout"];
  }

  toJSON(): IUser {
    return {
      id: this._id,
      email: this._email,
      firstName: this._firstName,
      lastName: this._lastName,
      phone: this._phone,
      role: this._role,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}