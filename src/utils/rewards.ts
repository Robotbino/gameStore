// Mirrors RewardsService.java so the checkout preview shows the same numbers
// the server will return. The server always recomputes; this is display only.
export const POINTS_PER_RAND_EARNED = 10;
export const POINTS_PER_RAND_OFF = 100;

function floorCents(value: number): number {
  return Math.floor(value * 100 + 1e-9) / 100;
}

export function randsFor(points: number): number {
  return floorCents(points / POINTS_PER_RAND_OFF);
}

export function discountFor(balance: number, subtotal: number): number {
  if (balance <= 0) return 0;
  return Math.min(randsFor(balance), floorCents(subtotal));
}

export function pointsToRedeem(discount: number): number {
  return Math.round(discount * POINTS_PER_RAND_OFF);
}

export function pointsEarned(total: number): number {
  return Math.floor(total * POINTS_PER_RAND_EARNED + 1e-9);
}

export function canRedeem(balance: number): boolean {
  return balance >= POINTS_PER_RAND_OFF;
}

export function formatRand(value: number): string {
  return `R ${value.toFixed(2)}`;
}

export function formatPoints(points: number): string {
  return points.toLocaleString();
}
