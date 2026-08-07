import api from "./api";
import type { Purchase, CheckoutResult } from "../types/purchase";

// Paths mirror PurchaseController.java: POST /purchases and GET /purchases/me.
// Uses the shared `api` instance, so the JWT request interceptor and the
// 401 -> /login response interceptor in services/api.ts apply automatically —
// this service holds no auth logic of its own.

export const purchaseService = {
  // Buy every game in the cart in one transaction. The result splits into what
  // was newly purchased and what the user already owned (safe to re-run).
  checkout: async (gameIds: number[]): Promise<CheckoutResult> => {
    const res = await api.post<CheckoutResult>("/purchases", { gameIds });
    return res.data;
  },

  // The signed-in user's library. Identity comes from the token, never a param.
  getMine: async (): Promise<Purchase[]> => {
    const res = await api.get<Purchase[]>("/purchases/me");
    return res.data;
  },
};
