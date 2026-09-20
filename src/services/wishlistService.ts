import api from "./api";
import type { WishlistItem } from "../types/wishlist";

// Paths mirror WishlistController.java. Adding is idempotent and removing an
// absent game is a no-op, so the client can toggle without reading first.
export const wishlistService = {
  getMine: async (): Promise<WishlistItem[]> => {
    const res = await api.get<WishlistItem[]>("/wishlist/me");
    return res.data;
  },

  add: async (gameId: number): Promise<WishlistItem> => {
    const res = await api.post<WishlistItem>(`/wishlist/${gameId}`);
    return res.data;
  },

  remove: async (gameId: number): Promise<void> => {
    await api.delete(`/wishlist/${gameId}`);
  },
};
