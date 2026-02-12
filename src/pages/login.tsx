"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithGitHub } from "@/lib/auth-client";
import { useAuth } from "@/hooks/useAuth";

import logoPrevalentWare from "@/assets/logo-prevalentware.png";

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated, isPending, user } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isPending || !isAuthenticated) return;

    router.replace("/");
  }, [mounted, isPending, isAuthenticated, router]);

  if (!mounted) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background p-4"
        role="status"
        aria-live="polite"
        aria-label="Cargando"
      >
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-soft-lg">
          <div className="flex flex-col items-center gap-6">
            <div className="h-20 w-48 animate-pulse rounded-lg bg-muted" />
            <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!isPending && isAuthenticated) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        role="status"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8 before:fixed before:inset-0 before:-z-10 before:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.12),transparent)]"
      role="main"
      aria-label="Iniciar sesión"
    >
      <div className="w-full max-w-[420px]">
        <article
          className="rounded-2xl border border-border bg-card shadow-soft-lg"
          aria-labelledby="login-title"
        >
          <header className="flex flex-col items-center pt-10 pb-6 text-center">
            <div className="mb-6 flex justify-center">
              <Image
                src={logoPrevalentWare}
                alt="PrevalentWare digital solutions"
                width={200}
                height={64}
                className="h-16 w-[200px] object-contain object-center"
                priority
              />
            </div>
            <h1
              id="login-title"
              className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
            >
              Gestión Financiera
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Inicia sesión para acceder al dashboard y gestionar tus
              movimientos.
            </p>
          </header>
          <div className="space-y-4 px-8 pb-10">
            <Button
              onClick={() => signInWithGitHub()}
              className="h-12 w-full rounded-xl text-base font-medium"
              size="lg"
              aria-label="Continuar con GitHub"
            >
              Continuar con GitHub
            </Button>
          </div>
        </article>
      </div>
    </main>
  );
}
