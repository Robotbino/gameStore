import { useNavigate } from "react-router-dom";
import type { Game } from "../types/game";
import { parseGenres } from "../utils/genre";
import StarRating from "./StarRating.tsx";

interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onSelect: (game: Game) => void;
}

export default function GameCard({ game, isSelected, onSelect }: GameCardProps) {
  const navigate = useNavigate();

  // The card keeps its original click-to-select behaviour, because HomePage
  // uses it to swap the hero banner. Opening the details page is a separate,
  // explicit action so neither gesture steals the other.
  const genres = parseGenres(game.genre);

  return (
    <div
      className={`game-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(game)}
    >
      <div className="game-card-image-wrapper">
        <img src={game.imageUrl} alt={game.title} />
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
    </div>
  );
}
