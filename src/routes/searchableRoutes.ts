import { matchPath } from "react-router-dom";

/**
 * Routes that render the navbar search box. An allowlist, kept next to
 * AppRoutes.tsx: a new store page opts in by adding its pattern here; account,
 * checkout and admin pages stay search-free by default.
 */
export const SEARCHABLE_ROUTES = ["/", "/browse", "/games/:id", "/library", "/wishlist"];

export function isSearchableRoute(pathname: string): boolean {
  return SEARCHABLE_ROUTES.some((pattern) => matchPath(pattern, pathname) !== null);
}
