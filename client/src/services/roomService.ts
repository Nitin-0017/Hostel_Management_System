import apiClient from "../config/apiClient";

export interface IRoomAllocationResponse {
  id: string;
  status: string;
  allocatedAt: string;
  room: {
    roomNumber: string;
    floor: number;
    building: string;
    capacity: number;
    occupied: number;
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
