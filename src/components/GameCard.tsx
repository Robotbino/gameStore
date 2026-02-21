import type { Game } from "../assets/gameData";
import StarRating from "./StarRating.tsx";


interface GameCardProps {
  game: Game;
  isSelected: boolean;
  onSelect: (game: Game) => void;
}

export default function GameCard({ game, isSelected, onSelect }: GameCardProps) {

    return ( 
    <div
      className={`game-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(game)}
    >
      {/* Image — the visual anchor. Always first. */}
      <div className="game-card-image-wrapper">
        <img src={game.imageUrl} alt={game.title} />
      </div>

      {/* Info — genre → title → rating → price (top-down hierarchy) */}
      <div className="game-card-info">
        <span className="game-card-genre">{game.genre}</span>
        <h3 className="game-card-title" title={game.title}>
          {game.title}
        </h3>
        <StarRating rating={game.rating} />
        <p className="game-card-price">R {game.price.toFixed(2)}</p>
      </div>
    </div>);
}