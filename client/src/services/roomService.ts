import apiClient from "../config/apiClient";

export interface IRoomAllocationResponse {
  id: string;
  studentId: string;
  roomId: string;
  status: string;
  allocatedAt: string;
  vacatedAt?: string | null;
  room: {
    id: string;
    roomNumber: string;
    floor: number;
    building: string;
    capacity: number;
    occupied: number;
    type: string;
    status: string;
    monthlyFee: number;
    amenities?: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

class RoomService {
  async getMyRoom(): Promise<IRoomAllocationResponse | null> {
    try {
      const res = await apiClient.get<{ success: boolean; data: IRoomAllocationResponse }>("/student/room");
      return res.data.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null; // Return null if no room is allocated
      }
      throw error;
    }
  }
}

export default new RoomService();
