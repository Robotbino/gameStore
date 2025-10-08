import ListGroup from "./components/ListGroup";

let items = [
    "New York",
    "San Fran",
    "Philly",
    "China Town"
    ]

function App(){
  return <div><ListGroup items={items} heading="Cities"/></div>
}
export default App;