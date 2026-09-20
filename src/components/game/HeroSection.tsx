import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../../types/game";
import { useCart } from "../../hooks/useCart";
import { usePurchases } from "../../hooks/usePurchases";
import WishlistButton from "../WishlistButton";

interface HeroSectionProps {
  item: Game;
}

// How long the incoming art gets to settle before the outgoing layer is dropped.
const SWAP_MS = 500;

export default function HeroSection({ item }: HeroSectionProps) {
  const navigate = useNavigate();
  const { add, has: inCart } = useCart();
  const { owns } = usePurchases();

  // Two image layers: the previous art stays underneath while the new one
  // fades in on top, so the swap is a true crossfade with no dark gap.
  const [current, setCurrent] = useState<Game>(item);
  const [previous, setPrevious] = useState<Game | null>(null);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (item.id === current.id) return;
    setPrevious(current);
    setCurrent(item);
    setIsLive(false);
  }, [item, current]);

  // Go live once the new image has decoded, or after a short grace period so a
  // cached image that skipped onLoad can never leave the hero blank.
  useEffect(() => {
    if (isLive) return;
    const timer = setTimeout(() => setIsLive(true), SWAP_MS);
    return () => clearTimeout(timer);
  }, [isLive, current.id]);

  useEffect(() => {
    if (!isLive || !previous) return;
    const timer = setTimeout(() => setPrevious(null), SWAP_MS);
    return () => clearTimeout(timer);
  }, [isLive, previous]);

  const genre = Array.isArray(current.genre) ? current.genre.join(", ") : current.genre;

  return (
    <div className="hero-container">
      {previous && (
        <img
          key={previous.id}
          src={previous.heroImage || previous.imageUrl}
          alt=""
          aria-hidden="true"
          className="hero-image is-live"
        />
      )}
      {/* heroImage, not imageUrl: imageUrl is the 2:3 portrait capsule. */}
      <img
        key={current.id}
        src={current.heroImage || current.imageUrl}
        alt={current.title}
        className={`hero-image ${isLive ? "is-live" : ""}`}
        onLoad={(e) => {
          e.currentTarget
            .decode()
            .catch(() => undefined)
            .finally(() => setIsLive(true));
        }}
      />
      <div className="hero-gradient" />

      <div className="hero-content" key={current.id}>
        <span className="hero-genre">{genre}</span>
        <h1 className="hero-title">{current.title}</h1>
        <p className="hero-description">{current.description}</p>

        <div className="hero-actions">
          {owns(current.id) ? (
            <button className="btn-primary" disabled>
              ✓ In Library
            </button>
          ) : inCart(current.id) ? (
            <button className="btn-primary" onClick={() => navigate("/cart")}>
              In Cart — View Cart
            </button>
          ) : (
            <button className="btn-primary" onClick={() => add(current)}>
              Add to Cart — R {current.price.toFixed(2)}
            </button>
          )}
          <WishlistButton game={current} />
        </div>
      </div>
    </div>
  );
}
