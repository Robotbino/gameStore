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

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        {isAuthenticated && userRole && (
          <span
            className={`role-badge role-${userRole.toLowerCase()}`}
            title={`Signed in as ${userRole}`}
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              padding: "0.2rem 0.55rem",
              borderRadius: "999px",
              background: userRole === "ADMIN" ? "#7c3aed" : "#334155",
              color: "#fff",
            }}
          >
            {userRole}
          </span>
        )}
        <UserAvatar />
      </div>
    </nav>
  );
}
