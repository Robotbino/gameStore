import MyButton from "./components/MyButton";
import ListGroup from "./components/ListGroup";
import gameData,{ type Game} from  "./assets/gameData.ts";
import './App.css'

function App() {

  function handleSelectGame(game: Game){
    console.log("Selected Game:", game);
  }
  return (
    <div>
      <ListGroup items={gameData.games} heading="Available Games"
       onSelectItem={handleSelectGame}></ListGroup>
      <MyButton></MyButton>
    </div>
  );
}
export default App;
