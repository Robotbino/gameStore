import { useState } from "react";
import type { Game } from "../types/game";
import { useWishlist } from "../hooks/useWishlist";

interface WishlistButtonProps {
  game: Game;
  /** "icon" is the small heart on a card; "labelled" is the full button on a hero. */
  variant?: "icon" | "labelled";
}

// How long the heart pops when it lights up.
const POP_MS = 300;

export default function WishlistButton({ game, variant = "labelled" }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const [isPopping, setIsPopping] = useState(false);
  const wished = has(game.id);

  async function handleClick(e: React.MouseEvent) {
    // On a card, the heart must not also select the card.
    e.stopPropagation();
    if (!wished) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), POP_MS);
    }
    await toggle(game);
  }

  const label = wished ? "Remove from wishlist" : "Add to wishlist";

  return (
    <button
      type="button"
      className={`wishlist-btn wishlist-btn-${variant} ${wished ? "is-wished" : ""} ${
        isPopping ? "is-popping" : ""
      }`}
      onClick={handleClick}
      aria-pressed={wished}
      aria-label={variant === "icon" ? label : undefined}
      title={variant === "icon" ? label : undefined}
    >
      <i className={`${wished ? "fa-solid" : "fa-regular"} fa-heart`} aria-hidden="true" />
      {variant === "labelled" && <span>{wished ? "Wishlisted" : "Wishlist"}</span>}
    </button>
  );
}
