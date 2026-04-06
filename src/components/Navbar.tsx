import UserAvatar from "./UserAvatar";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div />

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input type="search" placeholder="Search games..." />
      </div>

      <UserAvatar />
    </nav>
  );
}
