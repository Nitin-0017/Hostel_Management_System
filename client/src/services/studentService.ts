import apiClient from "../config/apiClient";

export interface IProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  student: {
    enrollmentNumber: string;
    course: string;
    year: number;
    joiningDate: string;
  };
}

class StudentService {
  async getProfile(): Promise<IProfileResponse> {
    const res = await apiClient.get<{ success: boolean; data: IProfileResponse }>("/student/profile");
    return res.data.data;
  }
}

export default new StudentService();
