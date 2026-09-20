import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePurchases } from "../../hooks/usePurchases";
import { useOrders } from "../../hooks/useOrders";
import { useRewards } from "../../hooks/useRewards";
import { formatPoints, formatRand } from "../../utils/rewards";
import type { RewardTransaction } from "../../types/rewards";

const RECENT_LIMIT = 5;

function describe(tx: RewardTransaction): string {
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

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { purchases, isLoading: purchasesLoading } = usePurchases();
  const { orders, isLoading: ordersLoading, error: ordersError } = useOrders();
  const { rewards, isLoading: rewardsLoading, error: rewardsError } = useRewards();

  if (!currentUser || purchasesLoading || ordersLoading || rewardsLoading) {
    return (
      <div className="profile-page" role="status" aria-label="Loading profile">
        <h2 className="page-title">My Profile</h2>
        <div className="skeleton skeleton-card" />
        <div className="profile-stats">
          <div className="skeleton skeleton-stat" />
          <div className="skeleton skeleton-stat" />
          <div className="skeleton skeleton-stat" />
        </div>
      </div>
    );
  }

  const balance = rewards?.balance ?? currentUser.points;
  const worth = rewards?.worth ?? 0;
  const transactions = (rewards?.transactions ?? []).slice(0, RECENT_LIMIT);
  const recentOrders = orders.slice(0, RECENT_LIMIT);

  return (
    <div className="profile-page">
      <h2 className="page-title">My Profile</h2>

      <section className="profile-card">
        <div className="profile-avatar">
          {currentUser.userName.charAt(0).toUpperCase()}
        </div>
        <div className="profile-identity">
          <h3 className="profile-name">{currentUser.userName}</h3>
          <p className="profile-email">{currentUser.email}</p>
          <span className={`role-badge ${currentUser.role.toLowerCase()}`}>
            {currentUser.role}
          </span>
        </div>
        <Link to="/settings" className="btn-outline">
          Edit account
        </Link>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{formatPoints(balance)}</span>
          <span className="profile-stat-label">Points</span>
          <span className="profile-stat-sub">worth {formatRand(worth)}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{purchases.length}</span>
          <span className="profile-stat-label">Games owned</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{orders.length}</span>
          <span className="profile-stat-label">Orders</span>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h3>Rewards</h3>
          <span className="profile-stat-sub">10 pts per R1 · 100 pts = R1 off</span>
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
          <ul className="profile-rewards-list">
            {transactions.map((tx) => (
              <li key={tx.id}>
                <span className={`reward-delta ${tx.delta >= 0 ? "is-plus" : "is-minus"}`}>
                  {tx.delta >= 0 ? "+" : "−"}
                  {formatPoints(Math.abs(tx.delta))}
                </span>
                <span className="reward-reason">{describe(tx)}</span>
                <span className="reward-date">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h3>Recent orders</h3>
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
