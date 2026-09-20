import { useEffect, useState } from "react";
import { orderService } from "../services/orderService";
import type { Order } from "../types/order";

/** The signed-in user's order history, newest first, loaded once per mount. */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    orderService
      .getMine()
      .then((data) => {
        if (!cancelled) setOrders(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load your orders.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, isLoading, error };
}
