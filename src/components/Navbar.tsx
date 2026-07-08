import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";

export default function NavBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      navigate(`/browse?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  }

  return (
    <nav className="navbar">
      <div />

      <div className="search-bar">
        <span className="search-icon">⌕</span>
        <input
          type="search"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <UserAvatar />
    </nav>
  );
}
