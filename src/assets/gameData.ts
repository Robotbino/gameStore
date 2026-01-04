export interface Game {
  id: number;
  title: string;
  genre: string;
  price: number;
  rating: number;
  imageUrl: string;
  heroImage: string;
}

interface GameData {
  games: Game[];
}

const gameData: GameData = {
  games: [
    {
      id: 1,
      title: "The Witcher 3",
      genre: "RPG",
      price: 899.99,
      rating: 4.8,
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOPtH8lO6v8aRGGNpdEpaJgtR5GEO1UlnPv33E4-9hyPDQHa7",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      genre: "Action RPG",
      price: 599.99,
      rating: 4.2,
      imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS1dtbBhNNHqyHAUugdokcqjmfvEZgr46h6oVQsLayl0K880gCw",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"
    },
    {
      id: 3,
      title: "Minecraft",
      genre: "Sandbox",
      price: 269.95,
      rating: 4.9,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png",
      heroImage: "https://www.minecraft.net/content/dam/games/minecraft/key-art/MC-Legends-Standard-Background.jpg"
    },
    {
      id: 4,
      title: "Among Us",
      genre: "Party",
      price: 46.99,
      rating: 4.5,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg"
    },
    {
      id: 5,
      title: "Hades",
      genre: "Roguelike",
      price: 545.99,
      rating: 4.9,
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg"
    },
    {
      id: 6,
      title: "ARC Raiders",
      genre: "Shooter",
      price: 214.99,
      rating: 4.0,
      imageUrl: "https://4kwallpapers.com/images/walls/thumbs_3t/19874.jpg",
      heroImage: "https://images.igdb.com/igdb/image/upload/t_1080p/co4byb.jpg"
    },
    {
      id: 7,
      title: "Dota 2",
      genre: "MOBA",
      price: 424.99,
      rating: 4.6,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/31/Dota_2_Steam_artwork.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg"
    },
    {
      id: 8,
      title: "Stardew Valley",
      genre: "Simulation",
      price: 524.99,
      rating: 4.9,
      imageUrl: "https://eastside-online.org/wp-content/uploads/2022/03/stardewfeatureimage.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg"
    },
    {
      id: 9,
      title: "NARAKA:BLADEPOINT",
      genre: "Battle Royale",
      price: 824.99,
      rating: 4.3,
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/57/Naraka_Bladepoint_cover_art_full.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1203220/header.jpg"
    }
  ]
};

export default gameData;