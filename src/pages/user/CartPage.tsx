import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { purchaseService } from "../../services/purchaseService";
import { getApiErrorMessage } from "../../utils/apiError";

export default function CartPage() {
  const { items, total, remove, clear } = useCart();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

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
      // Land on the library so the purchase is immediately visible.
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
        {notice && <p className="browse-status">{notice}</p>}
        <div className="empty-state">
          <p style={{ color: "var(--text-muted)" }}>
            Your cart is empty.{" "}
            <Link to="/browse" className="accent">
              Browse the store
            </Link>{" "}
            to add a game.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="page-title">Your Cart</h2>

      {error && <p className="browse-error">{error}</p>}

      <ul className="cart-list" style={{ listStyle: "none", padding: 0 }}>
        {items.map((game) => (
          <li
            key={game.id}
            className="cart-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "0.75rem 0",
              borderBottom: "1px solid var(--border, #334155)",
            }}
          >
            <img
              src={game.imageUrl}
              alt={game.title}
              style={{
                width: 64,
                height: 64,
                objectFit: "cover",
                borderRadius: 8,
              }}
            />
            <span style={{ flex: 1, fontWeight: 600 }}>{game.title}</span>
            <span style={{ minWidth: 90, textAlign: "right" }}>
              R {game.price.toFixed(2)}
            </span>
            <button
              className="btn-outline"
              onClick={() => remove(game.id)}
              aria-label={`Remove ${game.title}`}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div
        className="cart-summary"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.5rem",
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>
          Total: R {total.toFixed(2)}
        </strong>
        <button
          className="btn-primary"
          onClick={handleCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
