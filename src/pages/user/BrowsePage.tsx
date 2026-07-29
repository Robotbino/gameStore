import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../../types/game";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../hooks/useAuth";
import GameGrid from "../../components/game/GameGrid";

export default function BrowsePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // The URL is the source of truth for the search term, so a result page can be
  // linked or refreshed, and the navbar can drive this page by navigating to
  // /browse?q=… while it is already mounted.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";

  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [query, setQuery] = useState(urlQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mirror URL changes that came from somewhere else (navbar, back button)
  // into the input.
  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // Commit typing to the URL after a pause. The equality guard is what stops
  // this and the effect above from bouncing updates off each other.
  useEffect(() => {
    if (query === urlQuery) return;

    const timeout = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, urlQuery, setSearchParams]);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    const term = urlQuery.trim();
    const request = term ? gameService.search(term) : gameService.getAll();

    request
      .then((data) => {
        if (!cancelled) setGames(data);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load games. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [urlQuery, authLoading, isAuthenticated]);

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
            aria-label="Search games"
          />
        </div>
      </div>

      {error && <p className="browse-error">{error}</p>}

      {/* Only the results swap out while loading. Returning early here instead
          would unmount the input above and drop focus on every keystroke. */}
      {isLoading ? (
        <p className="browse-status">Loading games…</p>
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
