import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "../Navbar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const adminNavItems = [
    { icon: "fa-solid fa-chart-line", label: "Dashboard", to: "/admin" },
    { icon: "fa-solid fa-gamepad", label: "Manage Games", to: "/admin/games" },
    { icon: "fa-solid fa-users", label: "Manage Users", to: "/admin/users" },
  ];

  return (
    <div className="app-layout">
      <aside className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
        <div className="sidebar-header">
          {isSidebarOpen && (
            <span className="sidebar-brand">
              Game<span className="accent">Store</span>
              <span className="admin-badge">Admin</span>
            </span>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            ☰
          </button>
        </div>

        <ul className="sidebar-nav">
          {adminNavItems.map((item) => (
            <li key={item.label}>
              <NavLink to={item.to} className="sidebar-nav-item" end>
                <i className={`${item.icon} nav-icon`} />
                {isSidebarOpen && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </aside>

      <main className="content">
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
