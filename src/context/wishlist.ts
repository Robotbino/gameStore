import { createContext } from "react";
import type { Game } from "../types/game";
import type { WishlistItem } from "../types/wishlist";

export interface WishlistValue {
  items: WishlistItem[];
  isLoading: boolean;
  has: (gameId: number) => boolean;
  /** Adds or removes the game; resolves to false if the server rejected it. */
  toggle: (game: Game) => Promise<boolean>;
}

export const WishlistContext = createContext<WishlistValue | undefined>(undefined);
