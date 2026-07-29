import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
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
  access_token: string | null;
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

  // Throws when the token can't be used. Returning a role we never actually
  // applied is what made a failed register look like a success: the caller
  // navigated to a protected route, ProtectedRoute saw isAuthenticated=false,
  // and bounced the user to /login with nothing explaining why.
  const applyToken = useCallback((jwt: string | null | undefined): Role => {
    if (!jwt) {
      localStorage.removeItem("token");
      throw new Error("The server didn't return an access token.");
    }

    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(jwt);
    } catch {
      localStorage.removeItem("token");
      throw new Error("The server returned a token we couldn't read.");
    }

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      throw new Error("That session has expired. Please sign in again.");
    }

    const role: Role = (decoded.role as Role) ?? "USER";
    localStorage.setItem("token", jwt);
    setToken(jwt);
    setUserEmail(decoded.sub);
    setUserRole(role);
    return role;
  }, []);

  // ── On mount: rehydrate from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      try {
        applyToken(stored);
      } catch {
        // An expired or malformed stored token is an ordinary way to arrive
        // here, not an error worth surfacing — just start logged out.
      }
    }
    setIsLoading(false);
  }, [applyToken]);

  // ── Actions ──
  const login = async (data: LoginRequest): Promise<Role> => {
    const res = await authService.login(data);
    return applyToken(res.access_token);
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    applyToken(res.access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail(null);
    setUserRole(null);
  };

  const value: AuthContextType = {
    access_token: token,
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
