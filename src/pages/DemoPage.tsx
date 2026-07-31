import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// The main api.ts singleton redirects to /login on any 401 — that would
// interrupt this page every time a demo call runs as anonymous. Use a bare
// axios client here so 401s are treated as data, not as a session eviction.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8181";
const demoClient = axios.create({ baseURL: API_BASE_URL });

interface Endpoint {
  key: string;
  method: "GET" | "POST";
  path: string;
  label: string;
  expected: { anon: number; user: number; admin: number };
}

const ENDPOINTS: Endpoint[] = [
  {
    key: "games-all",
    method: "GET",
    path: "/games/all",
    label: "Browse catalogue",
    expected: { anon: 200, user: 200, admin: 200 },
  },
  {
    key: "users-me",
    method: "GET",
    path: "/users/me",
    label: "My profile",
    expected: { anon: 401, user: 200, admin: 200 },
  },
  {
    key: "users-all",
    method: "GET",
    path: "/users/all",
    label: "List all users",
    expected: { anon: 401, user: 403, admin: 200 },
  },
  {
    key: "sync-rawg",
    method: "POST",
    path: "/games/sync/rawg",
    label: "Sync from RAWG (stub)",
    expected: { anon: 401, user: 403, admin: 501 },
  },
];

type CallResult = { status: number; ok: boolean } | { error: string };

export default function DemoPage() {
  const { userRole, isAuthenticated } = useAuth();
  const [results, setResults] = useState<Record<string, CallResult>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const currentRole: "anon" | "user" | "admin" = !isAuthenticated
    ? "anon"
    : userRole === "ADMIN"
      ? "admin"
      : "user";

  async function callEndpoint(ep: Endpoint) {
    setLoadingKey(ep.key);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    try {
      const res =
        ep.method === "GET"
          ? await demoClient.get(ep.path, { headers })
          : await demoClient.post(ep.path, {}, { headers });
      setResults((r) => ({
        ...r,
        [ep.key]: { status: res.status, ok: true },
      }));
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setResults((r) => ({
          ...r,
          [ep.key]: { status: err.response!.status, ok: false },
        }));
      } else {
        setResults((r) => ({
          ...r,
          [ep.key]: { error: "Network error — is the backend running?" },
        }));
      }
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "2rem auto",
        padding: "1.5rem",
        fontFamily: "system-ui, sans-serif",
        color: "#e5e7eb",
      }}
    >
      <h1 style={{ marginBottom: "0.25rem" }}>RBAC Demo</h1>
      <p style={{ marginTop: 0, opacity: 0.75 }}>
        The backend enforces role-based access. This page lets you fire the
        same endpoints as three different callers.
      </p>

      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          alignItems: "center",
          margin: "1rem 0 1.5rem",
          flexWrap: "wrap",
        }}
      >
        <span>You are currently:</span>
        <span
          style={{
            fontWeight: 700,
            padding: "0.2rem 0.6rem",
            borderRadius: 999,
            background:
              currentRole === "admin"
                ? "#7c3aed"
                : currentRole === "user"
                  ? "#334155"
                  : "#64748b",
          }}
        >
          {currentRole.toUpperCase()}
        </span>
        {isAuthenticated ? (
          <Link to="/" style={{ color: "#93c5fd" }}>
            (go to app to log out)
          </Link>
        ) : (
          <Link to="/login" style={{ color: "#93c5fd" }}>
            log in
          </Link>
        )}
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#111827",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#1f2937", textAlign: "left" }}>
            <th style={th}>Endpoint</th>
            <th style={th}>Anonymous</th>
            <th style={th}>USER</th>
            <th style={th}>ADMIN</th>
            <th style={th}>Try as {currentRole.toUpperCase()}</th>
          </tr>
        </thead>
        <tbody>
          {ENDPOINTS.map((ep) => {
            const result = results[ep.key];
            const expected = ep.expected[currentRole];
            return (
              <tr key={ep.key} style={{ borderTop: "1px solid #1f2937" }}>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{ep.label}</div>
                  <code style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                    {ep.method} {ep.path}
                  </code>
                </td>
                <td style={td}>{statusPill(ep.expected.anon)}</td>
                <td style={td}>{statusPill(ep.expected.user)}</td>
                <td style={td}>{statusPill(ep.expected.admin)}</td>
                <td style={td}>
                  <button
                    onClick={() => callEndpoint(ep)}
                    disabled={loadingKey === ep.key}
                    style={btn}
                  >
                    {loadingKey === ep.key ? "…" : "Send"}
                  </button>
                  {result && (
                    <div style={{ marginTop: "0.4rem", fontSize: "0.85rem" }}>
                      {"error" in result ? (
                        <span style={{ color: "#f87171" }}>{result.error}</span>
                      ) : (
                        <>
                          {statusPill(result.status)}{" "}
                          <span style={{ opacity: 0.7 }}>
                            (expected {expected})
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p style={{ marginTop: "1.5rem", fontSize: "0.85rem", opacity: 0.7 }}>
        Demo accounts (seeded on backend start):{" "}
        <code>admin@gamestore.com</code> / <code>user@gamestore.com</code> —
        password <code>12345678</code>.
      </p>
    </div>
  );
}

const th: React.CSSProperties = { padding: "0.75rem 1rem", fontWeight: 600 };
const td: React.CSSProperties = { padding: "0.75rem 1rem", verticalAlign: "top" };
const btn: React.CSSProperties = {
  padding: "0.35rem 0.9rem",
  borderRadius: 6,
  border: "1px solid #374151",
  background: "#1f2937",
  color: "#e5e7eb",
  cursor: "pointer",
};

function statusPill(status: number) {
  const color =
    status >= 200 && status < 300
      ? "#059669"
      : status === 401 || status === 403
        ? "#d97706"
        : status === 501
          ? "#6366f1"
          : "#ef4444";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "0.15rem 0.5rem",
        borderRadius: 4,
        background: color,
        color: "#fff",
        fontSize: "0.8rem",
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}
