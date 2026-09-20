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
          <i className="fa-solid fa-gamepad empty-state-icon" aria-hidden="true" />
          <h3 className="empty-state-title">Your library is empty</h3>
          <p className="empty-state-text">
            Games you buy will show up here. Find your next one in the store.
          </p>
          <Link to="/browse" className="btn-primary">
            Browse the store
          </Link>
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
