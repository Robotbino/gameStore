export interface Game {
  id: number;
  title: string;
  genre: string | string[];
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  heroImage: string;
  purchases?: unknown[];
}

// For creating/updating — id is server-generated
export type GameInput = Omit<Game, "id">;