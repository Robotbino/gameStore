import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePurchases } from "../../hooks/usePurchases";

const RECENT_LIMIT = 4;

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const { purchases, isLoading, error } = usePurchases();

  if (!currentUser || isLoading) {
    return (
      <div className="profile-page" role="status" aria-label="Loading profile">
        <h2 className="page-title">My Profile</h2>
        <div className="skeleton skeleton-card" />
        <div className="profile-stats">
          <div className="skeleton skeleton-stat" />
          <div className="skeleton skeleton-stat" />
        </div>
      </div>
    );
  }

  const recent = [...purchases]
    .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))
    .slice(0, RECENT_LIMIT);

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
          <span className="profile-stat-value">{currentUser.points}</span>
          <span className="profile-stat-label">Points</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{purchases.length}</span>
          <span className="profile-stat-label">Games owned</span>
        </div>
      </section>

      <section className="profile-section">
        <div className="profile-section-header">
          <h3>Recent purchases</h3>
          <Link to="/library" className="accent">
            View library
          </Link>
        </div>

        {error && <p className="alert alert-error">{error}</p>}

        {!error && recent.length === 0 ? (
          <p className="profile-empty">
            You haven't bought anything yet.{" "}
            <Link to="/browse" className="accent">
              Browse the store
            </Link>
            .
          </p>
        ) : (
          <ul className="profile-purchases">
            {recent.map((purchase) => (
              <li key={purchase.id}>
                <Link to={`/games/${purchase.game.id}`}>
                  {purchase.game.title}
                </Link>
                <span className="profile-purchase-date">
                  {new Date(purchase.purchaseDate).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
