import { useState } from "react";

interface ListGroupProps{
    items: string[];
    heading: string;
    onSelectItem: (item: string) =>void;
}
function ListGroup({items, heading, onSelectItem}: ListGroupProps) {
    //This is a hook
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const getMessage = () =>{
        return items.length === 0 && <p>No Items Found</p>;
    }
//There are no for loops in React thus we have to use ES6 maps to bind the data
/* We cannot just have a iterator out like this as it has to be an HTML element or 
a react component
     */
    if(items.length===0)
        return (
          <>
            <h1>
                List
            </h1>
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
      <h1>{heading}</h1>
      {getMessage()}
      <ul className="list-group">
        {items.map((items, index) => (
          /* 
            Here we have the items iterator so that react can know how to 
            manage dynamically changing the contents of your list 
            */
          <li 
          className={selectedIndex === index 
          ? 'list-group-item active'
          : 'list-group-item'}
          key={index} 
          onClick={() =>  {
            setSelectedIndex(index);
            onSelectItem(items)} }>
            {items}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
