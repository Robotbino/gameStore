export interface Review {
  id: number;
  user: {
    username: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  date: string;
}


export interface Game {
  id: number;
  title: string;
  genre: string[];
  price: number;
  rating: number;
  description: string;
  imageUrl: string;
  heroImage: string;
  reviews:Review[];
}

interface GameData {
  games: Game[];
}

const gameData: GameData = {
  games: [
    {
      id: 1,
      title: "The Witcher 3",
      genre: ["RPG", "Open World", "Story Rich", "Fantasy"],
      price: 899.99,
      rating: 4.8,
      description: "Embark on an epic journey as Geralt of Rivia, a monster hunter searching for his adopted daughter in a war-torn fantasy world. Make impactful choices that shape the narrative across hundreds of hours of gameplay, featuring rich characters, morally complex quests, and breathtaking landscapes.",
      imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgOPtH8lO6v8aRGGNpdEpaJgtR5GEO1UlnPv33E4-9hyPDQHa7",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
      reviews: [
        {
          id: 1,
          user: {
            username: "GeraltFan99",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GeraltFan99"
          },
          rating: 5,
          comment: "One of the best RPGs ever made. The story, characters, and world-building are absolutely phenomenal. 200+ hours and still finding new things.",
          date: "2024-12-15"
        },
        {
          id: 2,
          user: {
            username: "RPGMaster",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RPGMaster"
          },
          rating: 5,
          comment: "Gwent alone is worth the price. But seriously, the quests in this game put every other RPG to shame.",
          date: "2024-11-20"
        },
        {
          id: 3,
          user: {
            username: "CasualGamer22",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CasualGamer22"
          },
          rating: 4,
          comment: "Amazing game but the combat took some getting used to. Story makes up for everything though.",
          date: "2024-10-05"
        }
      ]
    },
    {
      id: 2,
      title: "Cyberpunk 2077",
      genre: ["Action RPG", "Open World", "Sci-Fi", "Shooter"],
      price: 599.99,
      rating: 4.2,
      description: "Enter the dark future of Night City, a sprawling megalopolis obsessed with power and body modification. As V, a mercenary outlaw, you'll acquire a cybernetic implant that grants access to the memories of a legendary rockerboy, setting off a dangerous quest for immortality.",
      imageUrl: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcS1dtbBhNNHqyHAUugdokcqjmfvEZgr46h6oVQsLayl0K880gCw",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      reviews: [
        {
          id: 4,
          user: {
            username: "NightCityRunner",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=NightCityRunner"
          },
          rating: 4,
          comment: "After all the patches, this game is incredible. Night City is the most immersive open world I've experienced.",
          date: "2024-12-01"
        },
        {
          id: 5,
          user: {
            username: "TechNinja",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TechNinja"
          },
          rating: 5,
          comment: "The Phantom Liberty DLC elevated this to a masterpiece. Idris Elba killed it!",
          date: "2024-11-15"
        },
        {
          id: 6,
          user: {
            username: "SciFiLover",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SciFiLover"
          },
          rating: 3,
          comment: "Good story but still has some bugs. The atmosphere is unmatched though.",
          date: "2024-09-22"
        }
      ]
    },
    {
      id: 3,
      title: "Minecraft",
      genre: ["Sandbox", "Survival", "Creative", "Multiplayer"],
      price: 269.95,
      rating: 4.9,
      description: "Build anything you can imagine in this iconic block-based sandbox game. Whether you're surviving your first night against monsters, constructing massive architectural wonders, or exploring endless procedurally generated worlds, Minecraft offers limitless possibilities for players of all ages.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/b/b6/Minecraft_2024_cover_art.png",
      heroImage: "https://www.minecraft.net/content/dam/games/minecraft/key-art/MC-Legends-Standard-Background.jpg",
      reviews: [
        {
          id: 7,
          user: {
            username: "BlockBuilder",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BlockBuilder"
          },
          rating: 5,
          comment: "Been playing for 10 years and it never gets old. The creativity is endless!",
          date: "2024-12-10"
        },
        {
          id: 8,
          user: {
            username: "SurvivalKing",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SurvivalKing"
          },
          rating: 5,
          comment: "Perfect game for all ages. My kids and I play together every weekend.",
          date: "2024-11-28"
        },
        {
          id: 9,
          user: {
            username: "RedstoneWizard",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RedstoneWizard"
          },
          rating: 5,
          comment: "The redstone system alone makes this game infinitely replayable. Built a working calculator!",
          date: "2024-10-18"
        }
      ]
    },
    {
      id: 4,
      title: "Among Us",
      genre: ["Party", "Social Deduction", "Multiplayer", "Casual"],
      price: 46.99,
      rating: 4.5,
      description: "Work together with your crewmates to prepare your spaceship for departure — but beware, as impostors lurk among you. Complete tasks, call emergency meetings, and vote to eject suspected impostors before they eliminate everyone. Trust no one in this thrilling game of deception.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/945360/header.jpg",
      reviews: [
        {
          id: 10,
          user: {
            username: "SusDetector",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SusDetector"
          },
          rating: 5,
          comment: "Best party game ever. Nothing beats the chaos of accusing your friends of being the impostor.",
          date: "2024-12-05"
        },
        {
          id: 11,
          user: {
            username: "CrewmatePro",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CrewmatePro"
          },
          rating: 4,
          comment: "Super fun with friends but random lobbies can be hit or miss.",
          date: "2024-11-10"
        },
        {
          id: 12,
          user: {
            username: "PartyGamer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PartyGamer"
          },
          rating: 4,
          comment: "Simple concept but incredibly addictive. Great value for the price.",
          date: "2024-09-30"
        }
      ]
    },
    {
      id: 5,
      title: "Hades",
      genre: ["Roguelike", "Action", "Indie", "Hack and Slash"],
      price: 545.99,
      rating: 4.9,
      description: "Defy the god of the dead as you fight your way out of the Underworld in this award-winning roguelike. Wield the powers of Olympian gods, uncover the story with each escape attempt, and forge bonds with a memorable cast of characters in this beautifully crafted action game.",
      imageUrl: "https://f4.bcbits.com/img/a2368914893_10.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
      reviews: [
        {
          id: 13,
          user: {
            username: "RogueRunner",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RogueRunner"
          },
          rating: 5,
          comment: "Perfect roguelike. The story progression between runs is genius. Supergiant outdid themselves.",
          date: "2024-12-12"
        },
        {
          id: 14,
          user: {
            username: "MythologyNerd",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MythologyNerd"
          },
          rating: 5,
          comment: "The voice acting and character writing is phenomenal. Every death feels like progress.",
          date: "2024-11-25"
        },
        {
          id: 15,
          user: {
            username: "ActionAddict",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ActionAddict"
          },
          rating: 5,
          comment: "Combat is so satisfying. Each weapon feels completely different. 100+ runs and still going.",
          date: "2024-10-08"
        }
      ]
    },
    {
      id: 6,
      title: "ARC Raiders",
      genre: ["Shooter", "Co-op", "Sci-Fi", "Action"],
      price: 214.99,
      rating: 4.0,
      description: "Join the resistance as an ARC Raider in this free-to-play cooperative shooter. Scavenge for resources, craft gear, and team up with other raiders to take on the mechanized threat from space. Survive hostile environments and outsmart deadly machines in intense squad-based combat.",
      imageUrl: "https://4kwallpapers.com/images/walls/thumbs_3t/19874.jpg",
      heroImage: "https://images.igdb.com/igdb/image/upload/t_1080p/co4byb.jpg",
      reviews: [
        {
          id: 16,
          user: {
            username: "CoopKing",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CoopKing"
          },
          rating: 4,
          comment: "Great concept and the robot enemies are terrifying. Needs more content but solid foundation.",
          date: "2024-12-08"
        },
        {
          id: 17,
          user: {
            username: "ShooterFan",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ShooterFan"
          },
          rating: 4,
          comment: "Love the extraction shooter mechanics. Playing with a squad is intense!",
          date: "2024-11-18"
        },
        {
          id: 18,
          user: {
            username: "SciFiShooter",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SciFiShooter"
          },
          rating: 3,
          comment: "Promising game but matchmaking needs work. Graphics are stunning though.",
          date: "2024-10-02"
        }
      ]
    },
    {
      id: 7,
      title: "Dota 2",
      genre: ["MOBA", "Strategy", "Competitive", "Free to Play"],
      price: 424.99,
      rating: 4.6,
      description: "Compete in one of the most complex and rewarding competitive games ever created. Choose from over 120 unique heroes, each with distinct abilities, and battle in 5v5 matches to destroy the enemy Ancient. Master deep strategic gameplay and climb the ranks in this legendary MOBA.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/31/Dota_2_Steam_artwork.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg",
      reviews: [
        {
          id: 19,
          user: {
            username: "AncientDestroyer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AncientDestroyer"
          },
          rating: 5,
          comment: "5000 hours in and I'm still learning new things. The depth is unmatched in any MOBA.",
          date: "2024-12-14"
        },
        {
          id: 20,
          user: {
            username: "MOBAVeteran",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MOBAVeteran"
          },
          rating: 4,
          comment: "Steep learning curve but incredibly rewarding. Best esports scene in gaming.",
          date: "2024-11-22"
        },
        {
          id: 21,
          user: {
            username: "StrategyMind",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StrategyMind"
          },
          rating: 5,
          comment: "Every hero is viable, every match is different. True free-to-play done right.",
          date: "2024-10-12"
        }
      ]
    },
    {
      id: 8,
      title: "Stardew Valley",
      genre: ["Simulation", "Farming", "Relaxing", "Indie"],
      price: 524.99,
      rating: 4.9,
      description: "Escape to the countryside and build the farm of your dreams. Grow crops, raise animals, fish, forage, and mine as you restore your grandfather's old farm to glory. Make friends with the townsfolk, find love, and uncover the secrets of Stardew Valley at your own peaceful pace.",
      imageUrl: "https://eastside-online.org/wp-content/uploads/2022/03/stardewfeatureimage.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg",
      reviews: [
        {
          id: 22,
          user: {
            username: "FarmingQueen",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FarmingQueen"
          },
          rating: 5,
          comment: "The most relaxing game I've ever played. Perfect for unwinding after a long day.",
          date: "2024-12-11"
        },
        {
          id: 23,
          user: {
            username: "CozyGamer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CozyGamer"
          },
          rating: 5,
          comment: "ConcernedApe is a legend. One person made all of this! The 1.6 update is amazing.",
          date: "2024-11-30"
        },
        {
          id: 24,
          user: {
            username: "IndieSupporter",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=IndieSupporter"
          },
          rating: 5,
          comment: "Best indie game ever made. The characters feel like real friends.",
          date: "2024-10-20"
        }
      ]
    },
    {
      id: 9,
      title: "NARAKA:BLADEPOINT",
      genre: ["Battle Royale", "Martial Arts", "Action", "Multiplayer"],
      price: 824.99,
      rating: 4.3,
      description: "Experience a revolutionary battle royale featuring martial arts combat and gravity-defying mobility. Master the art of parkour, grappling hooks, and melee weapons as you battle 60 players on a mythical Eastern-inspired battlefield. Unlock legendary heroes with unique abilities and dominate the arena.",
      imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/57/Naraka_Bladepoint_cover_art_full.jpg",
      heroImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1203220/header.jpg",
      reviews: [
        {
          id: 25,
          user: {
            username: "BladeMaster",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BladeMaster"
          },
          rating: 4,
          comment: "Finally a battle royale with actual melee combat! The parkour system is so fluid.",
          date: "2024-12-09"
        },
        {
          id: 26,
          user: {
            username: "MartialArtsGamer",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MartialArtsGamer"
          },
          rating: 5,
          comment: "The combat depth is insane. Parrying and countering feels so rewarding.",
          date: "2024-11-14"
        },
        {
          id: 27,
          user: {
            username: "BREnthusiast",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BREnthusiast"
          },
          rating: 4,
          comment: "Unique take on battle royale. The grappling hook changes everything!",
          date: "2024-10-25"
        }
      ]
    }
  ]
};

export default gameData;