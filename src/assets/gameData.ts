// gameData.ts
export interface Game {
  id: number;
  title: string;
  genre: string;
  price: number;
  imageUrl: string;
}

interface GameData {
  games: Game[];
}

const gameData: GameData = {
  games: [
    {
      id: 1,
      title: "The Witcher 3: Wild Hunt",
      genre: "RPG",
      price: 29.99,
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOPtH8lO6v8aRGGNpdEpaJgtR5GEO1UlnPv33E4-9hyPDQHa7"
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      genre: "Action RPG",
      price: 59.99,
      imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS1dtbBhNNHqyHAUugdokcqjmfvEZgr46h6oVQsLayl0K880gCw"
    },
    {
      id: 3,
      title: "Minecraft",
      genre: "Sandbox",
      price: 26.95,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png"
    },
    {
      id: 4,
      title: "Among Us",
      genre: "Party",
      price: 4.99,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg"
    },
    {
      id: 5,
      title: "Hades",
      genre: "Roguelike",
      price: 24.99,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg"
    },
    {
      id: 6,
      title: "Hades",
      genre: "Roguelike",
      price: 24.99,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg"
    },
    {
      id: 7,
      title: "Hades",
      genre: "Roguelike",
      price: 24.99,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg"
    },
    {
      id: 8,
      title: "Hades",
      genre: "Roguelike",
      price: 24.99,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg"
    },
    {
      id: 9,
      title: "Hades",
      genre: "Roguelike",
      price: 24.99,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg"
    }
  ]
};

export default gameData;