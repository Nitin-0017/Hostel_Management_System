export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    name: string;
    role: string;
  };
}