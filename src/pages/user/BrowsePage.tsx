import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../../types/game";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../hooks/useAuth";
import GameGrid from "../../components/game/GameGrid";

export default function BrowsePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [searchParams] = useSearchParams();

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");

  // Keep in sync with searches submitted from the navbar
  useEffect(() => {
    const search = searchParams.get("search");
    if (search !== null) setQuery(search);
  }, [searchParams]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    const delay = query.trim() ? 300 : 0;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      setIsLoading(true);
      setError(null);

      const request = query.trim()
        ? gameService.search(query.trim())
        : gameService.getAll();

      request
        .then((data) => setGames(data))
        .catch(() => setError("Failed to load games. Please try again."))
        .finally(() => setIsLoading(false));
    }, delay);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, authLoading, isAuthenticated]);

  if (isLoading) return <div className="loading-screen">Loading games…</div>;

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h2 className="browse-title">Browse Games</h2>
        <div className="browse-search-bar">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            placeholder="Search games..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="browse-error">{error}</p>}

      <GameGrid
        items={games}
        selectedGame={selectedGame}
        onSelectItem={setSelectedGame}
      />
    </div>
  );
}
