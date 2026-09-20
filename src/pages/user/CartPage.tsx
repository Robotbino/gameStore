import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { purchaseService } from "../../services/purchaseService";
import { getApiErrorMessage } from "../../utils/apiError";

const REMOVE_MS = 150;

export default function CartPage() {
  const { items, total, remove, clear } = useCart();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Let the row fade before it leaves the list.
  function handleRemove(gameId: number) {
    setRemovingId(gameId);
    setTimeout(() => {
      remove(gameId);
      setRemovingId(null);
    }, REMOVE_MS);
  }

  async function handleCheckout() {
    if (isSubmitting || items.length === 0) return;
    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const result = await purchaseService.checkout(items.map((g) => g.id));

      // Games already owned aren't an error — report them, don't block.
      if (result.alreadyOwned.length > 0 && result.purchased.length === 0) {
        setNotice("You already own everything in this cart.");
      }

      clear();
      navigate("/library");
    } catch (err) {
      setError(getApiErrorMessage(err, "Checkout failed. Please try again."));
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="page-title">Your Cart</h2>
        {notice && <p className="alert alert-success">{notice}</p>}
        <div className="empty-state">
          <i className="fa-solid fa-cart-shopping empty-state-icon" aria-hidden="true" />
          <h3 className="empty-state-title">Your cart is empty</h3>
          <p className="empty-state-text">
            Games you add will show up here, ready for checkout.
          </p>
          <Link to="/browse" className="btn-primary">
            Browse the store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="page-title">Your Cart</h2>

      {error && <p className="alert alert-error">{error}</p>}

      <ul className="cart-list">
        {items.map((game) => (
          <li
            key={game.id}
            className={`cart-item ${removingId === game.id ? "is-removing" : ""}`}
          >
            <img className="cart-item-thumb" src={game.imageUrl} alt="" />
            <Link to={`/games/${game.id}`} className="cart-item-title">
              {game.title}
            </Link>
            <span className="cart-item-price">R {game.price.toFixed(2)}</span>
            <button
              className="btn-outline btn-sm"
              onClick={() => handleRemove(game.id)}
              aria-label={`Remove ${game.title}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-summary">
        <span className="cart-total">
          Total <strong>R {total.toFixed(2)}</strong>
        </span>
        <button
          className="btn-primary"
          onClick={handleCheckout}
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Processing…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
