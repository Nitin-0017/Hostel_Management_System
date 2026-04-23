import apiClient from "../config/apiClient";

export interface ICleaningResponse {
  id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  requestedAt: string;
  scheduledAt?: string;
  notes?: string;
}

export interface IRequestCleaning {
  notes?: string;
}

class CleaningService {
  async getMyCleaning(): Promise<ICleaningResponse[]> {
    const res = await apiClient.get<{ success: boolean; data: ICleaningResponse[] }>("/student/cleaning");
    return res.data.data;
  }

  async requestCleaning(data: IRequestCleaning): Promise<ICleaningResponse> {
    const res = await apiClient.post<{ success: boolean; data: ICleaningResponse }>("/student/cleaning", data);
    return res.data.data;
  }
}

export default new CleaningService();
