import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode
import { authService } from "../services/authService";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import type { Role } from "../types/user";

// ── Shape of the decoded JWT payload ──
interface JwtPayload {
  sub: string; // email (Spring Security subject)
  role?: string; // "USER" or "ADMIN" — added as a claim in your backend
  exp: number;
}

// ── What AuthContext exposes to consumers ──
interface AuthContextType {
  token: string | null;
  userEmail: string | null;
  userRole: Role | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean; // true while we check for a stored token on mount
  login: (data: LoginRequest) => Promise<Role>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Helper: decode a token and update state ──
  const applyToken = useCallback((jwt: string): Role => {
    try {
      const decoded = jwtDecode<JwtPayload>(jwt);

      // Check expiry
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        return "USER";
      }

      const role: Role = (decoded.role as Role) ?? "USER";
      localStorage.setItem("token", jwt);
      setToken(jwt);
      setUserEmail(decoded.sub);
      setUserRole(role);
      return role;
    } catch {
      localStorage.removeItem("token");
      return "USER";
    }
  }, []);

  // ── On mount: rehydrate from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      applyToken(stored);
    }
    setIsLoading(false);
  }, [applyToken]);

  // ── Actions ──
  const login = async (data: LoginRequest): Promise<Role> => {
    const res = await authService.login(data);
    return applyToken(res.token);
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    applyToken(res.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail(null);
    setUserRole(null);
  };

  const value: AuthContextType = {
    token,
    userEmail,
    userRole,
    isAuthenticated: !!token,
    isAdmin: userRole === "ADMIN",
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
