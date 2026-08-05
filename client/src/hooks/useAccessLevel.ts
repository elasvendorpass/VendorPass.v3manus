import { useAuth } from "./useAuth";

export type AccessLevel = "visitor" | "lead" | "cliente";

export function useAccessLevel(): AccessLevel {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return "visitor";
  if (user?.status === "lead") return "lead";
  if (user?.status === "cliente") return "cliente";
  return "visitor";
}
