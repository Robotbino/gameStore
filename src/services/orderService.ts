import api from "./api";
import type { CheckoutRequest, Order } from "../types/order";

// Paths mirror OrderController.java. The shared `api` instance attaches the
// JWT and redirects on 401, so this service holds no auth logic of its own.
export const orderService = {
  // Simulated payment: the server always succeeds unless the cart holds
  // nothing new to buy (400). Returns the receipt plus the new points balance.
  checkout: async (request: CheckoutRequest): Promise<Order> => {
    const res = await api.post<Order>("/orders/checkout", request);
    return res.data;
  },

  getMine: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>("/orders/me");
    return res.data;
  },

  getOne: async (id: number): Promise<Order> => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },
};
