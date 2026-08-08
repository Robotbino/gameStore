import { useState, useEffect, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import type { Game } from "../types/game";
import { purchaseService } from "../services/purchaseService";
import { useAuth } from "../hooks/useAuth";
import {
  QuickLaunchContext,
  CYCLE_MS,
  IDLE_MS,
  QUICK_LAUNCH_LIMIT,
} from "./quickLaunch";
import type { QuickLaunchValue } from "./quickLaunch";

/** The carousel is a Browse-page behaviour; nowhere else runs it. */
const BROWSE_PATH = "/browse";

interface QuickLaunchProviderProps {
  /** Lifted from AppLayout — a collapsed sidebar has nothing to animate. */
  isSidebarOpen: boolean;
  children: ReactNode;
}

export function QuickLaunchProvider({
  isSidebarOpen,
  children,
}: QuickLaunchProviderProps) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();

  const [library, setLibrary] = useState<Game[]>([]);
  const [index, setIndex] = useState(0);
  // Strictly increasing turn counter. `index` alone can't drive the cycle: a
  // one-game library leaves it pinned at 0, so neither the timer effect nor the
  // CSS animation would ever see a change to react to.
  const [cycle, setCycle] = useState(0);
  // null means "carousel owns the hero". Non-null means the user took over.
  const [override, setOverride] = useState<{ game: Game } | null>(null);

  // ── The data constraint: owned games only, never the catalogue ──
  // GET /purchases/me is the only endpoint that knows what this user owns, so
  // the strip physically cannot show a game they haven't bought.
  useEffect(() => {
    if (!isAuthenticated) {
      setLibrary([]);
      return;
    }

    let cancelled = false;

    purchaseService
      .getMine()
      .then((purchases) => {
        if (cancelled) return;

        // One row per game even if the backend ever returns repeat purchases —
        // a duplicate would make the carousel visit the same tile twice.
        const seen = new Set<number>();
        const owned: Game[] = [];
        for (const purchase of purchases) {
          if (!purchase.game || seen.has(purchase.game.id)) continue;
          seen.add(purchase.game.id);
          owned.push(purchase.game);
        }

        setLibrary(owned.slice(0, QUICK_LAUNCH_LIMIT));
        setIndex(0);
      })
      .catch(() => {
        // Quick Launch is decorative; a failed library read just means no strip.
        if (!cancelled) setLibrary([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  // All three execution triggers in one place, plus the user-override gate.
  // Every timer below hangs off this flag, so a single false value tears the
  // whole thing down through the effects' cleanups — there is no separate
  // "stop" path that could miss a timer.
  const isRunning =
    pathname === BROWSE_PATH &&
    isSidebarOpen &&
    library.length > 0 &&
    override === null;

  // ── The 8s turn ──
  // One setTimeout per turn rather than a setInterval. An interval keeps its own
  // clock, which drifts away from the CSS animation and keeps firing through a
  // re-render it should have been re-armed by; a timeout re-armed on `cycle`
  // restarts in the same commit that restarts the fill, so the row and the hero
  // can't slide apart.
  useEffect(() => {
    if (!isRunning) return;

    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % library.length);
      setCycle((prev) => prev + 1);
    }, CYCLE_MS);

    return () => clearTimeout(timer);
  }, [isRunning, cycle, library.length]);

  // ── The 60s idle countdown ──
  // Deliberately NOT gated on isRunning: the clock should keep running while the
  // user reads a game they clicked, including if they collapse the sidebar or
  // wander to another page in the meantime. Coming back to Browse then finds a
  // carousel that already resumed rather than one that owes 60 more seconds.
  useEffect(() => {
    if (!override) return;

    const timer = setTimeout(() => {
      setOverride(null);
      // "Restart", per the spec — the sequence begins again from the first
      // library game rather than resuming mid-list.
      setIndex(0);
      setCycle((prev) => prev + 1);
    }, IDLE_MS);

    return () => clearTimeout(timer);
  }, [override]);

  const interrupt = useCallback((game: Game) => {
    // A fresh object every click, even for the same game twice. State identity
    // changes, so the effect above re-runs: the previous countdown is cleared
    // and a full 60s starts from this click.
    setOverride({ game });
  }, []);

  const spotlight = isRunning
    ? library[index] ?? null
    : override?.game ?? null;

  const value = useMemo<QuickLaunchValue>(
    () => ({
      library,
      spotlight,
      activeId: isRunning ? library[index]?.id ?? null : null,
      cycle,
      isRunning,
      interrupt,
      cycleMs: CYCLE_MS,
    }),
    [library, spotlight, isRunning, index, cycle, interrupt],
  );

  return (
    <QuickLaunchContext.Provider value={value}>
      {children}
    </QuickLaunchContext.Provider>
  );
}
