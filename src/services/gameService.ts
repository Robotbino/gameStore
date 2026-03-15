import api from "./api";
import type { Game, GameInput } from "../types/game";

export const gameService = {
  getAll: async (): Promise<Game[]> => {
    const res = await api.get<Game[]>("/games");
    return res.data;
  },

  getById: async (id: number): Promise<Game> => {
    const res = await api.get<Game>(`/games/${id}`);
    return res.data;
  },

  search: async (keyword: string): Promise<Game[]> => {
    const res = await api.get<Game[]>("/games/search", { params: { keyword } });
    return res.data;
  },

  getByGenre: async (genre: string): Promise<Game[]> => {
    const res = await api.get<Game[]>(`/games/genre/${genre}`);
    return res.data;
  },

  // Admin only 
  create: async (game: GameInput): Promise<Game> => {
    const res = await api.post<Game>("/games", game);
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