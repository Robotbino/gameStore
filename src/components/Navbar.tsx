import { useEffect, useState } from "react";
import { useNavigate, NavLink, useLocation, useSearchParams } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useCart } from "../hooks/useCart";

interface NavBarProps {
  // The cart is a customer-store affordance. AppLayout leaves this default;
  // AdminLayout passes false so the back-office console stays cart-free —
  // gating on layout, not role, because an admin browsing the store still shops.
  showCart?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

export default function NavBar({ showCart = true }: NavBarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { count } = useCart();

  // The URL's ?q= is the source of truth: Browse reads it, and this box mirrors
  // it so Back, Clear and a shared link all keep the input honest.
  const onBrowse = pathname === "/browse";
  const urlQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(urlQuery);

  useEffect(() => {
    setQuery(urlQuery);
  }, [urlQuery]);

  // On Browse, typing filters live after a pause. Writing only `q` drops
  // `page`, so a new term always starts from the first page.
  useEffect(() => {
    if (!onBrowse || query === urlQuery) return;
    const timer = setTimeout(() => {
      setSearchParams(query ? { q: query } : {}, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, urlQuery, onBrowse, setSearchParams]);

  // Anywhere else, submitting hands the term to Browse.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/browse?q=${encodeURIComponent(term)}` : "/browse");
  }

  return (
    <nav className="navbar">
      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <i className="fa-solid fa-magnifying-glass search-icon" aria-hidden="true" />
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
