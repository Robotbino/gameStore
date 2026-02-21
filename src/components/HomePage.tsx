
import { useState } from "react";
import ListGroup from "./ListGroup";
import gameData from "../assets/gameData.ts";
import type { Game } from "../assets/gameData";
import HeroSection from "./HeroSection.tsx";
import GameGrid from "./GameGrid";
interface HomePageProps{
    itemData:Game[];
}


export default function HomePage({itemData}:HomePageProps){
    const [selectedGame, setSelectedGame] = useState<Game>(itemData[0]);

   function handleSelectGame(game: Game) {
        setSelectedGame(game); 
    }
    
    if(!gameData){
        return null
    }
    return(
       <>
        <HeroSection  item={selectedGame}/>

        <GameGrid
        items={itemData}
        heading="Available Games"
        selectedGame={selectedGame}
        onSelectItem={setSelectedGame}
      />
        </>

    )

}