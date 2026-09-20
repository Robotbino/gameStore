/**
 * Country codes for the profile's region field.
 *
 * Only the codes are shipped. The human-readable names come from
 * `Intl.DisplayNames`, which every target browser has had since 2021 — so a
 * ~250-entry name table would be dead weight that goes stale (and would only
 * ever be in English). The backend stores the code for the same reason: a
 * stored name would be a snapshot of one language at one moment.
 *
 * ZA leads the list because the store prices in Rand.
 */
const CODES = [
  "ZA", "AE", "AR", "AT", "AU", "BE", "BR", "CA", "CH", "CL", "CN", "CO",
  "CZ", "DE", "DK", "EG", "ES", "FI", "FR", "GB", "GH", "GR", "HK", "HR",
  "HU", "ID", "IE", "IL", "IN", "IT", "JP", "KE", "KR", "MA", "MX", "MY",
  "NG", "NL", "NO", "NZ", "PE", "PH", "PL", "PT", "RO", "RS", "RU", "SA",
  "SE", "SG", "SK", "TH", "TR", "TW", "UA", "US", "VN", "ZM", "ZW",
];

export interface CountryOption {
  code: string;
  name: string;
}

/**
 * Codes paired with their names in the browser's language, sorted by name so
 * the list reads alphabetically to whoever is looking at it — which a
 * code-sorted list would not.
 *
 * Falls back to the bare code if Intl.DisplayNames is unavailable or has no
 * name for a region: a two-letter code is a worse label than a name, but a
 * crashed select is worse than both.
 */
export function countryOptions(): CountryOption[] {
  let regionNames: Intl.DisplayNames | null = null;
  try {
    regionNames = new Intl.DisplayNames(undefined, { type: "region" });
  } catch {
    regionNames = null;
  }

  return CODES.map((code) => ({
    code,
    name: regionNames?.of(code) ?? code,
  })).sort((a, b) => a.name.localeCompare(b.name));
}

/** The display name for a stored code, or null when nothing is stored. */
export function countryName(code: string | null | undefined): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(undefined, { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}
