interface StarRatingProps {
  rating: number;
}

export default function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill={
              i < fullStars
                ? "#F5C518"
                : i === fullStars && hasHalf
                  ? "url(#halfGrad)"
                  : "#3a3a3a"
            }
            stroke={
              i < fullStars || (i === fullStars && hasHalf) ? "#F5C518" : "#555"
            }
            strokeWidth="1"
          />
          {i === fullStars && hasHalf && (
            <defs>
              <linearGradient id="halfGrad">
                <stop offset="50%" stopColor="#F5C518" />
                <stop offset="50%" stopColor="#3a3a3a" />
              </linearGradient>
            </defs>
          )}
        </svg>
      ))}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
}
