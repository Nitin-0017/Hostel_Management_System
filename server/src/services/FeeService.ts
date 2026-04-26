import { DatabaseManager } from "../interfaces/IServices";

const db = DatabaseManager.getInstance().client;

export class FeeService {
  async getByStudent(studentId: string) {
    return db.feeRecord.findMany({
      where: { studentId },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });
  }

  async getSummary(studentId: string) {
    const records = await this.getByStudent(studentId);
    const total   = records.reduce((s, r) => s + Number(r.amount), 0);
    const paid    = records.filter(r => r.status === "PAID").reduce((s, r) => s + Number(r.amount), 0);
    const pending = records.filter(r => r.status === "PENDING").reduce((s, r) => s + Number(r.amount), 0);
    const overdue = records.filter(r => r.status === "OVERDUE").reduce((s, r) => s + Number(r.amount), 0);
    return { total, paid, pending, overdue, count: records.length };
  }
}
