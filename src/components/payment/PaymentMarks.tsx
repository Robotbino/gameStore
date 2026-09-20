// Inline SVG marks styled after familiar payment brands. The store's economy
// is simulated (see PRODUCT.md), so these are decorative cues on a demo
// checkout, never a live integration. Colors come from checkout.css.

interface MarkProps {
  className?: string;
}

export function StripeMark({ className }: MarkProps) {
  return (
    <svg
      className={`pay-mark ${className ?? ""}`}
      viewBox="0 0 64 28"
      role="img"
      aria-labelledby="mark-stripe"
    >
      <title id="mark-stripe">Stripe</title>
      <rect width="64" height="28" rx="6" fill="var(--brand-stripe)" />
      <text
        x="32"
        y="19"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="14"
        letterSpacing="-0.4"
        fill="#fff"
      >
        stripe
      </text>
    </svg>
  );
}

export function PayflexMark({ className }: MarkProps) {
  return (
    <svg
      className={`pay-mark ${className ?? ""}`}
      viewBox="0 0 96 28"
      role="img"
      aria-labelledby="mark-payflex"
    >
      <title id="mark-payflex">Payflex</title>
      <text
        x="0"
        y="19"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="15"
        letterSpacing="-0.3"
        fill="var(--text-primary)"
      >
        pay
        <tspan fill="var(--brand-payflex)">flex</tspan>
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={64 + i * 8}
          y="10"
          width="6"
          height="8"
          rx="2"
          fill="var(--brand-payflex)"
          opacity={1 - i * 0.2}
        />
      ))}
    </svg>
  );
}

export function VisaMark({ className }: MarkProps) {
  return (
    <svg
      className={`pay-mark ${className ?? ""}`}
      viewBox="0 0 48 28"
      role="img"
      aria-labelledby="mark-visa"
    >
      <title id="mark-visa">Visa</title>
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="800"
        fontStyle="italic"
        fontSize="19"
        letterSpacing="-0.5"
        fill="var(--brand-visa)"
      >
        VISA
      </text>
    </svg>
  );
}

export function MastercardMark({ className }: MarkProps) {
  return (
    <svg
      className={`pay-mark ${className ?? ""}`}
      viewBox="0 0 30 28"
      role="img"
      aria-labelledby="mark-mastercard"
    >
      <title id="mark-mastercard">Mastercard</title>
      <circle cx="10" cy="14" r="9" fill="var(--brand-mc-red)" />
      <circle cx="20" cy="14" r="9" fill="var(--brand-mc-orange)" />
      <path d="M15 6.52 A9 9 0 0 1 15 21.48 A9 9 0 0 1 15 6.52 Z" fill="var(--brand-mc-blend)" />
    </svg>
  );
}
