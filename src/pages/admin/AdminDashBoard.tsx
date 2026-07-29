import { useState, useEffect } from "react";
import { gameService } from "../../services/gameService";
import { userService } from "../../services/userService";

interface Stat {
  icon: string;
  label: string;
  value: string;
  /** Set when the number can't be produced yet, so the card can explain itself. */
  note?: string;
}

const CURRENCY = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // allSettled, not all: GET /users has no controller mapping today, and one
    // 404 shouldn't blank out the stats that do work.
    Promise.allSettled([gameService.getAll(), userService.getAll()]).then(
      ([gamesResult, usersResult]) => {
        if (cancelled) return;

        const games = gamesResult.status === "fulfilled" ? gamesResult.value : [];
        const gamesFailed = gamesResult.status === "rejected";
        const usersFailed = usersResult.status === "rejected";

        const catalogueValue = games.reduce((sum, g) => sum + (g.price ?? 0), 0);
        const rated = games.filter((g) => typeof g.rating === "number");
        const avgRating = rated.length
          ? rated.reduce((sum, g) => sum + g.rating, 0) / rated.length
          : 0;

        setStats([
          {
            icon: "fa-solid fa-gamepad",
            label: "Total Games",
            value: gamesFailed ? "—" : String(games.length),
            note: gamesFailed ? "Couldn't reach /games/all" : undefined,
          },
          {
            icon: "fa-solid fa-users",
            label: "Total Users",
            value: usersFailed ? "—" : String(usersResult.value.length),
            note: usersFailed ? "GET /users not implemented yet" : undefined,
          },
          // "Orders Today" and "Revenue" both need purchase data, and no
          // purchase endpoint exists yet. These two are derived from the
          // catalogue instead — swap them back once purchases are wired up.
          {
            icon: "fa-solid fa-star",
            label: "Avg. Rating",
            value: gamesFailed || !rated.length ? "—" : avgRating.toFixed(1),
          },
          {
            icon: "fa-solid fa-coins",
            label: "Catalogue Value",
            value: gamesFailed ? "—" : CURRENCY.format(catalogueValue),
          },
        ]);

        setIsLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="admin-dashboard">
      <h2 className="page-title">Dashboard</h2>

      {isLoading ? (
        <p className="table-loading">Loading stats…</p>
      ) : (
        <div className="stats-grid">
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card">
              <i className={`${stat.icon} stat-icon`} />
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value}</span>
                {stat.note && <span className="stat-note">{stat.note}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
