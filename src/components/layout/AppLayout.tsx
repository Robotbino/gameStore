import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import SideBar from "../SideBar";
import { QuickLaunchProvider } from "../../context/QuickLaunchProvider";

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // The provider sits here, not in App.tsx, for two reasons: it needs the
  // sidebar's open state (one of the carousel's run conditions), and it must be
  // above BOTH <SideBar> and <Outlet> so the filling menu row and the page's
  // hero read the same spotlight.
  return (
    <QuickLaunchProvider isSidebarOpen={isSidebarOpen}>
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
    </QuickLaunchProvider>
  );
}