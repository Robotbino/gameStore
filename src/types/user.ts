export type Role = "USER" | "ADMIN";

// Mirrors the backend UserResponse record: id, userName, email, role, points.
// Password is intentionally absent — the DTO exists so the hash can never leak.
export interface User {
  id: number;
  userName: string;
  email: string;
  points: number;
  role: Role;
}