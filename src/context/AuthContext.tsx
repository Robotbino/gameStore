import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { authService } from "../services/authService";
import { userService } from "../services/userService";
import type { LoginRequest, RegisterRequest } from "../types/auth";
import type { Role, User } from "../types/user";

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
  // Full profile from GET /users/me. Null while the fetch is in flight
  // (or if the caller is anonymous). Prefer this over userEmail/userRole
  // whenever both are available — it has the id, userName, and points.
  currentUser: User | null;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUserEmail(null);
    setUserRole(null);
    setCurrentUser(null);
  }, []);

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

  // Apply the token, then hydrate the profile from /users/me. If the profile
  // fetch fails after a valid-looking token, don't half-authenticate — a
  // useAvatar reading currentUser?.userName would flicker "?" forever, and
  // any admin gate that eventually keys on currentUser would break silently.
  const activateSession = useCallback(
    async (jwt: string | null | undefined): Promise<Role> => {
      const role = applyToken(jwt);
      try {
        const me = await userService.getMe();
        setCurrentUser(me);
      } catch {
        logout();
        throw new Error(
          "Signed in, but couldn't load your profile. Please try again.",
        );
      }
      return role;
    },
    [applyToken, logout],
  );

  // ── On mount: rehydrate from localStorage ──
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (!stored) {
      setIsLoading(false);
      return;
    }
    // Rehydrate is best-effort: an expired token or a failing /users/me is
    // an ordinary way to arrive here (backend down, token stale) and we
    // just start logged out rather than surfacing an error to the app shell.
    activateSession(stored)
      .catch(() => {
        /* already logged out inside activateSession */
      })
      .finally(() => setIsLoading(false));
  }, [activateSession]);

  // ── Actions ──
  const login = async (data: LoginRequest): Promise<Role> => {
    const res = await authService.login(data);
    return activateSession(res.access_token);
  };

  const register = async (data: RegisterRequest) => {
    const res = await authService.register(data);
    await activateSession(res.access_token);
  };

  const value: AuthContextType = {
    access_token: token,
    userEmail,
    userRole,
    currentUser,
    isAuthenticated: !!token,
    isAdmin: userRole === "ADMIN",
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
