import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const AUTH_ENDPOINTS = [
  "/users/admin/login",
  "/users/student/login",
  "/users/staff/login",
  "/users/student/signup",
  "/users/staff/signup",
];

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const requestUrl = error.config?.url ?? "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));

    // Only redirect on 401 from protected routes, never from login/signup
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
