"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Página 404 independiente: sin layout del dashboard (seguridad).
 * Quienes lleguen por una URL inexistente no ven la estructura interna de la app.
 */
export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Error 404
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Página no encontrada
        </h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          La dirección no existe o no está disponible.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}

