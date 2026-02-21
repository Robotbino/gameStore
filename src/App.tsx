import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import gameData from "./assets/gameData.ts";
import NavBar from "./components/Navbar.tsx";
import SideBar from "./components/SideBar.tsx";
import HomePage from "./components/HomePage.tsx";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function handleToggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

  return (
    <div className="app-layout">
      <SideBar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
        games={gameData.games}
      />

      <main className="content">
        <NavBar />
        <Routes>
          <Route
            path="/"
            element={<HomePage itemData={gameData.games} />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;