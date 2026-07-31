import axios from "axios";

/**
 * The Spring GlobalExceptionHandler answers with `{ "message": "..." }` for
 * everything it catches — "Email already in use", "Invalid email or password",
 * and so on. Swallowing that and showing a generic string turns a specific,
 * actionable failure into a mystery, so pull the real message out when there
 * is one and keep the caller's wording only as a fallback.
 *
 * Bean Validation failures also add an `errors` map, e.g.
 *   { "message": "Validation failed", "errors": { "title": "is required" } }
 * When that map is present we prefer the per-field text over the generic
 * top-level "Validation failed" — that's the actionable part.
 */

// Shared narrower: safely walk `err.response.data` when it's a Spring error body.
function readSpringErrorBody(
  error: unknown,
): { message?: string; errors?: Record<string, string> } | null {
  if (!axios.isAxiosError(error) || !error.response) return null;
  const data: unknown = error.response.data;
  if (!data || typeof data !== "object") return null;
  return data as { message?: string; errors?: Record<string, string> };
}

function isStringMap(v: unknown): v is Record<string, string> {
  if (!v || typeof v !== "object") return false;
  return Object.values(v as Record<string, unknown>).every(
    (x) => typeof x === "string",
  );
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    // No response the browser was willing to hand us. A stopped backend is the
    // obvious cause, but a CORS rejection looks identical from here — and the
    // backend allowlists only http://localhost:5173, so a dev server that
    // drifted to 5174 lands in this branch with the API perfectly healthy.
    if (!error.response) {
      return (
        "Couldn't reach the server. Check the backend is running on port 8181, " +
        "and that this page is on http://localhost:5173 (the only origin it accepts)."
      );
    }

    const body = readSpringErrorBody(error);
    if (body) {
      // Field errors first — the top-level "Validation failed" tells the user
      // nothing they don't already know from the fact that the request bounced.
      if (isStringMap(body.errors) && Object.keys(body.errors).length > 0) {
        return Object.entries(body.errors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join("; ");
      }
      if (typeof body.message === "string") {
        return body.message;
      }
    }

    return fallback;
  }

  // Non-Axios errors are ours — applyToken throws these, and its wording is
  // already written for the user.
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Return the raw per-field validation map from a 400, or null if the response
 * wasn't a bean-validation failure. Forms that want to highlight individual
 * inputs can use this without reparsing the response.
 */
export function getFieldErrors(
  error: unknown,
): Record<string, string> | null {
  const body = readSpringErrorBody(error);
  if (!body || !isStringMap(body.errors)) return null;
  return Object.keys(body.errors).length > 0 ? body.errors : null;
}
