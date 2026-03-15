import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    //Add csss for this loading screen in App.css
    return <div className="loading-screen">Loading…</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}