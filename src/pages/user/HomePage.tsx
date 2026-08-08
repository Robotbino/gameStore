import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { gameService } from "../../services/gameService";
import type { Game } from "../../types/game";
import HeroSection from "../../components/game/HeroSection.tsx";
import GameGrid from "../../components/game/GameGrid.tsx";

// The landing grid is a showcase, not the catalogue — one page is the whole
// point of it. Anything past this belongs on /browse, which can actually page.
const HOME_PAGE_SIZE = 12;

export default function HomePage() {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameService
      .getPage({ size: HOME_PAGE_SIZE })
      .then((page) => {
        setGames(page.content);
        setTotal(page.totalElements);
        if (page.content.length > 0) setSelectedGame(page.content[0]);
      })
      .catch(() => setError("Failed to load games. Please try again."))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <div className="loading-screen">Loading games…</div>;
  if (error) return <div className="error-state"><p style={{ color: "var(--text-muted)" }}>{error}</p></div>;
  if (!selectedGame) return <div className="empty-state"><p style={{ color: "var(--text-muted)" }}>No games available.</p></div>;

  return (
    <>
      <HeroSection item={selectedGame} />
      <GameGrid
        items={games}
        heading="Available Games"
        selectedGame={selectedGame}
        onSelectItem={setSelectedGame}
        // Only offer "View All" when there is genuinely more behind it.
        onViewAll={total > games.length ? () => navigate("/browse") : undefined}
      />
    </>
  );
}
