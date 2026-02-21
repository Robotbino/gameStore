interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}
export default function NavBar() {
  return (
    <nav className="navbar">
      <div />

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input type="search" placeholder="Search games..." />
      </div>

      <div className="user-avatar">B</div>
    </nav>
  );
}
