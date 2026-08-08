import { useState, useEffect } from "react";
import axios from "axios";
import { gameService } from "../../services/gameService";
import { userService } from "../../services/userService";

type SyncStatus =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; status: number; message: string };

interface Stat {
  icon: string;
  label: string;
  value: string;
  /** Set when the number can't be produced yet, so the card can explain itself. */
  note?: string;
}

// One page, deliberately oversized: enough to make "Avg. Rating" and
// "Catalogue Value" meaningful for a store this size without going back to
// downloading the entire table, which is what pagination just fixed.
const SAMPLE_SIZE = 200;

const CURRENCY = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sync, setSync] = useState<SyncStatus>({ kind: "idle" });

  async function handleSyncRawg() {
    setSync({ kind: "loading" });
    try {
      const data = await gameService.syncFromRawg();
      // Success path — reachable only once the backend actually implements it.
      setSync({ kind: "result", status: 200, message: data.message ?? "OK" });
    } catch (err) {
      // 501 is the expected response today; surface whatever the backend sent
      // so the demo shows the real status/message, not a generic error string.
      if (axios.isAxiosError(err) && err.response) {
        const body = err.response.data as { message?: string } | undefined;
        setSync({
          kind: "result",
          status: err.response.status,
          message: body?.message ?? err.response.statusText,
        });
      } else {
        setSync({ kind: "result", status: 0, message: "Network error" });
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    // allSettled, not all: one failing endpoint shouldn't blank out the stats
    // that do work.
    //
    // Both endpoints are paginated now, which splits the four cards in two.
    // The counts are exact — `totalElements` is the whole table, whatever page
    // came back. The two derived numbers can only see the rows in hand, so this
    // asks for one oversized page and says so on the card when the catalogue
    // outgrows it. Better a labelled sample than a confidently wrong average.
    Promise.allSettled([
      gameService.getPage({ size: SAMPLE_SIZE }),
      userService.getPage({ size: 1 }),
    ]).then(([gamesResult, usersResult]) => {
        if (cancelled) return;

        const gamesFailed = gamesResult.status === "rejected";
        const usersFailed = usersResult.status === "rejected";

        const gamesPage = gamesResult.status === "fulfilled" ? gamesResult.value : null;
        const games = gamesPage?.content ?? [];
        const totalGames = gamesPage?.totalElements ?? 0;
        const partial = totalGames > games.length;
        const sampleNote = partial
          ? `across the first ${games.length} of ${totalGames}`
          : undefined;

        const catalogueValue = games.reduce((sum, g) => sum + (g.price ?? 0), 0);
        const rated = games.filter((g) => typeof g.rating === "number");
        const avgRating = rated.length
          ? rated.reduce((sum, g) => sum + g.rating, 0) / rated.length
          : 0;

        setStats([
          {
            icon: "fa-solid fa-gamepad",
            label: "Total Games",
            value: gamesFailed ? "—" : String(totalGames),
            note: gamesFailed ? "Couldn't reach /games/all" : undefined,
          },
          {
            icon: "fa-solid fa-users",
            label: "Total Users",
            value: usersFailed ? "—" : String(usersResult.value.totalElements),
            note: usersFailed ? "Couldn't reach /users/all" : undefined,
          },
          // "Orders Today" and "Revenue" both need purchase data, and no
          // purchase endpoint exists yet. These two are derived from the
          // catalogue instead — swap them back once purchases are wired up.
          {
            icon: "fa-solid fa-star",
            label: "Avg. Rating",
            value: gamesFailed || !rated.length ? "—" : avgRating.toFixed(1),
            note: gamesFailed ? undefined : sampleNote,
          },
          {
            icon: "fa-solid fa-coins",
            label: "Catalogue Value",
            value: gamesFailed ? "—" : CURRENCY.format(catalogueValue),
            note: gamesFailed ? undefined : sampleNote,
          },
        ]);

        setIsLoading(false);
      });

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

      <section className="admin-section" style={{ marginTop: "2rem" }}>
        <h3 className="section-title">Catalogue Sync</h3>
        <p className="section-subtitle">
          Pull the game catalogue from RAWG. Currently a stub — the endpoint
          returns HTTP 501 until the integration is wired up.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSyncRawg}
          disabled={sync.kind === "loading"}
        >
          {sync.kind === "loading" ? "Syncing…" : "Sync from RAWG"}
        </button>
        {sync.kind === "result" && (
          <p
            className="sync-result"
            style={{ marginTop: "0.75rem", opacity: 0.85 }}
          >
            <strong>HTTP {sync.status}</strong> — {sync.message}
          </p>
        )}
      </section>
    </div>
  );
}
