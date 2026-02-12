"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * HOC: Session Guard. Redirects to login if no active Better Auth session.
 * Usa "mounted" para que el primer HTML coincida en servidor y cliente (evita hydration error).
 */
export function withSession<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: { redirectTo?: string }
) {
  const redirectTo = options?.redirectTo ?? "/login";

  return function SessionGuard(props: P) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated, isPending } = useAuth();

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (!mounted) return;
      if (isPending) return;
      if (!isAuthenticated) router.replace(redirectTo);
    }, [mounted, isAuthenticated, isPending, router]);

    if (!mounted) {
      return (
        <div className="min-h-screen bg-background">
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      );
    }
    if (isPending) {
      return (
        <div className="min-h-screen bg-background">
          <div className="flex min-h-screen items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </div>
      );
    }
    if (!isAuthenticated) return null;

    return <WrappedComponent {...props} />;
  };
}
