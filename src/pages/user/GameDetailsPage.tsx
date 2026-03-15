import { useParams } from "react-router-dom";
import StarRating from "../../components/StarRating.tsx";
import type { Game } from "../../types/game";

// Placeholder — replace with real data fetching
const PLACEHOLDER_GAME: Game = {
  id: 0,
  title: "Game Title",
  genre: "Genre",
  price: 0,
  rating: 0,
  description: "Game description goes here.",
  imageUrl: "",
  heroImage: "",
};

export default function GameDetailsPage() {
  const { id } = useParams<{ id: string }>();

  // TODO: fetch game by id
  const game = PLACEHOLDER_GAME;

  return (
    <div className="game-details-page">
      <div className="game-details-hero">
        <img
          src={game.heroImage || game.imageUrl}
          alt={game.title}
          className="game-details-hero-image"
        />
        <div className="hero-gradient" />
      </div>

      <div className="game-details-content">
        <span className="hero-genre">{game.genre}</span>
        <h1 className="hero-title">{game.title}</h1>
        <StarRating rating={game.rating} />
        <p className="hero-description">{game.description}</p>

        <div className="hero-actions">
          <button className="btn-primary">
            Buy Now — R {game.price.toFixed(2)}
          </button>
          <button className="btn-outline">+ Wishlist</button>
        </div>
      </div>

      {/* temp: surfacing the id so routing can be verified */}
      <p className="debug-id">Game ID: {id}</p>
    </div>
  );
}
