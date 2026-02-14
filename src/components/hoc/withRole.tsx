"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import type { UserRole } from "@/core/domain";

interface WithRoleOptions {
  requiredRole: UserRole;
  redirectTo?: string;
}

const spinner = (
  <div className="min-h-screen bg-background">
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  </div>
);

/**
 * HOC: Protects pages by role. Non-ADMIN cannot access /users or /reports.
 * Usa "mounted" para que el primer HTML coincida en servidor y cliente (evita hydration error).
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithRoleOptions
) {
  const { requiredRole, redirectTo = "/login" } = options;

  return function RoleGuard(props: P) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, isPending: authPending } = useAuth();
    const { role, isPending: rolePending } = useRole();

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted || authPending || rolePending) return;
      if (!isAuthenticated) {
        router.replace(redirectTo);
        return;
      }
      if (requiredRole === "ADMIN" && role !== "ADMIN") {
        router.replace("/");
        return;
      }
    }, [mounted, isAuthenticated, authPending, rolePending, role, router]);

    if (!mounted || authPending || rolePending) return spinner;
    if (!isAuthenticated) return null;
    if (requiredRole === "ADMIN" && role !== "ADMIN") return null;

    return <WrappedComponent {...props} />;
  };
}
