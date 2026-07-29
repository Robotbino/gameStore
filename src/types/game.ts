export interface Game {
  id: number;
  title: string;
  // The backend serves this as one comma-separated String column
  // ("RPG, Open World, Fantasy"). Use parseGenres() to render it as chips.
  genre: string;
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  heroImage: string;
  purchases?: unknown[];
}

// For creating/updating — id is server-generated
export type GameInput = Omit<Game, "id">;