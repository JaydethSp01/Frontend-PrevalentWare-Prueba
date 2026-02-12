"use client";

import { authClient } from "@/lib/auth-client";

/**
 * Session from Better Auth (backend). No mock.
 */
export function useAuth() {
  const { data: session, isPending: authPending, error } = authClient.useSession();
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
