//Were using PascalCasing
function Message(){

    //This code gets converted to JS code under the hood.
    //JSX: JavaScript XML
    const name='Bino';
    if(name)
        return <h1>Hello {name}</h1>; 
    return <h1>Hello {name}</h1>;   
}

export default  Message;