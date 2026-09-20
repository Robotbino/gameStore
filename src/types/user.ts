export type Role = "USER" | "ADMIN";

// Mirrors the backend UserResponse record.
// Password is intentionally absent — the DTO exists so the hash can never leak.
//
// The profile fields arrived with the backend's V4 migration. They are always
// present on the wire and always nullable: a freshly registered account has a
// userName and nothing else filled in, so every consumer needs a fallback.
// createdAt is the exception — it is NOT NULL server-side, because "member
// since" has nothing to fall back to.
export interface User {
  id: number;
  userName: string;
  email: string;
  points: number;
  role: Role;
  displayName: string | null;
  avatarKey: string | null;
  bio: string | null;
  /** ISO 3166-1 alpha-2. Render the name with Intl.DisplayNames, don't store one. */
  country: string | null;
  /** ISO-8601 local date-time, e.g. "2026-03-11T08:14:22.481". */
  createdAt: string;
}

/**
 * PUT /users/me/profile. Every field REPLACES what's stored, including with
 * null — that's what makes clearing a bio possible, and it's why the form
 * always sends all four rather than only what changed.
 */
export interface UpdateProfileRequest {
  displayName: string | null;
  avatarKey: string | null;
  bio: string | null;
  country: string | null;
}

/** PUT /users/me/account. Both values are unique server-side. */
export interface UpdateAccountRequest {
  userName: string;
  email: string;
}

/** PUT /users/me/password. Never log either field. */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * What PUT /users/me/account answers with.
 *
 * The token is not optional decoration. A JWT's subject is the user's email,
 * so the moment the email changes every token they hold names an address the
 * backend can no longer resolve — the next request is anonymous and the 401
 * interceptor throws them at /login. AuthContext.applyNewToken swaps this in.
 */
export interface AccountUpdateResponse {
  user: User;
  access_token: string;
}

/**
 * The label to show for a person: their chosen display name if they set one,
 * otherwise the unique handle they registered with.
 *
 * userName and displayName are deliberately separate on the backend —
 * userName carries a UNIQUE constraint and is the identity key, displayName
 * is a free label that can collide with anyone. Resolving the preference in
 * one place keeps the navbar, the profile header and the avatar agreeing.
 */
export function displayNameOf(user: Pick<User, "userName" | "displayName"> | null): string {
  if (!user) return "";
  const chosen = user.displayName?.trim();
  return chosen && chosen.length > 0 ? chosen : user.userName;
}
