import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { purchaseService } from "../../services/purchaseService";
import { useOrders } from "../../hooks/useOrders";
import { useRewards } from "../../hooks/useRewards";
import { displayNameOf } from "../../types/user";
import { countryName } from "../../utils/country";
import { formatPoints, formatRand } from "../../utils/rewards";
import type { RewardTransaction } from "../../types/rewards";
import AvatarMark from "../../components/account/AvatarMark";

const RECENT_LIMIT = 5;

function describeTransaction(tx: RewardTransaction): string {
  const on = tx.orderId ? ` on order #${tx.orderId}` : "";
  switch (tx.reason) {
    case "EARN":
      return `Earned${on}`;
    case "REDEEM":
      return `Redeemed${on}`;
    default:
      return "Adjusted by an admin";
  }
}

/**
 * The read side of the account area. Everything editable lives one click away
 * on /settings, so this page can be scanned rather than filled in.
 */
export default function ProfilePage() {
  const { currentUser, userRole } = useAuth();
  const [ownedCount, setOwnedCount] = useState<number | null>(null);
  const { orders, error: ordersError } = useOrders();
  const { rewards, error: rewardsError } = useRewards();

  // The library count is the one number here the user record doesn't carry.
  // A failure leaves it null and the tile renders an em dash — a broken stat
  // shouldn't take the whole page down with it.
  useEffect(() => {
    let cancelled = false;
    purchaseService
      .getMine()
      .then((purchases) => {
        if (!cancelled) setOwnedCount(purchases.length);
      })
      .catch(() => {
        if (!cancelled) setOwnedCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ProtectedRoute has already established there's a session; this covers the
  // frame where /users/me is still in flight.
  if (!currentUser) {
    return <div className="loading-screen">Loading profile…</div>;
  }

  const name = displayNameOf(currentUser);
  const region = countryName(currentUser.country);
  // The ledger is authoritative when it loads; the user record is the fallback
  // so the tile never blanks while /rewards/me is in flight or failing.
  const balance = rewards?.balance ?? currentUser.points;
  const worth = rewards?.worth ?? 0;
  const transactions = (rewards?.transactions ?? []).slice(0, RECENT_LIMIT);
  const recentOrders = orders.slice(0, RECENT_LIMIT);

  return (
    <div className="account-page">
      <h2 className="page-title">Profile</h2>

      <section className="profile-header">
        <AvatarMark
          avatarKey={currentUser.avatarKey}
          name={name}
          size="88px"
          className="profile-avatar"
        />

        <div className="profile-identity">
          <h3 className="profile-name">{name}</h3>
          {/* The handle is shown separately because displayName can be
              anything — without this there'd be no way to see the unique
              name the account is actually keyed on. */}
          <p className="profile-handle">@{currentUser.userName}</p>

          <div className="profile-meta">
            {userRole && (
              <span className={`role-badge ${userRole.toLowerCase()}`}>
                {userRole}
              </span>
            )}
            {region && <span className="profile-meta-item">{region}</span>}
            <span className="profile-meta-item">
              Member since {formatJoined(currentUser.createdAt)}
            </span>
          </div>
        </div>

        <Link to="/settings" className="btn-outline profile-edit">
          Edit profile
        </Link>
      </section>

      {currentUser.bio ? (
        <p className="profile-bio">{currentUser.bio}</p>
      ) : (
        <p className="profile-bio is-empty">
          No bio yet.{" "}
          <Link to="/settings" className="accent">
            Add one
          </Link>
          .
        </p>
      )}

      <section className="stats-grid profile-stats">
        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Games owned</span>
            <span className="stat-value">{ownedCount ?? "—"}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Rewards points</span>
            <span className="stat-value">{formatPoints(balance)}</span>
            {/* Points are a simulated rewards balance (PRODUCT.md): earned at
                10 per R1 spent, redeemable at 100 per R1 off at checkout. */}
            <span className="stat-note">worth {formatRand(worth)} off your next order</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <span className="stat-label">Orders</span>
            <span className="stat-value">{orders.length}</span>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <h3 className="profile-section-title">Rewards</h3>
          <span className="profile-section-hint">10 pts per R1 · 100 pts = R1 off</span>
        </div>

        {rewardsError && <p className="alert alert-error">{rewardsError}</p>}

        {!rewardsError && transactions.length === 0 ? (
          <p className="profile-empty">
            Buy a game to start earning 10 points per R1.{" "}
            <Link to="/browse" className="accent">
              Browse the store
            </Link>
            .
          </p>
        ) : (
          <ul className="profile-ledger">
            {transactions.map((tx) => (
              <li key={tx.id}>
                <span className={`reward-delta ${tx.delta >= 0 ? "is-plus" : "is-minus"}`}>
                  {tx.delta >= 0 ? "+" : "−"}
                  {formatPoints(Math.abs(tx.delta))}
                </span>
                <span className="reward-reason">{describeTransaction(tx)}</span>
                <span className="reward-date">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <div className="profile-section-head">
          <h3 className="profile-section-title">Recent orders</h3>
          <Link to="/library" className="accent">
            View library
          </Link>
        </div>

        {ordersError && <p className="alert alert-error">{ordersError}</p>}

        {!ordersError && recentOrders.length === 0 ? (
          <p className="profile-empty">
            You haven't bought anything yet.{" "}
            <Link to="/browse" className="accent">
              Browse the store
            </Link>
            .
          </p>
        ) : (
          <ul className="profile-orders">
            {recentOrders.map((order) => (
              <li key={order.id}>
                <div className="profile-order-main">
                  <strong>
                    Order #{order.id} · {order.items.length}{" "}
                    {order.items.length === 1 ? "game" : "games"}
                  </strong>
                  <span>{order.items.map((item) => item.title).join(", ")}</span>
                </div>
                <span className="reference-chip">{order.paymentReference}</span>
                <span className="profile-order-total">{formatRand(order.total)}</span>
                <span className="profile-order-date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

/**
 * "March 2026" rather than a full date: the day someone signed up is noise,
 * and a bare month-and-year can't be misread as an account-activity timestamp.
 */
function formatJoined(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
