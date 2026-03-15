import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Layouts
import AppLayout from "../components/layout/AppLayout.tsx";
import AdminLayout from "../components/layout/AdminLayout.tsx";

// Route guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Auth pages
import LoginPage from "../pages/auth/LoginPage.tsx";
import RegisterPage from "../pages/auth/RegisterPage.tsx";

// User pages
import HomePage from "../pages/user/HomePage.tsx";
import BrowsePage from "../pages/user/BrowsePage.tsx";
import GameDetailsPage from "../pages/user/GameDetailsPage.tsx";
import LibraryPage from "../pages/user/LibraryPage.tsx";

// Admin pages
import AdminDashboard from "../pages/admin/AdminDashBoard.tsx";
import ManageGamesPage from "../pages/admin/ManageGamesPage.tsx";
import ManageUsersPage from "../pages/admin/ManageUsersPage.tsx";

export default function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={isAdmin ? "/admin" : "/"} replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
        }
      />

      {/* ── Protected user routes (wrapped in sidebar + navbar layout) ── */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="browse" element={<BrowsePage />} />
          <Route path="games/:id" element={<GameDetailsPage />} />
          <Route path="library" element={<LibraryPage />} />
        </Route>
      </Route>

      {/* ── Admin-only routes (wrapped in admin layout) ── */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/games" element={<ManageGamesPage />} />
          <Route path="admin/users" element={<ManageUsersPage />} />
        </Route>
      </Route>

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
