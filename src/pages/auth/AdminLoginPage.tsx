import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { LoginRequest } from "../../types/auth";

export default function AdminLoginPage() {
  const { login, logout, isAuthenticated, isAdmin, isLoading } = useAuth();
  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div className="loading-screen">Loading…</div>;
  if (isAuthenticated && isAdmin) return <Navigate to="/admin" replace />;
  if (isAuthenticated && !isAdmin) return <Navigate to="/" replace />;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const role = await login(form);
      if (role !== "ADMIN") {
        logout();
        setError("Access denied. This portal is for administrators only.");
      }
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page admin-login-page">
      <div className="auth-card admin-login-card">
        <div className="admin-login-icon">
          <i className="fa-solid fa-shield-halved" />
        </div>

        <h1 className="auth-title">Admin Portal</h1>
        <p className="auth-subtitle">Restricted access — authorized personnel only</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="btn-primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Authenticating…" : "Sign In to Admin Portal"}
          </button>
        </form>

        <p className="auth-footer">
          Not an admin?{" "}
          <Link to="/login" className="accent">
            Return to user login
          </Link>
        </p>
      </div>
    </div>
  );
}
