import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import type { Game } from "../types/game";
import { useAuth } from "../hooks/useAuth";

// ── What CartContext exposes ──
interface CartContextType {
  items: Game[];
  count: number;
  total: number;
  add: (game: Game) => void;
  remove: (gameId: number) => void;
  clear: () => void;
  has: (gameId: number) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

// Namespace the cart per user, so logging out and back in as someone else can
// never inherit the previous account's cart. Anonymous sessions get their own
// bucket; in practice the cart is only reachable behind ProtectedRoute.
function storageKey(email: string | null): string {
  return email ? `cart:${email}` : "cart:guest";
}

function readCart(email: string | null): Game[] {
  try {
    const raw = localStorage.getItem(storageKey(email));
    return raw ? (JSON.parse(raw) as Game[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { userEmail } = useAuth();
  const [items, setItems] = useState<Game[]>(() => readCart(userEmail));

  // When the signed-in user changes (login, logout, switch account), load that
  // user's cart. This is also what "clears" the visible cart on logout — the
  // key changes to cart:guest, which is empty.
  useEffect(() => {
    setItems(readCart(userEmail));
  }, [userEmail]);

  // Mirror every change back to localStorage under the current user's key, so
  // the cart survives a page refresh.
  useEffect(() => {
    try {
      localStorage.setItem(storageKey(userEmail), JSON.stringify(items));
    } catch {
      /* storage full or unavailable — cart just won't persist this session */
    }
  }, [items, userEmail]);

  const add = useCallback((game: Game) => {
    // Idempotent: a game already in the cart is never added twice.
    setItems((prev) =>
      prev.some((g) => g.id === game.id) ? prev : [...prev, game],
    );
  }, []);

  const remove = useCallback((gameId: number) => {
    setItems((prev) => prev.filter((g) => g.id !== gameId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const has = useCallback(
    (gameId: number) => items.some((g) => g.id === gameId),
    [items],
  );

  const total = items.reduce((sum, g) => sum + g.price, 0);

  const value: CartContextType = {
    items,
    count: items.length,
    total,
    add,
    remove,
    clear,
    has,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
