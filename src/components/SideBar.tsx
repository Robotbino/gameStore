import type { Game } from "../assets/gameData";

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
  games: Game[];
}

export default function SideBar({ isOpen, onToggle, games }: SideBarProps) {
  const navItems = [
    { icon: "🔥", label: "What's Hot", href: "/whats-hot" },
    { icon: "📚", label: "Library", href: "/library" },
    { icon: "🎯", label: "Discover", href: "/discover" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "" : "collapsed"}`}>
      {/* Header */}
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

      {/* Navigation */}
      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.label}>
            <a href={item.href} className="sidebar-nav-item">
              <span className="nav-icon">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </a>
          </li>
        ))}
      </ul>

      {/* Quick Launch — only visible when sidebar is expanded */}
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