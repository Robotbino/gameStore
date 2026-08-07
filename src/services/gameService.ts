import api from "./api";
import type { Game, GameInput } from "../types/game";
import { parseGenres } from "../utils/genre";

// Paths below mirror GamesControllers.java exactly. Two of them are not the
// REST-conventional shape you'd expect (`/games/find/{id}`, `/games/add`) —
// that's the contract the backend actually serves today, not a typo.

// ── Local read-through cache for the catalogue ──
// The catalogue is read on nearly every navigation — SideBar mounts with the
// layout, BrowsePage, and search all hit /games/all — but it changes only when
// an admin edits it. A short TTL collapses that burst of identical requests
// into one, so browse → details → back is instant instead of re-fetching.
// Any create/update/delete calls invalidateCache() so admin edits show at once.
const CATALOG_TTL_MS = 60_000;

let allGamesCache: { data: Game[]; at: number } | null = null;
const byIdCache = new Map<number, Game>();

function fresh(at: number): boolean {
  return Date.now() - at < CATALOG_TTL_MS;
}

function primeById(games: Game[]): void {
  for (const g of games) byIdCache.set(g.id, g);
}

function invalidateCache(): void {
  allGamesCache = null;
  byIdCache.clear();
}

export const gameService = {
  getAll: async (): Promise<Game[]> => {
    if (allGamesCache && fresh(allGamesCache.at)) {
      return allGamesCache.data;
    }
    const res = await api.get<Game[]>("/games/all");
    allGamesCache = { data: res.data, at: Date.now() };
    primeById(res.data);
    return res.data;
  },

  getById: async (id: number): Promise<Game> => {
    const cached = byIdCache.get(id);
    if (cached) return cached;
    const res = await api.get<Game>(`/games/find/${id}`);
    byIdCache.set(id, res.data);
    return res.data;
  },

  // GamesService.searchGames() and getGamesByGenre() exist on the backend but
  // no controller exposes them, so both filters run client-side over /games/all.
  // When those endpoints land, swap the bodies back to a single api.get and
  // every caller keeps working unchanged.
  search: async (keyword: string): Promise<Game[]> => {
    const games = await gameService.getAll();
    const needle = keyword.trim().toLowerCase();
    if (!needle) return games;
    return games.filter((game) =>
      game.title.toLowerCase().includes(needle),
    );
  },

  getByGenre: async (genre: string): Promise<Game[]> => {
    const games = await gameService.getAll();
    const needle = genre.trim().toLowerCase();
    if (!needle) return games;
    // Match whole genres, not substrings, so "Action" doesn't pull in
    // "Action RPG" — the splitting itself lives in parseGenres.
    return games.filter((game) =>
      parseGenres(game.genre).some((g) => g.toLowerCase() === needle),
    );
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
