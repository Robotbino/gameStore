export interface Game {
  id: number;
  title: string;
  genre: string;
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  heroImage: string;
}

// For creating/updating — id is server-generated
export type GameInput = Omit<Game, "id">;