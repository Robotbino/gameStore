import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function NotFoundPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const homePath = isAuthenticated ? (isAdmin ? "/admin" : "/") : "/login";

  return (
    <div className="not-found-page">
      <span className="not-found-code">404</span>
      <h1 className="not-found-title">Page not found</h1>
      <p className="not-found-text">
        That page doesn't exist. It may have been moved, or the link was wrong.
      </p>
      <Link to={homePath} className="btn-primary">
        {isAuthenticated ? "Back to GameStore" : "Go to Login"}
      </Link>
    </div>
  );
}
