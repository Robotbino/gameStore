import type { Game } from "../../types/game";
import GameCard from "../GameCard";

interface GameGridProps {
  items: Game[];
  heading?: string;
  selectedGame: Game | null;
  onSelectItem: (game: Game) => void;
  onViewAll?: () => void;
}

export default function GameGrid({
  items,
  heading,
  selectedGame,
  onSelectItem,
  onViewAll,
}: GameGridProps) {
  if (items.length === 0) {
    return (
      <section>
        {heading && <h2 className="game-grid-title">{heading}</h2>}
        <p style={{ color: "var(--text-muted)" }}>No games found.</p>
      </section>
    );
  }

  return (
    <section>
      {heading && (
        <div className="game-grid-header">
          <h2 className="game-grid-title">{heading}</h2>
          {onViewAll && (
            <button className="game-grid-viewall" onClick={onViewAll}>
              View All →
            </button>
          )}
        </div>
      )}

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
