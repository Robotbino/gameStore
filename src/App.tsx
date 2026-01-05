import { useState } from "react";
import ListGroup from "./components/ListGroup";
import gameData, { type Game } from "./assets/gameData.ts";
import NavBar from "./components/Navbar.tsx";
import SideBar from "./components/SideBar.tsx";
import HeroSection from "./components/HeroSection.tsx";
import "./App.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game>(gameData.games[0]);


  function handleSelectGame(game: Game) {
    setSelectedGame(game); 
  }

  return (
    <div className="app-layout">
      
      <div className="main-wrapper">
        <SideBar
          isOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
        />
        <main className="content">
           <NavBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isOpen={isSidebarOpen}
            />
          <HeroSection item={selectedGame} />
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
