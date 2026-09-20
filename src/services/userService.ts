import api from "./api";
import type {
  AccountUpdateResponse,
  ChangePasswordRequest,
  Role,
  UpdateAccountRequest,
  UpdateProfileRequest,
  User,
} from "../types/user";
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

  // ── Self-service. Three endpoints, one per form on the Settings page. ──
  //
  // These live under /users/me/**, which the backend's security chain lists
  // explicitly; everything else under /users/ is ADMIN-only. That split is the
  // reason a normal user can call these at all — see UsersController.

  /**
   * PUT /users/me/profile — presentation fields only.
   * Sends all four every time: the backend replaces rather than merges, which
   * is how a bio gets cleared rather than being stuck forever.
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const res = await api.put<User>("/users/me/profile", data);
    return res.data;
  },

  /**
   * PUT /users/me/account — userName and email.
   * Always returns a replacement token, because changing the email invalidates
   * the one the caller is holding. The caller must hand it to
   * AuthContext.applyNewToken or the very next request is anonymous.
   */
  updateAccount: async (
    data: UpdateAccountRequest,
  ): Promise<AccountUpdateResponse> => {
    const res = await api.put<AccountUpdateResponse>("/users/me/account", data);
    return res.data;
  },

  /**
   * PUT /users/me/password — 204 on success, nothing to read back.
   * A wrong current password comes back as 400, not 401, specifically so the
   * response interceptor doesn't mistake a typo for a dead session and log the
   * user out. Don't log either field.
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.put("/users/me/password", data);
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