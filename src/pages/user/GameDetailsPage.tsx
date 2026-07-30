import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import StarRating from "../../components/StarRating.tsx";
import { gameService } from "../../services/gameService";
import { parseGenres } from "../../utils/genre";
import type { Game } from "../../types/game";

export default function GameDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const gameId = Number(id);

    if (!id || Number.isNaN(gameId)) {
      setError("That game link doesn't look right.");
      setIsLoading(false);
      return;
    }

    // Guards against a slow response for game A landing after we've already
    // navigated to game B and overwriting it.
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    gameService
      .getById(gameId)
      .then((data) => {
        if (!cancelled) setGame(data);
      })
      .catch(() => {
        // The backend throws RuntimeException for a missing id, which its
        // GlobalExceptionHandler turns into a 500 — so a deleted game and a
        // genuinely broken server are indistinguishable from here.
        if (!cancelled) setError("We couldn't load this game.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading) {
    return <div className="loading-screen">Loading game…</div>;
  }

  if (error || !game) {
    return (
      <div className="game-details-missing">
        <h2 className="page-title">Game unavailable</h2>
        <p className="game-details-missing-text">
          {error ?? "We couldn't load this game."}
        </p>
        <Link to="/browse" className="btn-primary">
          Back to Browse
        </Link>
      </div>
    );
  }

  const genres = parseGenres(game.genre);

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
        <button className="game-details-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {genres.length > 0 && (
          <div className="game-details-genres">
            {genres.map((genre) => (
              <span key={genre} className="hero-genre">
                {genre}
              </span>
            ))}
          </div>
        )}

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
