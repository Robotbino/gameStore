import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import type { Game } from "../types/game";
import { parseGenres } from "../utils/genre";
import StarRating from "./StarRating.tsx";
import WishlistButton from "./WishlistButton";

interface GameCardProps {
  game: Game;
  /** Position in the grid; drives the staggered arrival. */
  index?: number;
  isSelected: boolean;
  onSelect: (game: Game) => void;
}

export default function GameCard({
  game,
  index = 0,
  isSelected,
  onSelect,
}: GameCardProps) {
  const navigate = useNavigate();
  const genres = parseGenres(game.genre);

  // Selecting the card swaps the hero; "View Details" is a separate, explicit
  // action so neither gesture steals the other.
  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(game);
    }
  }

  return (
    <article
      className={`game-card ${isSelected ? "selected" : ""}`}
      style={{ "--i": index } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(game)}
      onKeyDown={handleKeyDown}
    >
      <div className="game-card-image-wrapper">
        <img src={game.imageUrl} alt={game.title} />
        <WishlistButton game={game} variant="icon" />
      </div>

      <div className="game-card-info">
        <span className="game-card-genre">
          {genres.length > 0 ? genres.slice(0, 2).join(" · ") : "Uncategorised"}
        </span>
        <h3 className="game-card-title" title={game.title}>
          {game.title}
        </h3>
        <StarRating rating={game.rating} />
        <p className="game-card-price">R {game.price.toFixed(2)}</p>

        <button
          className="game-card-view"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/games/${game.id}`);
          }}
        >
          View Details
        </button>
      </div>
    </article>
  );
}
