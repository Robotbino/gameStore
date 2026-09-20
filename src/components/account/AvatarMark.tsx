import { findPreset } from "./avatarPresets";

interface AvatarMarkProps {
  avatarKey: string | null | undefined;
  /** Falls back to this person's initial when no preset is set or the key is unknown. */
  name: string;
  /** CSS length for width and height, e.g. "34px". */
  size?: string;
  className?: string;
}

/**
 * A person's avatar: their chosen preset mark, or the initial circle.
 *
 * The fallback isn't an error state — most accounts have never picked a preset,
 * and the initial circle is the design's incumbent avatar (DESIGN.md reserves
 * the full circle for exactly this). It also covers a key that no longer maps
 * to anything, which is what lets a preset be retired from the catalogue
 * without a data migration.
 *
 * Rendered as inline SVG so the marks inherit the theme's CSS custom properties
 * rather than baking hex values into an asset.
 */
export default function AvatarMark({
  avatarKey,
  name,
  size = "34px",
  className,
}: AvatarMarkProps) {
  const preset = findPreset(avatarKey);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  if (!preset) {
    return (
      <span
        className={className ? `avatar-mark ${className}` : "avatar-mark"}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {initial}
      </span>
    );
  }

  return (
    <svg
      className={
        className
          ? `avatar-mark avatar-mark-preset ${className}`
          : "avatar-mark avatar-mark-preset"
      }
      style={{ width: size, height: size }}
      viewBox="0 0 32 32"
      role="presentation"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: preset.paths }}
    />
  );
}
