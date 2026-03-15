import gameData from "../assets/gameData";

interface SideBarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function SideBar({ isOpen, onToggle }: SideBarProps) {
  const games = gameData.games;
  const navItems = [
    { icon: "fa-solid fa-fire", label: "What's Hot", href: "/whats-hot" },
    { icon: "fa-solid fa-book", label: "Library", href: "/library" },
    { icon: "fa-solid fa-bullseye", label: "Discover", href: "/discover" },
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
            <a href={item.href} className="sidebar-nav-item">
              <i className={`${item.icon} nav-icon`} />
              {isOpen && <span>{item.label}</span>}
            </a>
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
