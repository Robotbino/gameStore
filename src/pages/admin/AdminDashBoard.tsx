// TODO: replace placeholder stats with real data from API

const PLACEHOLDER_STATS = [
  { icon: "fa-solid fa-gamepad", label: "Total Games", value: "—" },
  { icon: "fa-solid fa-users", label: "Total Users", value: "—" },
  { icon: "fa-solid fa-cart-shopping", label: "Orders Today", value: "—" },
  { icon: "fa-solid fa-coins", label: "Revenue", value: "R —" },
];

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h2 className="page-title">Dashboard</h2>

      <div className="stats-grid">
        {PLACEHOLDER_STATS.map((stat) => (
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
