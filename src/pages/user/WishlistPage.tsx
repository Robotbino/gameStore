import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Game } from "../../types/game";
import { useWishlist } from "../../hooks/useWishlist";
import GameGrid from "../../components/game/GameGrid";
import GameGridSkeleton from "../../components/game/GameGridSkeleton";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { items, isLoading } = useWishlist();
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const games = items.map((item) => item.game);

  return (
    <div className="wishlist-page">
      <h2 className="page-title">My Wishlist</h2>

      {isLoading ? (
        <GameGridSkeleton count={8} />
      ) : games.length === 0 ? (
        <div className="empty-state">
          <i className="fa-regular fa-heart empty-state-icon" aria-hidden="true" />
          <h3 className="empty-state-title">Nothing wishlisted yet</h3>
          <p className="empty-state-text">
            Tap the heart on any game to save it here for later.
          </p>
          <Link to="/browse" className="btn-primary">
            Browse the store
          </Link>
        </div>
      ) : (
        <GameGrid
          items={games}
          selectedGame={selectedGame}
          onSelectItem={(game) => {
            setSelectedGame(game);
            navigate(`/games/${game.id}`);
          }}
        />
      )}
    </div>
  );
}
