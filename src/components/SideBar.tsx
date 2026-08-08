import { NavLink, Link, useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";
import { useAuth } from "../hooks/useAuth";
import { useQuickLaunch } from "../hooks/useQuickLaunch";

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Every entry here must correspond to a route in AppRoutes — anything else
// falls through to the catch-all and bounces the user somewhere confusing.
// Cart deliberately isn't here: it's a user-scoped action, not a place, so it
// lives in the navbar action cluster where it survives a collapsed sidebar.
const navItems = [
  { icon: "fa-solid fa-house", label: "Home", to: "/" },
  { icon: "fa-solid fa-bullseye", label: "Browse", to: "/browse" },
  { icon: "fa-solid fa-book", label: "Library", to: "/library" },
];

export default function SideBar({ isOpen, onToggle }: SideBarProps) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  // Quick Launch is the user's own shelf, not the store: the list comes from
  // GET /purchases/me via QuickLaunchProvider, so an unowned game can't appear
  // here. It used to render the catalogue's first few rows, which meant the
  // strip was offering games the user hadn't bought.
  const { library, activeId, cycle, cycleMs } = useQuickLaunch();

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
            </NavLink>
          </li>
        ))}
      </ul>

      {isOpen && library.length > 0 && (
        <div className="quick-launch">
          <span className="quick-launch-label">Quick Launch</span>
          <div className="quick-launch-list">
            {library.map((game) => {
              const isFilling = game.id === activeId;

              return (
                <div
                  key={game.id}
                  className={`quick-launch-item ${isFilling ? "is-filling" : ""}`}
                  // Two identical keyframes alternating by turn. A CSS animation
                  // only restarts when its NAME changes, and on a one-game
                  // library the class never leaves this row — so without the
                  // flip the fill would play once and stay full forever. This
                  // beats the usual remove-class/force-reflow/re-add trick:
                  // no imperative DOM, no remount, no image flash.
                  data-phase={cycle % 2 === 0 ? "a" : "b"}
                  // The 8s lives in one place (CYCLE_MS) and is handed to CSS
                  // here, so the fill and the timer cannot drift apart by
                  // someone editing one and forgetting the other.
                  style={{ "--ql-cycle": `${cycleMs}ms` } as CSSProperties}
                  onClick={() => navigate(`/games/${game.id}`)}
                >
                  <img src={game.imageUrl} alt={game.title} />
                  <span>{game.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Surface switch — only admins can cross into the console, so it only
          shows for them. Pinned to the bottom so it reads as "leave this
          surface", not another store destination. */}
      {isAdmin && (
        <div className="sidebar-footer">
          <Link
            to="/admin"
            className="sidebar-switch"
            title="Switch to the admin console"
          >
            <i className="fa-solid fa-gauge-high nav-icon" />
            {isOpen && <span>Admin console</span>}
          </Link>
        </div>
      )}
    </aside>
  );
}
