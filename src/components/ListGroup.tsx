import { useState } from "react";
import type { Game } from "../assets/gameData";

interface ListGroupProps {
  items: Game[];
  heading: string;
  onSelectItem: (item: Game) => void;
}
function ListGroup({ items, heading, onSelectItem }: ListGroupProps) {
  //This is a hook
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const getMessage = () => {
    return items.length === 0 && <p>No Items Found</p>;
  };

  function selectedGame() {
    console.log("Selected Game:", items[selectedIndex]);
    setSelectedIndex(selectedIndex);
  }

  const renderStars = (rating: number) => {
   const fullStars = Math.floor(rating);
   const hasHalfStar = rating % 1 >= 0.5;
  
   return(
    <div className="starRating">
    {[...Array(5)].map((_, i) => (
          <span key={i} className={
            i < fullStars ? "star filled" : 
            (i === fullStars && hasHalfStar) ? "star half" : "star"
          }>
            ★
          </span>
        ))}
      <span className="rating-number">{rating.toFixed(1)}</span>
    </div>
   );
  };

  if (items.length === 0)
    return (
      <>
        <h1>List</h1>
        <p>No items found</p>
      </>
    );

  return (
    <>
      {getMessage()}
      <div className="container">
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedIndex(index);
              onSelectItem(item);
            }}
          >
          <div className={`list-item ${selectedIndex === index ? "selected" : ""} itemContainer`}
            onClick={selectedGame}>

              <span className="game-title" title={item.title}>
                {item.title}
              </span>

              <img src={item.imageUrl} alt={item.title} className="gameImage" />

              <div className="ratingContainer">
                  {renderStars(item.rating)}
              </div>  
              <span className="game-price">R {item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ListGroup;
