import type { Game } from "../assets/gameData";

interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOpen?: boolean;
  games: Game[];
}

export default function SideBar({
  isOpen,
  isSidebarOpen,
  setIsSidebarOpen,
  games,
}: SideBarProps) {
  function closeSidebar() {
    // Logic to close the sidebar
    setIsSidebarOpen(!isSidebarOpen);
  }

  function QuickLaunchItem({ game }: { game: Game }) {
    return (
      <div className="quickLaunchItem">
        <img
          className="quickLaunchItemImage"
          src={game.imageUrl}
          alt={game.title}
        />
        <div style={{color:"#d6d6d6",marginLeft:"5px"}}>{game.title}</div>
      </div>
    );
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav>
        <div className="sideBarLogo">
          <label className="sideBarTitleLabel">GameStore</label>
          <button className="btn-toggle-sideBar" onClick={closeSidebar}>
            ☰
          </button>
        </div>
        <br />
        <div className="userProfileSection">
          <img
            className="userProfilePicture"
            src="src/assets/useProfileImg.png"
            alt="User Profile image"
          />
          <label>UserName</label>
        </div>
        <hr style={{ border: "1px solid #6f7174" }} />
        <ul className="sideBarMenu">
          <li>
            <a href="/games">
              <i className={`fa-solid fa-fire-flame-curved sideBarIcons`}></i>
              Whats hot?
            </a>
          </li>
          <li>
            <a href="/library">
              <i className={`fa-solid fa-book sideBarIcons`}></i>
              Library
            </a>
          </li>
        </ul>
        <hr style={{ border: "1px solid #6f7174" }} />
        <span className="quickLaunchTitle">QUICK LAUNCH</span>
        <div className="quickLaunchContainer open">
          {games.slice(3, 5).map((game) => (
            <QuickLaunchItem key={game.id} game={game} />
          ))}
        </div>
      </nav>
    </aside>
  );
}
