import { useState, useEffect } from "react";
import type { Game } from "../../types/game";
import { gameService } from "../../services/gameService";
import GameGrid from "../../components/game/GameGrid";

export default function BrowsePage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = query
      ? gameService.search(query)
      : gameService.getAll();

    fetch.then((data) => {
      setGames(data);
      setIsLoading(false);
    });
  }, [query]);

  if (isLoading) return <div className="loading-screen">Loading games…</div>;

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h2 className="page-title">Browse Games</h2>
        <div className="search-bar">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <GameGrid
        items={games}
        heading=""
        selectedGame={selectedGame}
        onSelectItem={setSelectedGame}
      />
    </div>
  );
}
