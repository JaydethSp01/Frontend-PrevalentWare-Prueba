"use client";

import Link from "next/link";
import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">
            Error 404
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Página no encontrada
          </h1>
          <p className="max-w-md text-sm text-muted-foreground sm:text-base">
            La ruta que intentas abrir no existe o ya no está disponible. Revisa la URL o vuelve al
            panel principal.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Volver al dashboard</Link>
        </Button>
      </div>
    </Layout>
  );
}

