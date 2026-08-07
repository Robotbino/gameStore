import type { Game } from "./game";

// Mirrors the backend PurchaseResponse record: id, purchaseDate, and the full
// game (which serializes identically to /games/all, so it reuses the Game type).
export interface Purchase {
  id: number;
  purchaseDate: string;
  game: Game;
}

// Mirrors CheckoutResponse: games newly bought this checkout, plus the ids the
// user already owned (skipped, not an error — re-checkout is safe).
export interface CheckoutResult {
  purchased: Purchase[];
  alreadyOwned: number[];
}
