import type { ReactNode } from "react";

interface AuthShellProps {
  /** Warm, contextual heading, e.g. "Welcome back". */
  heading: string;
  /** The original functional line, e.g. "Sign in to your account". */
  subtitle: string;
  /** The auth form. */
  children: ReactNode;
  /** The cross-link line below the form. */
  footer: ReactNode;
}

// A pure-CSS wall of poster silhouettes behind the stage spotlight — evokes the
// catalogue without shipping any image asset. Purely decorative; aria-hidden.
// A few are "lit" (a faint gold inner edge) as if catching the marquee light.
const POSTERS = Array.from({ length: 12 }, (_, i) => i);

/**
 * "The Midnight Marquee" front door. A two-panel frame: a cinematic brand stage
 * on the left and the task card on the right. Below 900px the stage hides and a
 * compact wordmark appears inside the card, so the brand is never lost.
 */
export default function AuthShell({
  heading,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="auth-page">
      <aside className="auth-stage">
        <div className="auth-stage-posters" aria-hidden="true">
          {POSTERS.map((i) => (
            <div
              key={i}
              className={`auth-poster ${i % 5 === 2 ? "lit" : ""}`}
            />
          ))}
        </div>

        <div className="auth-stage-content">
          <span className="auth-brand">
            Game<span className="accent">Store</span>
          </span>
        </div>

        <div className="auth-stage-copy">
          <h2 className="auth-stage-headline">Discover. Collect. Play.</h2>
          <p className="auth-stage-sub">
            Browse the catalogue and build a library that&rsquo;s yours.
          </p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-card">
          <span className="auth-card-brand">
            Game<span className="accent">Store</span>
          </span>
          <h1 className="auth-heading">{heading}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          {footer}
        </div>
      </main>
    </div>
  );
}
