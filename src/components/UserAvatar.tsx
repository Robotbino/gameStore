import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function UserAvatar() {
  const { userEmail, currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Prefer the real userName once /users/me lands; fall back to the JWT
  // email (available synchronously) so the button never briefly renders "?".
  const displayName = currentUser?.userName ?? userEmail ?? "";
  const initial = displayName ? displayName.charAt(0).toUpperCase() : "?";

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="avatar-wrapper" ref={wrapperRef}>
      <button
        className="user-avatar"
        id="userAvatar"
        type="button"
        onClick={() => setOpen(!open)}
      >
        {initial}
      </button>

      {open && (
        <div className="avatar-menu">
          <button className="avatar-menu-item" onClick={() => setOpen(false)}>
            Profile
          </button>
          <button className="avatar-menu-item" onClick={() => setOpen(false)}>
            Settings
          </button>
          <div className="avatar-menu-separator" />
          <button className="avatar-menu-item" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
