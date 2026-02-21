import { useState, useEffect } from "react";
import type { Game } from "../assets/gameData";

interface HeroSectionProps {
  item: Game;
}

export default function HeroSection({ item }: HeroSectionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayGame, setDisplayGame] = useState<Game>(item);

  useEffect(() => {
    if (item.id !== displayGame.id) {
      setIsTransitioning(true);

      const timeout = setTimeout(() => {
        setDisplayGame(item);
        setIsTransitioning(false);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [item, displayGame.id]);

  return (
    <div className="hero-container">
      <img
        src={displayGame.imageUrl}
        alt={displayGame.title}
        className={`hero-image ${isTransitioning ? "transitioning" : ""}`}
      />
      <div className="hero-gradient" />

      <div className={`hero-content ${isTransitioning ? "transitioning" : ""}`}>
        <span className="hero-genre">{displayGame.genre}</span>
        <h1 className="hero-title">{displayGame.title}</h1>
        <p className="hero-description">{displayGame.description}</p>

        <div className="hero-actions">
          <button className="btn-primary">
            Buy Now — R {displayGame.price.toFixed(2)}
          </button>
          <button className="btn-outline">+ Wishlist</button>
        </div>
      </div>
    </div>
  );
}
