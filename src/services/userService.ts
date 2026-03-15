import api from "./api";
import type { User } from "../types/user";

export const userService = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get<User[]>("/users");
    return res.data;
  },

  getById: async (id: number): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const res = await api.put<User>(`/users/${id}`, user);
    return res.data;
  },
};