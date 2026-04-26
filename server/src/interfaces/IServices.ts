import { PrismaClient } from "@prisma/client";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export class DatabaseManager {
  private static instance: DatabaseManager;
  private _client: PrismaClient;

  private constructor() {
    this._client = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
    });
  }

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  get client(): PrismaClient {
    return this._client;
  }

  async connect(): Promise<void> {
    await this._client.$connect();
  }

  async disconnect(): Promise<void> {
    await this._client.$disconnect();
  }
}
