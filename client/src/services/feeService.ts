import apiClient from "../config/apiClient";

export interface IFeeRecord {
  id: string;
  month: number;
  monthName: string;
  year: number;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "WAIVED";
  dueDate: string;
  paidAt: string | null;
  paymentMethod: "ONLINE" | "CASH" | "BANK_TRANSFER" | "UPI" | null;
  transactionId: string | null;
  remarks: string | null;
  createdAt: string;
}

export interface IFeeSummary {
  total: number;
  paid: number;
  pending: number;
  overdue: number;
  count: number;
}

class FeeService {
  async getMyFees(): Promise<IFeeRecord[]> {
    const res = await apiClient.get<{ success: boolean; data: IFeeRecord[] }>("/student/fees");
    return res.data.data;
  }

  async getMyFeeSummary(): Promise<IFeeSummary> {
    const res = await apiClient.get<{ success: boolean; data: IFeeSummary }>("/student/fees/summary");
    return res.data.data;
  }
}

export default new FeeService();
