import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useCart } from "../hooks/useCart";

interface NavBarProps {
  // The cart is a customer-store affordance. AppLayout leaves this default;
  // AdminLayout passes false so the back-office console stays cart-free —
  // gating on layout, not role, because an admin browsing the store still shops.
  showCart?: boolean;
}

export default function NavBar({ showCart = true }: NavBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { count } = useCart();

  // BrowsePage owns the actual searching; the navbar just hands it a term via
  // the URL so the result is linkable and survives a refresh.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/browse?q=${encodeURIComponent(term)}` : "/browse");
  }

  return (
    <nav className="navbar">
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search games"
        />
      </form>

      {/* Right cluster: the cart (a store action) and the profile — the two
          things a signed-in shopper reaches for. Identity (name + role) lives
          inside the avatar's dropdown, so the bar stays uncluttered. */}
      <div className="navbar-actions">
        {showCart && (
          <NavLink
            to="/cart"
            className="nav-cart"
            aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
          >
            <i className="fa-solid fa-cart-shopping" />
            {count > 0 && (
              <span className="nav-cart-badge" aria-hidden="true">
                {count > 99 ? "99+" : count}
              </span>
            )}
          </NavLink>
        )}
        <UserAvatar />
      </div>
    </nav>
  );
}
