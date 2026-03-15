import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import SideBar from "../SideBar";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="app-layout">
      <SideBar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen((prev) => !prev)}
      />
      <main className="content">
        <Navbar />
        <Outlet />           {/* ← page content renders here */}
      </main>
    </div>
  );
}