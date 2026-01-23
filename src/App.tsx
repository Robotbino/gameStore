import { useState } from "react";
import ListGroup from "./components/ListGroup";
import gameData, { type Game } from "./assets/gameData.ts";
import NavBar from "./components/Navbar.tsx";
import SideBar from "./components/SideBar.tsx";
import HeroSection from "./components/HeroSection.tsx";
import { Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage.tsx";
import AboutGame from "./components/AboutGame.tsx"
 
import "./App.css";
import AboutGames from "./components/AboutGame.tsx";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="app-layout">
      
      <div className="main-wrapper">
        <SideBar
          isOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          games={gameData.games}
        />
        <main className="content">
           <NavBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isOpen={isSidebarOpen}
            />
           <Routes>
            <Route path="/" element={
              <HomePage  itemData={gameData.games}  />
              } />
            { 
              <Route path={`/aboutGame/${gameData.games[0].id}`}
              element = {<AboutGame items={gameData.games[0]}/>}/> 
            }
          </Routes>
          
        </main>
      </div>
    </div>
  );
}
export default App;
