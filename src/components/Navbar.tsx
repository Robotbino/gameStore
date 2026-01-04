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
    <nav className="navbar ">
      <div>
        <label className="NavBar-title">Game Store</label>
      </div>
      <div className="search-bar">
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder="Search Games..."
          className="form-control search-input"
        />
      </div>
    </nav>
  );
}
