import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { UserStatus } from "@/types";
import { AuthService } from "@/services/supabase";
import type { DatabaseUser } from "@/lib/supabase-types";

// Local User type for the frontend (maps from DatabaseUser)
export interface FrontendUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  company: string;
  createdAt: string;
}

const STORAGE_KEY = "vendorpass_user";

interface AuthContextType {
  user: FrontendUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string, company: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  switchProfile: (status: UserStatus) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapDatabaseUserToFrontend(dbUser: DatabaseUser): FrontendUser {
  return {
    id: dbUser.id,
    name: dbUser.name || "Usuária",
    email: dbUser.email,
    status: dbUser.status as UserStatus,
    company: dbUser.company_name || "",
    createdAt: dbUser.created_at,
  };
}

// Helper functions for localStorage persistence
function loadUser(): FrontendUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUserToStorage(user: FrontendUser | null): void {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage full or unavailable
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FrontendUser | null>(() => loadUser());

  // Persist user changes to localStorage
  useEffect(() => {
    saveUserToStorage(user);
  }, [user]);

  // On mount, try to restore Supabase session
  useEffect(() => {
    const restoreSession = async () => {
      const result = await AuthService.getCurrentUser();
      if (result.user) {
        setUser(mapDatabaseUserToFrontend(result.user));
      }
    };
    // Only try if user is null (no localStorage)
    if (!user) {
      restoreSession();
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await AuthService.signIn(email, password);
    if (result.success && result.user) {
      setUser(mapDatabaseUserToFrontend(result.user));
      return { success: true };
    }
    return { success: false, error: result.error || "Erro ao fazer login" };
  }, []);

  const register = useCallback(async (email: string, password: string, name: string, company: string) => {
    const result = await AuthService.signUp(email, password, {
      name,
      company_name: company,
    });

    if (result.success) {
      // Auto-login after registration (in mock mode)
      const signInResult = await AuthService.signIn(email, password);
      if (signInResult.success && signInResult.user) {
        setUser(mapDatabaseUserToFrontend(signInResult.user));
        return { success: true };
      }
      return { success: true };
    }
    return { success: false, error: result.error || "Erro ao criar conta" };
  }, []);

  const logout = useCallback(async () => {
    await AuthService.signOut();
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return AuthService.resetPassword(email);
  }, []);

  const switchProfile = useCallback((status: UserStatus) => {
    if (user) {
      setUser({
        ...user,
        status,
        company: status === "lead" ? "MS Consultoria" : "Ana Tech Solutions",
        name: status === "lead" ? "Maria Silva" : "Ana Oliveira",
      });
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, forgotPassword, switchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
