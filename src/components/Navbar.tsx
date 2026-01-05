interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}
export default function NavBar({
  isSidebarOpen,
  setIsSidebarOpen,
}: NavBarProps) {
  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Toggled Sidebar:", isSidebarOpen);
  }

  return (
    <nav className="navbar">
      <div className="storeLogo">
        <i className="fa-solid fa-chess-board storeLogoIcon"></i>
        <label className="navbar-title">Game Store</label>
      </div>
      <div className="search-bar">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="search"
          placeholder="Search Games..."
          className="form-control search-input"
        />
      </div>
    </nav>
  );
}
