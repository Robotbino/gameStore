import React, { type ReactNode } from 'react'

interface Props{
  children: ReactNode;
}

const Alert = ({children}: Props) => {
  return (
    <div className="alert alert-primary" 
      onClick={()=>{console.log("Yess")}}>
      {children}
    </div>
  )
}

export default Alert