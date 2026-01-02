import { useState } from "react";
import ListGroup from "./components/ListGroup";
import gameData, { type Game } from "./assets/gameData.ts";
import NavBar from "./components/Navbar.tsx";
import SideBar from "./components/SideBar.tsx";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function handleSelectGame(game: Game) {
    console.log("Selected Game:", game);
  }

  return (
    <div className="app-layout">
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isOpen={isSidebarOpen}
      />
      <div className="main-wrapper">
        <SideBar 
        isOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isSidebarOpen={isSidebarOpen}
        />
        <main className="content">
          <ListGroup
            items={gameData.games}
            heading="Available Games"
            onSelectItem={handleSelectGame}
          />
        </main>
      </div>
    </div>
  );
}
export default App;
