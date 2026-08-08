import api from "./api";
import type { User, Role } from "../types/user";
import type { Page, PageParams } from "../types/pagination";
import { toPage } from "../types/pagination";

interface CreateUserPayload {
  userName: string;
  email: string;
  password: string;
  role: Role;
  points: number;
}

/** GET /users/all params — `q` filters by username substring, server-side. */
export interface UserQuery extends PageParams {
  q?: string;
}

export const userService = {
  /**
   * GET /users/all — admin only, and paginated since the controller stopped
   * serialising the whole users table. No params means page 0, 20 rows, id ASC.
   */
  getPage: async (query: UserQuery = {}): Promise<Page<User>> => {
    const params: Record<string, string | number> = {};
    const q = query.q?.trim();
    if (q) params.q = q;
    if (query.page != null) params.page = query.page;
    if (query.size != null) params.size = query.size;
    if (query.sort) params.sort = query.sort;

    const res = await api.get<unknown>("/users/all", { params });
    return toPage<User>(res.data, query);
  },

  // GET /users/me — identity comes from the JWT, never a URL param.
  getMe: async (): Promise<User> => {
    const res = await api.get<User>("/users/me");
    return res.data;
  },

  create: async (data: CreateUserPayload): Promise<User> => {
    const res = await api.post<User>("/users/add", data);
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