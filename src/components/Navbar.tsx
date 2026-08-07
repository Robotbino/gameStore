import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import { useAuth } from "../hooks/useAuth";

export default function NavBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { userRole, isAuthenticated } = useAuth();

  // BrowsePage owns the actual searching; the navbar just hands it a term via
  // the URL so the result is linkable and survives a refresh.
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = query.trim();
    navigate(term ? `/browse?q=${encodeURIComponent(term)}` : "/browse");
  }

  return (
    <nav className="navbar">
      <div />

      <form className="search-bar" onSubmit={handleSubmit} role="search">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search games"
        />
      </form>

      <div className="navbar-actions">
        {isAuthenticated && userRole && (
          <span
            className={`role-badge ${userRole.toLowerCase()}`}
            title={`Signed in as ${userRole}`}
          >
            {userRole}
          </span>
        )}
        <UserAvatar />
      </div>
    </nav>
  );
}
