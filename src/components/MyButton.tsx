import React, { Children } from "react";

interface Props {
  children?: string;
  colour?: string;
  onClick?: () => void;
}
const Mybutton = ({ children, onClick, colour }: Props) => {
  return (
    <div>
      <button type="button" className={"btn btn-" + colour} onClick={onClick}>
        {children}
      </button>
    </div>
  );
};

export default Mybutton;
