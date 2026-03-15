import { useState, useEffect } from "react";
import { gameService } from "../../services/gameService";
import type { Game } from "../../types/game";
import HeroSection from "../../components/game/HeroSection.tsx";
import GameGrid from "../../components/game/GameGrid.tsx";

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    gameService.getAll().then((data) => {
      setGames(data);
      if (data.length > 0) setSelectedGame(data[0]);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <div className="loading-screen">Loading games…</div>;
  if (!selectedGame) return null;

  return (
    <>
      <HeroSection item={selectedGame} />
      <GameGrid
        items={games}
        heading="Available Games"
        selectedGame={selectedGame}
        onSelectItem={setSelectedGame}
      />
    </>
  );
}
