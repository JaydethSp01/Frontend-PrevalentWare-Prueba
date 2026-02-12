"use client";

import { authClient } from "@/lib/auth-client";


export function useAuth() {
  const { data: session, isPending: authPending, error } = authClient.useSession();
  // Debug: inspeccionar qué sesión llega realmente al frontend en producción
  if (typeof window !== "undefined") {
    // Evita logs en build/SSR
    // eslint-disable-next-line no-console
    console.log("SESSION FRONT:", session, { authPending, error });
  }
  const user = session?.user;
  const isAuthenticated = !!user;
  const isPending = !isAuthenticated && authPending;

  return {
    session,
    user: user ?? null,
    isPending,
    isAuthenticated,
    error,
  };
}
