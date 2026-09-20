import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { Game } from "../types/game";
import type { WishlistItem } from "../types/wishlist";
import { wishlistService } from "../services/wishlistService";
import { useAuth } from "../hooks/useAuth";
import { WishlistContext } from "./wishlist";
import type { WishlistValue } from "./wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // Games with a request in flight; a second click on the same heart waits.
  const pending = useRef(new Set<number>());

  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    wishlistService
      .getMine()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const has = useCallback(
    (gameId: number) => items.some((item) => item.game.id === gameId),
    [items],
  );

  // Optimistic: the heart lights up immediately and is put back if the
  // server says no.
  const toggle = useCallback(
    async (game: Game): Promise<boolean> => {
      if (pending.current.has(game.id)) return true;
      pending.current.add(game.id);

      const wasWished = items.some((item) => item.game.id === game.id);
      const optimistic: WishlistItem = { id: -game.id, addedAt: new Date().toISOString(), game };
      setItems((prev) =>
        wasWished ? prev.filter((item) => item.game.id !== game.id) : [optimistic, ...prev],
      );

      try {
        if (wasWished) {
          await wishlistService.remove(game.id);
        } else {
          const saved = await wishlistService.add(game.id);
          setItems((prev) => prev.map((item) => (item.game.id === game.id ? saved : item)));
        }
        return true;
      } catch {
        setItems((prev) =>
          wasWished ? [optimistic, ...prev] : prev.filter((item) => item.game.id !== game.id),
        );
        return false;
      } finally {
        pending.current.delete(game.id);
      }
    },
    [items],
  );

  const value = useMemo<WishlistValue>(
    () => ({ items, isLoading, has, toggle }),
    [items, isLoading, has, toggle],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
