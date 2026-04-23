import apiClient from "../config/apiClient";

export interface IComplaintResponse {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  createdAt: string;
}

export interface ISubmitComplaint {
  category: string;
  subject: string;
  description: string;
}

class ComplaintService {
  async getMyComplaints(): Promise<IComplaintResponse[]> {
    const res = await apiClient.get<{ success: boolean; data: IComplaintResponse[] }>("/student/complaints");
    return res.data.data;
  }

  async submitComplaint(data: ISubmitComplaint): Promise<IComplaintResponse> {
    const res = await apiClient.post<{ success: boolean; data: IComplaintResponse }>("/student/complaints", data);
    return res.data.data;
  }
}

export default new ComplaintService();
