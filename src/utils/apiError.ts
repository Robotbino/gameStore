import axios from "axios";

/**
 * The Spring GlobalExceptionHandler answers with `{ "message": "..." }` for
 * everything it catches — "Email already in use", "Invalid email or password",
 * and so on. Swallowing that and showing a generic string turns a specific,
 * actionable failure into a mystery, so pull the real message out when there
 * is one and keep the caller's wording only as a fallback.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    // No response at all: the request never reached the backend.
    if (!error.response) {
      return "Couldn't reach the server. Is the backend running on port 8181?";
    }

    const data: unknown = error.response.data;
    if (
      data &&
      typeof data === "object" &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
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
