import { useState, useEffect } from "react";
import type { Game } from "../../types/game";

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
      {/* heroImage, not imageUrl — imageUrl is the 2:3 portrait capsule the
          card grid uses, and cropping that into a 21:9 banner leaves a thin
          strip of the middle. GameDetailsPage picks the same way. */}
      <img
        src={displayGame.heroImage || displayGame.imageUrl}
        alt={displayGame.title}
        className={`hero-image ${isTransitioning ? "transitioning" : ""}`}
      />
      <div className="hero-gradient" />

      <div className={`hero-content ${isTransitioning ? "transitioning" : ""}`}>
        <span className="hero-genre">
          {Array.isArray(displayGame.genre) ? displayGame.genre.join(", ") : displayGame.genre}
        </span>
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
