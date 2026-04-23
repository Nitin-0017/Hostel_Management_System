import apiClient from "../config/apiClient";

export interface ILeaveResponse {
  id: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  createdAt: string;
}

export interface IApplyLeave {
  fromDate: string;
  toDate: string;
  reason: string;
}

class LeaveService {
  async getMyLeaves(): Promise<ILeaveResponse[]> {
    const res = await apiClient.get<{ success: boolean; data: ILeaveResponse[] }>("/student/leaves");
    return res.data.data;
  }

  async applyLeave(data: IApplyLeave): Promise<ILeaveResponse> {
    const res = await apiClient.post<{ success: boolean; data: ILeaveResponse }>("/student/leaves", data);
    return res.data.data;
  }
}

export default new LeaveService();
