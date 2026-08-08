import api from "./api";
import type { Game, GameInput } from "../types/game";
import type { Page, PageParams } from "../types/pagination";
import { toPage } from "../types/pagination";

// Paths below mirror GamesControllers.java exactly. Two of them are not the
// REST-conventional shape you'd expect (`/games/find/{id}`, `/games/add`) —
// that's the contract the backend actually serves today, not a typo.

/**
 * Everything GET /games/all accepts. The backend collapsed findAllGames /
 * searchGames / getGamesByGenre into one query, so this client mirrors that:
 * one call, optional filters, always paginated.
 *
 * Caveat on `genre`: the repository matches it with `g.genre = :genre`, but the
 * column stores a comma-separated list ("RPG, Open World, Fantasy"). So the
 * filter only hits rows whose ENTIRE genre string equals the value — passing a
 * single genre like "RPG" won't match a multi-genre row. Until the backend
 * splits that column (or switches to LIKE), treat this param as exact-match.
 */
export interface GameQuery extends PageParams {
  q?: string;
  genre?: string;
}

// ── Local read-through cache for the catalogue ──
// The catalogue is read on nearly every navigation — SideBar mounts with the
// layout, BrowsePage, the admin table — but it changes only when an admin edits
// it. A short TTL collapses that burst of identical requests into one, so
// browse → details → back is instant instead of re-fetching.
//
// Now keyed by the full query string, since "the catalogue" is no longer one
// response but one per page/filter combination. Keyword searches are NOT cached:
// they're already debounced, every keystroke is a distinct key, and caching them
// would grow the map without ever scoring a hit.
const CATALOG_TTL_MS = 60_000;
const MAX_CACHED_PAGES = 20;

const pageCache = new Map<string, { data: Page<Game>; at: number }>();
const byIdCache = new Map<number, Game>();

function fresh(at: number): boolean {
  return Date.now() - at < CATALOG_TTL_MS;
}

function primeById(games: Game[]): void {
  for (const g of games) byIdCache.set(g.id, g);
}

function invalidateCache(): void {
  pageCache.clear();
  byIdCache.clear();
}

/** Drop empty values so a blank filter doesn't ride along as `?q=`. */
function toParams(query: GameQuery): Record<string, string | number> {
  const params: Record<string, string | number> = {};
  const q = query.q?.trim();
  const genre = query.genre?.trim();

  if (q) params.q = q;
  if (genre) params.genre = genre;
  if (query.page != null) params.page = query.page;
  if (query.size != null) params.size = query.size;
  if (query.sort) params.sort = query.sort;

  return params;
}

export const gameService = {
  /**
   * GET /games/all — one page of the catalogue, plus the totals a caller needs
   * to render "showing N of M" and a page counter.
   *
   * Omitting every param gives the backend default: page 0, 20 rows, id ASC.
   * Callers that only need a handful of rows should say so (`{ size: 3 }`)
   * rather than take 20 and slice.
   */
  getPage: async (query: GameQuery = {}): Promise<Page<Game>> => {
    const params = toParams(query);
    const key = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString();
    const cacheable = !params.q;

    if (cacheable) {
      const hit = pageCache.get(key);
      if (hit && fresh(hit.at)) return hit.data;
    }

    const res = await api.get<unknown>("/games/all", { params });
    const page = toPage<Game>(res.data, query);

    if (cacheable) {
      // Cheap FIFO cap — Map preserves insertion order, so the oldest key is
      // the first one out. Keeps a long browse session from growing unbounded.
      if (pageCache.size >= MAX_CACHED_PAGES) {
        const oldest = pageCache.keys().next().value;
        if (oldest !== undefined) pageCache.delete(oldest);
      }
      pageCache.set(key, { data: page, at: Date.now() });
    }

    primeById(page.content);
    return page;
  },

  getById: async (id: number): Promise<Game> => {
    const cached = byIdCache.get(id);
    if (cached) return cached;
    const res = await api.get<Game>(`/games/find/${id}`);
    byIdCache.set(id, res.data);
    return res.data;
  },

  // Admin only. Each mutation clears the cache so the next read reflects it —
  // otherwise an admin could add a game and not see it for up to a minute.
  create: async (game: GameInput): Promise<Game> => {
    const res = await api.post<Game>("/games/add", game);
    invalidateCache();
    return res.data;
  },

  update: async (id: number, game: GameInput): Promise<Game> => {
    const res = await api.put<Game>(`/games/${id}`, game);
    invalidateCache();
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/games/${id}`);
    invalidateCache();
  },

  // POST /games/sync/rawg — admin-only. Backend currently returns 501 with
  // {"message": "..."} until the RAWG integration lands. Callers should
  // catch AxiosError and read err.response?.status / err.response?.data.
  syncFromRawg: async (): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/games/sync/rawg");
    return res.data;
  },
};
