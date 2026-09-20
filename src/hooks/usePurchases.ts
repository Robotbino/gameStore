import { useCallback, useEffect, useState } from "react";
import { purchaseService } from "../services/purchaseService";
import type { Purchase } from "../types/purchase";

/** The signed-in user's library, loaded once per mount. */
export function usePurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    purchaseService
      .getMine()
      .then((data) => {
        if (!cancelled) setPurchases(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load your library.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const owns = useCallback(
    (gameId: number) => purchases.some((p) => p.game.id === gameId),
    [purchases],
  );

  return { purchases, owns, isLoading, error };
}
