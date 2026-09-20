import type { Game } from "./game";

// Mirrors the backend WishlistResponse record: id, addedAt, and the full game.
export interface WishlistItem {
  id: number;
  addedAt: string;
  game: Game;
}
