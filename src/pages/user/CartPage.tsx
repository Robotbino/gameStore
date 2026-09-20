import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import CheckoutModal from "../../components/checkout/CheckoutModal";
import { canRedeem, formatPoints, formatRand, pointsEarned, randsFor } from "../../utils/rewards";
import type { Order } from "../../types/order";

const REMOVE_MS = 150;

export default function CartPage() {
  const { items, total, remove, clear } = useCart();
  const { currentUser, refreshCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Let the row fade before it leaves the list.
  function handleRemove(gameId: number) {
    setRemovingId(gameId);
    setTimeout(() => {
      remove(gameId);
      setRemovingId(null);
    }, REMOVE_MS);
  }

  async function handleSuccess(order: Order) {
    setCheckoutOpen(false);
    clear();
    await refreshCurrentUser();
    navigate("/library", { state: { orderRef: order.paymentReference } });
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <h2 className="page-title">Your Cart</h2>
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

  const balance = currentUser?.points ?? 0;

  return (
    <div className="cart-page">
      <h2 className="page-title">Your Cart</h2>

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
            <span className="cart-item-price">{formatRand(game.price)}</span>
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

      <p className="cart-rewards-hint">
        <span>
          Earn <span className="accent">+{formatPoints(pointsEarned(total))} pts</span> on this order
        </span>
        {canRedeem(balance) && (
          <span>
            You have <span className="accent">{formatRand(randsFor(balance))}</span> in rewards to spend
          </span>
        )}
      </p>

      <div className="cart-summary">
        <span className="cart-total">
          Total <strong>{formatRand(total)}</strong>
        </span>
        <button className="btn-primary" onClick={() => setCheckoutOpen(true)}>
          Checkout
        </button>
      </div>

      <CheckoutModal
        open={checkoutOpen}
        items={items}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
