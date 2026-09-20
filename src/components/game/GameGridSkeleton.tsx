interface GameGridSkeletonProps {
  count?: number;
  /** Renders a hero-shaped block above the grid, for pages that lead with one. */
  withHero?: boolean;
}

export default function GameGridSkeleton({ count = 12, withHero = false }: GameGridSkeletonProps) {
  return (
    <div role="status" aria-label="Loading games">
      {withHero && <div className="skeleton skeleton-hero" />}
      <div className="game-grid" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="game-card-skeleton">
            <div className="game-card-skeleton-poster" />
            <div className="game-card-skeleton-line" />
            <div className="game-card-skeleton-line short" />
          </div>
        ))}
      </div>
    </div>
  );
}
