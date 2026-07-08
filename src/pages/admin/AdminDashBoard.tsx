import { useState, useEffect } from "react";
import { gameService } from "../../services/gameService";
import { userService } from "../../services/userService";

export default function AdminDashboard() {
  const [gameCount, setGameCount] = useState<string>("—");
  const [userCount, setUserCount] = useState<string>("—");

  useEffect(() => {
    gameService
      .getAll()
      .then((games) => setGameCount(String(games.length)))
      .catch(() => setGameCount("—"));

    userService
      .getAll()
      .then((users) => setUserCount(String(users.length)))
      .catch(() => setUserCount("—"));
  }, []);

  const stats = [
    { icon: "fa-solid fa-gamepad", label: "Total Games", value: gameCount },
    { icon: "fa-solid fa-users", label: "Total Users", value: userCount },
    { icon: "fa-solid fa-cart-shopping", label: "Orders Today", value: "—" },
    { icon: "fa-solid fa-coins", label: "Revenue", value: "R —" },
  ];

  return (
    <div className="admin-dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <i className={`${stat.icon} stat-icon`} />
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
