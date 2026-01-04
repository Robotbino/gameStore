import type { Game } from "../assets/gameData";

interface HeroSectionProps {
  item: Game;
}
export default function HeroSection({item}: HeroSectionProps) {
  if (!item) return null;  // Guard for null
  
  return (
    <div className="hero">
      <img 
        src={item.heroImage} 
        alt={item.title}
        className="hero-image" 
      />
      <div className="hero-content">
        <h1 className="hero-title">{item.title}</h1>
        <p className="hero-genre">{item.genre}</p>
        <p className="hero-price">R{item.price.toFixed(2)}</p>
        <button className="hero-btn">Play Now</button>
      </div>
    </div>
  );
}

