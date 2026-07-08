import api from "./api";
import type { Game, GameInput } from "../types/game";

export const gameService = {
  getAll: async (): Promise<Game[]> => {
    const res = await api.get<Game[]>("/games/all");
    return res.data;
  },

  getById: async (id: number): Promise<Game> => {
    const res = await api.get<Game>(`/games/find/${id}`);
    return res.data;
  },

  // The backend has no search/genre endpoints, so both filter client-side
  search: async (keyword: string): Promise<Game[]> => {
    const games = await gameService.getAll();
    const term = keyword.toLowerCase();
    return games.filter((game) => game.title.toLowerCase().includes(term));
  },

  getByGenre: async (genre: string): Promise<Game[]> => {
    const games = await gameService.getAll();
    const term = genre.toLowerCase();
    return games.filter((game) =>
      game.genre.some((g) => g.toLowerCase() === term)
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
};
