import { createContext } from "react";
import type { Game } from "../types/game";

/**
 * Shared state for the Quick Launch idle carousel.
 *
 * This is a context rather than page state because the two halves of the effect
 * live in different subtrees: the filling menu row is in <SideBar>, which
 * AppLayout renders, while the hero banner is inside the routed page. They have
 * no common ancestor below AppLayout, so a single source of truth is what keeps
 * them frame-accurate instead of "two timers that started near each other".
 *
 * Split across three files on purpose: the context object and its types live
 * here (no components), the provider is its own .tsx, and the hook sits in
 * hooks/ next to useAuth/useCart. That layout keeps react-refresh happy — a
 * file that exports both a component and a value trips
 * react-refresh/only-export-components, which is why AuthContext.tsx and
 * CartContext.tsx currently report lint errors.
 */

/** One spotlight turn: menu fill duration AND hero dwell time, single source. */
export const CYCLE_MS = 8_000;

/** Silence after the last grid click before the carousel takes over again. */
export const IDLE_MS = 60_000;

/**
 * How many library games the strip shows and cycles through. The rendered list
 * and the cycle set are deliberately the same set — a carousel that visits rows
 * the user can't see reads as a bug. Raise it if the sidebar has the room.
 */
export const QUICK_LAUNCH_LIMIT = 5;

export interface QuickLaunchValue {
  /** The user's own games, capped at QUICK_LAUNCH_LIMIT. Never the catalogue. */
  library: Game[];
  /**
   * What the hero should show: the carousel's current game while it runs, or
   * the game the user clicked while it's overridden. Null when there's nothing
   * to say and the page should fall back to its own selection.
   */
  spotlight: Game | null;
  /** id of the row that should be filling right now, or null when idle/halted. */
  activeId: number | null;
  /** Increments once per turn. Drives the CSS animation restart. */
  cycle: number;
  isRunning: boolean;
  /** Grid click: halt immediately, show this game, start the idle countdown. */
  interrupt: (game: Game) => void;
  cycleMs: number;
}

export const QuickLaunchContext = createContext<QuickLaunchValue | undefined>(
  undefined,
);
