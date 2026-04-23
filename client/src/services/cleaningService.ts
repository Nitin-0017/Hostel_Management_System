import apiClient from "../config/apiClient";

export interface ICleaningRequest {
  id: string;
  studentId: string;
  roomId: string;
  assignedStaffId: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  requestedAt: string;
  scheduledAt: string | null;
  completedAt: string | null;
  notes: string | null;
  room?: {
    roomNumber: string;
  };
  assignedStaff?: {
    user: {
      firstName: string;
      lastName: string;
    };
  } | null;
}

export interface ICleaningResponse extends ICleaningRequest {}

export interface ISubmitCleaning {
  notes?: string;
}

class CleaningService {
  async getMyCleaningRequests(): Promise<ICleaningRequest[]> {
    const res = await apiClient.get<{ success: boolean; data: ICleaningRequest[] }>("/student/cleaning");
    return res.data.data;
  }

  async getMyCleaning(): Promise<ICleaningRequest[]> {
    return this.getMyCleaningRequests();
  }

  async requestCleaning(data: ISubmitCleaning): Promise<ICleaningRequest> {
    const res = await apiClient.post<{ success: boolean; data: ICleaningRequest }>("/student/cleaning", data);
    return res.data.data;
  }
}

export default new CleaningService();
