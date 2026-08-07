import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { gameService } from "../services/gameService";
import { useCart } from "../hooks/useCart";
import type { Game } from "../types/game";

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Every entry here must correspond to a route in AppRoutes — anything else
// falls through to the catch-all and bounces the user somewhere confusing.
const navItems = [
  { icon: "fa-solid fa-house", label: "Home", to: "/" },
  { icon: "fa-solid fa-bullseye", label: "Browse", to: "/browse" },
  { icon: "fa-solid fa-cart-shopping", label: "Cart", to: "/cart" },
  { icon: "fa-solid fa-book", label: "Library", to: "/library" },
];

export default function SideBar({ isOpen, onToggle }: SideBarProps) {
  const navigate = useNavigate();
  const { count } = useCart();
  const [games, setGames] = useState<Game[]>([]);

  // Quick Launch used to render the bundled gameData.ts fixture, so it showed
  // games that aren't in the database. Pull the real catalogue instead, and
  // stay silent on failure — this strip is decorative, not worth an error state.
  useEffect(() => {
    let cancelled = false;

    gameService
      .getAll()
      .then((data) => {
        if (!cancelled) setGames(data.slice(0, 3));
      })
      .catch(() => {
        if (!cancelled) setGames([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      <div className="sidebar-header">
        {isOpen && (
          <span className="sidebar-brand">
            Game<span className="accent">Store</span>
          </span>
        )}
        <button className="sidebar-toggle" onClick={onToggle}>
          ☰
        </button>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.label}>
            {/* NavLink, not <a href> — a plain anchor triggers a full page
                reload, which remounts the app and throws away auth state. */}
            <NavLink to={item.to} className="sidebar-nav-item" end>
              <i className={`${item.icon} nav-icon`} />
              {isOpen && <span>{item.label}</span>}
              {item.to === "/cart" && count > 0 && (
                <span
                  className="cart-badge"
                  style={{
                    marginLeft: "auto",
                    background: "var(--accent, #7c3aed)",
                    color: "#fff",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.05rem 0.45rem",
                    minWidth: "1.2rem",
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </NavLink>
          </li>
        ))}
      </ul>

      {isOpen && games.length > 0 && (
        <div className="quick-launch">
          <span className="quick-launch-label">Quick Launch</span>
          <div className="quick-launch-list">
            {games.map((game) => (
              <div
                key={game.id}
                className="quick-launch-item"
                onClick={() => navigate(`/games/${game.id}`)}
              >
                <img src={game.imageUrl} alt={game.title} />
                <span>{game.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
