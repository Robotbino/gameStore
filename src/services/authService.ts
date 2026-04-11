import api from "./api";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    console.log("Sending login request with data:", data);
    const res = await api.post<AuthResponse>("/api/v2/auth/authenticate", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    console.log("Sending register request with data:", data);
    const res = await api.post<AuthResponse>("/api/v2/auth/register", data);
    return res.data;
  },
};