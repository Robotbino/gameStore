import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Game } from "../../types/game";
import { purchaseService } from "../../services/purchaseService";
import GameGrid from "../../components/game/GameGrid";

export default function LibraryPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only the games this user actually bought — GET /purchases/me returns
  // Purchase rows, so pull the nested game out of each. Previously this called
  // gameService.getAll() and showed the entire catalogue as "yours".
  useEffect(() => {
    purchaseService
      .getMine()
      .then((purchases) => setGames(purchases.map((p) => p.game)))
      .catch(() => setError("Failed to load your library."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="loading-screen">Loading library…</div>;

  return (
    <div className="library-page">
      <h2 className="page-title">My Library</h2>

      {error && <p className="browse-error">{error}</p>}

      {!error && games.length === 0 ? (
        <div className="empty-state">
          <p style={{ color: "var(--text-muted)" }}>
            Your library is empty.{" "}
            <Link to="/browse" className="accent">
              Browse the store
            </Link>{" "}
            to find your next game.
          </p>
        </div>
      ) : (
        <GameGrid
          items={games}
          selectedGame={selectedGame}
          onSelectItem={setSelectedGame}
        />
      )}
    </div>
  );
}
