import { NavLink, useLocation } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import SearchBar from "./search/SearchBar";
import { useCart } from "../hooks/useCart";
import { isSearchableRoute } from "../routes/searchableRoutes";

interface NavBarProps {
  // The cart is a customer-store affordance. AppLayout leaves this default;
  // AdminLayout passes false so the back-office console stays cart-free —
  // gating on layout, not role, because an admin browsing the store still shops.
  showCart?: boolean;
}

export default function NavBar({ showCart = true }: NavBarProps) {
  const { pathname } = useLocation();
  const { count } = useCart();

  return (
    <nav className="navbar">
      {/* Search belongs to the store's browsing pages only; the allowlist in
          routes/searchableRoutes.ts decides. Off those routes the middle
          column simply stays empty, so the action cluster doesn't move. */}
      {isSearchableRoute(pathname) && <SearchBar />}

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
