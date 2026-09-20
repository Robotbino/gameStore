/**
 * The avatar preset catalogue.
 *
 * Why code-authored SVG rather than image files: `public/` holds nothing but
 * Vite's default logo, and PRODUCT.md forbids inventing assets whose source and
 * licensing this repo can't account for. Geometry we draw ourselves has no
 * provenance problem, costs no network request, and scales to any size.
 *
 * Why a key in the database rather than a URL: nothing is uploaded and nothing
 * is served, so there is no storage decision, no size/type validation, and no
 * broken-image state. The backend stores a 32-char string it only shape-checks;
 * the catalogue lives here, which means retiring a mark needs no backend
 * release — `findPreset` returns null for an unknown key and every caller
 * already has to handle the initial-circle fallback for people who never
 * picked one.
 *
 * Why these look the way they do: DESIGN.md's One Voice Rule allows exactly one
 * accent (Marquee Gold) plus the neutral ladder. A set of colourful characters
 * would shatter that, so the marks vary by geometry and by how much gold they
 * spend instead of by hue. They read as a set because they are all the same two
 * colours arranged differently — which is the point.
 */

export interface AvatarPreset {
  id: string;
  /** Used as the option's accessible name in the picker. */
  label: string;
  /** SVG children, drawn in a 0 0 32 32 viewBox. */
  paths: string;
}

const GOLD = "var(--accent, #F5C518)";
const INK = "var(--bg-primary, #121212)";
const RAISED = "var(--bg-raised, #1a1a1a)";
const LINE = "var(--border-strong, #333333)";

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "marquee-01",
    label: "Solid",
    paths: `<circle cx="16" cy="16" r="16" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-02",
    label: "Ring",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <circle cx="16" cy="16" r="10" fill="none" stroke="${GOLD}" stroke-width="4"/>`,
  },
  {
    id: "marquee-03",
    label: "Half",
    paths: `<circle cx="16" cy="16" r="16" fill="${RAISED}"/>
            <path d="M16 0a16 16 0 0 1 0 32Z" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-04",
    label: "Bulb",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <circle cx="16" cy="16" r="6" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-05",
    label: "Bars",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <rect x="8"  y="9" width="4" height="14" rx="2" fill="${LINE}"/>
            <rect x="14" y="9" width="4" height="14" rx="2" fill="${GOLD}"/>
            <rect x="20" y="9" width="4" height="14" rx="2" fill="${LINE}"/>`,
  },
  {
    id: "marquee-06",
    label: "Corner",
    paths: `<circle cx="16" cy="16" r="16" fill="${RAISED}"/>
            <path d="M0 16A16 16 0 0 1 16 0v16Z" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-07",
    label: "Diamond",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <rect x="16" y="6" width="14" height="14" rx="2" transform="rotate(45 16 6)" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-08",
    label: "Slash",
    paths: `<circle cx="16" cy="16" r="16" fill="${RAISED}"/>
            <path d="M6 24 24 6" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/>`,
  },
  {
    id: "marquee-09",
    label: "Eclipse",
    paths: `<circle cx="16" cy="16" r="16" fill="${GOLD}"/>
            <circle cx="21" cy="16" r="11" fill="${INK}"/>`,
  },
  {
    id: "marquee-10",
    label: "Grid",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <rect x="8"  y="8"  width="7" height="7" rx="1.5" fill="${GOLD}"/>
            <rect x="17" y="8"  width="7" height="7" rx="1.5" fill="${LINE}"/>
            <rect x="8"  y="17" width="7" height="7" rx="1.5" fill="${LINE}"/>
            <rect x="17" y="17" width="7" height="7" rx="1.5" fill="${GOLD}"/>`,
  },
  {
    id: "marquee-11",
    label: "Arc",
    paths: `<circle cx="16" cy="16" r="16" fill="${INK}"/>
            <path d="M16 4a12 12 0 0 1 12 12" fill="none" stroke="${GOLD}" stroke-width="4" stroke-linecap="round"/>
            <path d="M16 28A12 12 0 0 1 4 16" fill="none" stroke="${LINE}" stroke-width="4" stroke-linecap="round"/>`,
  },
  {
    id: "marquee-12",
    label: "Pillar",
    paths: `<circle cx="16" cy="16" r="16" fill="${RAISED}"/>
            <rect x="13" y="4" width="6" height="24" rx="3" fill="${GOLD}"/>`,
  },
];

/** null for an unknown or missing key — callers fall back to the initial circle. */
export function findPreset(key: string | null | undefined): AvatarPreset | null {
  if (!key) return null;
  return AVATAR_PRESETS.find((preset) => preset.id === key) ?? null;
}
