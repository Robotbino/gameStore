import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../../types/game";
import type { Page } from "../../types/pagination";
import { emptyPage } from "../../types/pagination";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../hooks/useAuth";
import { useQuickLaunch } from "../../hooks/useQuickLaunch";
import GameGrid from "../../components/game/GameGrid";
import HeroSection from "../../components/game/HeroSection";
import Pagination from "../../components/Pagination";

const BROWSE_PAGE_SIZE = 12;

export default function BrowsePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { spotlight, interrupt } = useQuickLaunch();

  // The URL is the source of truth for the search term AND the page, so a
  // result page can be linked or refreshed, and the navbar can drive this page
  // by navigating to /browse?q=… while it is already mounted.
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [result, setResult] = useState<Page<Game>>(emptyPage(BROWSE_PAGE_SIZE));
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
  // this and the effect above from bouncing updates off each other. Writing
  // only `q` also drops `page`, which is what you want — results for a new
  // term start at page 1, not wherever the last term left off.
  useEffect(() => {
    if (query === urlQuery) return;

    const timeout = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, urlQuery, setSearchParams]);

  // Searching is now the backend's job: /games/all?q=… filters and pages in one
  // query, so this page no longer pulls the whole catalogue down to filter it
  // in the browser.
  useEffect(() => {
    if (authLoading || !isAuthenticated) return;

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    gameService
      .getPage({ q: urlQuery.trim(), page: urlPage, size: BROWSE_PAGE_SIZE })
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load games. Please try again.");
          setResult(emptyPage(BROWSE_PAGE_SIZE));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [urlQuery, urlPage, authLoading, isAuthenticated]);

  // Precedence, highest first: the carousel while it's running, then whatever
  // the user last clicked (which is what halted it), then the first result so
  // the banner isn't empty on a fresh load. `spotlight` already collapses the
  // first two — it hands back the clicked game once overridden.
  const heroGame = spotlight ?? selectedGame ?? result.content[0] ?? null;

  // One gesture, two jobs: highlight the card, and take the hero off the
  // carousel. The provider handles the halt and the 60s countdown.
  function handleSelect(game: Game) {
    setSelectedGame(game);
    interrupt(game);
  }

  function goToPage(next: number) {
    const params: Record<string, string> = {};
    if (urlQuery) params.q = urlQuery;
    if (next > 0) params.page = String(next);
    // A push, not a replace: paging is navigation, so Back should undo it.
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="browse-page">
      {/* The other half of the carousel. Rendering it only when there's a game
          keeps the page from reserving a 21:9 gap on an empty search. */}
      {heroGame && <HeroSection item={heroGame} />}

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
        <div
          className="game-grid"
          role="status"
          aria-label="Loading games"
        >
          {Array.from({ length: BROWSE_PAGE_SIZE }).map((_, i) => (
            <div key={i} className="game-card-skeleton" aria-hidden="true">
              <div className="game-card-skeleton-poster" />
              <div className="game-card-skeleton-line" />
              <div className="game-card-skeleton-line short" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <GameGrid
            items={result.content}
            // Highlight whatever the hero is showing, so the carousel visibly
            // walks the grid instead of the two disagreeing.
            selectedGame={heroGame}
            onSelectItem={handleSelect}
          />
          <Pagination page={result} onPageChange={goToPage} label="games" />
        </>
      )}
    </div>
  );
}
