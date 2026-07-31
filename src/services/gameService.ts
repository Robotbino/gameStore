import api from "./api";
import type { Game, GameInput } from "../types/game";
import { parseGenres } from "../utils/genre";

// Paths below mirror GamesControllers.java exactly. Two of them are not the
// REST-conventional shape you'd expect (`/games/find/{id}`, `/games/add`) —
// that's the contract the backend actually serves today, not a typo.

export const gameService = {
  getAll: async (): Promise<Game[]> => {
    const res = await api.get<Game[]>("/games/all");
    return res.data;
  },

  getById: async (id: number): Promise<Game> => {
    const res = await api.get<Game>(`/games/find/${id}`);
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

  // Admin only
  create: async (game: GameInput): Promise<Game> => {
    const res = await api.post<Game>("/games/add", game);
    return res.data;
  },

  update: async (id: number, game: GameInput): Promise<Game> => {
    const res = await api.put<Game>(`/games/${id}`, game);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/games/${id}`);
  },

  // POST /games/sync/rawg — admin-only. Backend currently returns 501 with
  // {"message": "..."} until the RAWG integration lands. Callers should
  // catch AxiosError and read err.response?.status / err.response?.data.
  syncFromRawg: async (): Promise<{ message: string }> => {
    const res = await api.post<{ message: string }>("/games/sync/rawg");
    return res.data;
  },
};
