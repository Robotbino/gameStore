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

  //There are no for loops in React thus we have to use ES6 maps to bind the data
  /* We cannot just have a iterator out like this as it has to be an HTML element or 
a react component
*/
  if (items.length === 0)
    return (
      <>
        <h1>List</h1>
        <p>No items found</p>
      </>
    );
  /* 
    If we want to conditionally render elements but do not want to
    make our code verbose we have to add conditional functions for 
    elements 
    */
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
            <span className="game-title" title={item.title}>
              {item.title}
            </span>
            <img src={item.imageUrl} alt={item.title} className="gameImage" />
            <div className="ratingContainer">
                {renderStars(item.rating)}
              </div>  
            <span className="game-price">R {item.price.toFixed(2)}</span>
              
            {selectedIndex === index && (
              <span className="selected-indicator"> (Selected)</span>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default ListGroup;
