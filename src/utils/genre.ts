/**
 * The backend stores `genre` as a single String column, and the admin form
 * asks for it comma-separated ("Action, RPG, Adventure"). Anywhere we want to
 * render genres as separate chips, split it here rather than re-doing the
 * trimming and empty-segment handling at each call site.
 */
export function parseGenres(genre: string | null | undefined): string[] {
  if (!genre) return [];
  return genre
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
}
