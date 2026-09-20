import { useEffect, useState } from "react";
import type { Game } from "../types/game";
import { gameService } from "../services/gameService";

interface SuggestionsState {
  suggestions: Game[];
  isLoading: boolean;
  error: boolean;
  /** The term the current `suggestions` were fetched for; "" when idle. */
  resolvedQuery: string;
}

interface Options {
  limit?: number;
  delayMs?: number;
}

const IDLE: SuggestionsState = {
  suggestions: [],
  isLoading: false,
  error: false,
  resolvedQuery: "",
};

/**
 * Live game suggestions for a search term, debounced and race-safe.
 *
 * The debounce timer and the staleness guard share one effect closure: when
 * the term changes, the cleanup clears a timer that hasn't fired yet and flags
 * an in-flight response as cancelled, so "zel" can never overwrite "zelda".
 * Blank or whitespace terms never hit the network.
 *
 * Reuses GET /games/all?q=…&size=… through gameService, so the JWT header and
 * 401 handling come from the shared axios instance — nothing search-specific.
 */
export function useGameSuggestions(
  query: string,
  { limit = 6, delayMs = 300 }: Options = {},
): SuggestionsState {
  const q = query.trim();
  const [state, setState] = useState<SuggestionsState>(IDLE);

  useEffect(() => {
    if (!q) {
      setState(IDLE);
      return;
    }

    // Keep the previous list visible while the next one loads.
    setState((prev) => ({ ...prev, isLoading: true }));

    let cancelled = false;
    const timer = setTimeout(() => {
      gameService
        .getPage({ q, size: limit })
        .then((page) => {
          if (cancelled) return;
          setState({
            suggestions: page.content,
            isLoading: false,
            error: false,
            resolvedQuery: q,
          });
        })
        .catch(() => {
          if (cancelled) return;
          setState({ suggestions: [], isLoading: false, error: true, resolvedQuery: q });
        });
    }, delayMs);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [q, limit, delayMs]);

  return state;
}
