import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Redirect } from "wouter";

interface ProtectedRouteProps {
  children: ReactNode;
  requireCliente?: boolean;
}

export default function ProtectedRoute({ children, requireCliente }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (requireCliente && user?.status !== "cliente") {
    return <Redirect to="/resultado" />;
  }

  return <>{children}</>;
}
