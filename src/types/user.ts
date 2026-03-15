export type Role = "USER" | "ADMIN";

export interface User {
  id: number;
  userName: string;
  email: string;
  points: number;
  role: Role;
}