import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import StarRating from "../../components/StarRating.tsx";
import type { Game } from "../../types/game";
import { gameService } from "../../services/gameService";

export default function GameDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setError(null);

    gameService
      .getById(Number(id))
      .then((data) => setGame(data))
      .catch(() => setError("We couldn't load this game."))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="loading-screen">Loading game…</div>;

  if (error || !game) {
    return (
      <div className="game-details-page">
        <div className="game-details-content">
          <h1 className="hero-title">Game not found</h1>
          <p className="hero-description">
            {error ?? "This game may have been removed."}
          </p>
          <div className="hero-actions">
            <Link to="/browse" className="btn-primary">
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <span className="hero-genre">{game.genre.join(", ")}</span>
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
    </div>
  );
}
