import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import type { Game } from "../../types/game";
import type { Page } from "../../types/pagination";
import { emptyPage } from "../../types/pagination";
import { gameService } from "../../services/gameService";
import { useAuth } from "../../hooks/useAuth";
import { useQuickLaunch } from "../../hooks/useQuickLaunch";
import GameGrid from "../../components/game/GameGrid";
import GameGridSkeleton from "../../components/game/GameGridSkeleton";
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
  // A search is active once the URL carries a real term. Gating on the URL,
  // not on the navbar's keystrokes, means the hero comes and goes exactly
  // once per search rather than flickering while the user types.
  const isSearching = urlQuery.trim() !== "";

  const [result, setResult] = useState<Page<Game>>(emptyPage(BROWSE_PAGE_SIZE));
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <div className="browse-page">
      {/* The other half of the carousel. Not rendered at all during a search,
          so the results start at the top of the page instead of below a 21:9
          banner — and not rendered on an empty catalogue either, so no gap. */}
      {!isSearching && heroGame && <HeroSection item={heroGame} />}

      <div className="browse-header">
        <h2 className="browse-title">Browse Games</h2>
        {isSearching && (
          <p className="browse-caption" aria-live="polite">
            {result.totalElements} {result.totalElements === 1 ? "result" : "results"} for{" "}
            <strong>“{urlQuery}”</strong>
          </p>
        )}
      </div>

      {error && <p className="alert alert-error">{error}</p>}

      {/* Only the results swap out while loading, so the navbar search keeps
          focus while the user types. */}
      {isLoading ? (
        <GameGridSkeleton count={BROWSE_PAGE_SIZE} />
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
