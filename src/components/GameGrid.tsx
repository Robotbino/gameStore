import type { Game } from "../assets/gameData";
import GameCard from "./GameCard";

interface GameGridProps {
  items: Game[];
  heading: string;
  selectedGame: Game | null;
  onSelectItem: (game: Game) => void;
}

export default function GameGrid({
  items,
  heading,
  selectedGame,
  onSelectItem,
}: GameGridProps) {
  if (items.length === 0) {
    return (
      <section>
        <h2 className="game-grid-title">{heading}</h2>
        <p style={{ color: "var(--text-muted)" }}>No games found.</p>
      </section>
    );
  }

  return (
    <section>
      <div className="game-grid-header">
        <h2 className="game-grid-title">{heading}</h2>
        <button className="game-grid-viewall">View All →</button>
      </div>

      <div className="game-grid">
        {items.map((item) => (
          <GameCard
            key={item.id}
            game={item}
            isSelected={selectedGame?.id === item.id}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}
