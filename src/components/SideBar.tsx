import { NavLink } from "react-router-dom";
import gameData from "../assets/gameData";

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SideBar({ isOpen, onToggle }: SideBarProps) {
  const games = gameData.games;
  const navItems = [
    { icon: "fa-solid fa-house", label: "Home", href: "/" },
    { icon: "fa-solid fa-bullseye", label: "Browse", href: "/browse" },
    { icon: "fa-solid fa-book", label: "Library", href: "/library" },
  ];

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
            <NavLink to={item.href} className="sidebar-nav-item" end>
              <i className={`${item.icon} nav-icon`} />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>

      {isOpen && (
        <div className="quick-launch">
          <span className="quick-launch-label">Quick Launch</span>
          <div className="quick-launch-list">
            {games.slice(0, 3).map((game) => (
              <div key={game.id} className="quick-launch-item">
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
