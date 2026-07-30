import api from "./api";
import type { LoginRequest, RegisterRequest, AuthResponse } from "../types/auth";

// Nothing in here logs its argument: both payloads carry a plaintext password,
// and console output is readable by anyone who opens devtools and persists in
// screen recordings and bug reports.

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/v2/auth/authenticate", data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>("/api/v2/auth/register", data);
    return res.data;
  },
};
