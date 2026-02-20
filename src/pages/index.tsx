"use client";
 
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeftRight, Users, FileBarChart } from "lucide-react";
import { withSession } from "@/components/hoc/withSession";
import { Layout } from "@/components/shared/Layout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRole } from "@/hooks/useRole";
import { movementsRepository, usersRepository } from "@/core/services";
import { cn, formatMovementDate } from "@/lib/utils";

const quickLinks = [
  { href: "/movements", label: "Movimientos", icon: ArrowLeftRight, primary: true },
  { href: "/users", label: "Usuarios", icon: Users, adminOnly: true },
  { href: "/reports", label: "Reportes", icon: FileBarChart, adminOnly: true },
];

function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { canAccessUsers, canAccessReports, isUser } = useRole();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;

    const justLoggedIn = window.sessionStorage.getItem("justLoggedIn");
    if (justLoggedIn === "1") {
      toast.success("Has iniciado sesión correctamente");
      window.sessionStorage.removeItem("justLoggedIn");
    }
  }, [mounted]);

  const {
    data: movements = [],
    isLoading: isLoadingMovements,
    error: errorMovements,
  } = useQuery({
    queryKey: ["movements", "home-summary"],
    queryFn: () => movementsRepository.getAll(),
  });

  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error: errorUsers,
  } = useQuery({
    queryKey: ["users", "home-summary"],
    queryFn: () => usersRepository.getAll(),
    enabled: canAccessUsers,
  });

  const { income, expense, balance, recent } = useMemo(() => {
    if (!movements.length) {
      return { income: 0, expense: 0, balance: 0, recent: [] as typeof movements };
    }
    const incomeTotal = movements
      .filter((m) => m.type === "INCOME")
      .reduce((sum, m) => sum + m.amount, 0);
    const expenseTotal = movements
      .filter((m) => m.type === "EXPENSE")
      .reduce((sum, m) => sum + m.amount, 0);
    const recentMovements = movements.slice(0, 5);
    return {
      income: incomeTotal,
      expense: expenseTotal,
      balance: incomeTotal - expenseTotal,
      recent: recentMovements,
    };
  }, [movements]);

  if (!mounted) {
    return (
      <Layout>
        <div className="space-y-10">
          <div className="space-y-2">
            <Skeleton className="h-4 w-40 rounded-lg" />
            <Skeleton className="h-9 w-64 rounded-lg" />
            <Skeleton className="h-5 w-80 rounded-lg" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </Layout>
    );
  }

  const visibleLinks = quickLinks.filter((link) => {
    if (link.adminOnly && link.href === "/users" && !canAccessUsers) return false;
    if (link.adminOnly && link.href === "/reports" && !canAccessReports) return false;
    return true;
  });

  const totalUsers = users.length;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = formatMovementDate;

  const isLoadingSummary = isLoadingMovements || (canAccessUsers && isLoadingUsers);
  const hasErrorSummary = !!errorMovements || (!!errorUsers && canAccessUsers);

  return (
    <Layout>
      <div className="relative space-y-10">
        <header className="space-y-3">
          <nav
            aria-label="Breadcrumb"
            className="text-xs font-medium text-muted-foreground/70 sm:text-sm"
          >
            <ol className="flex items-center gap-1">
              <li>Inicio</li>
              <li aria-hidden className="px-1 text-muted-foreground/50">
                /
              </li>
              <li className="text-foreground">Dashboard</li>
            </ol>
          </nav>
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Resumen financiero
            </h1>
            <p className="text-muted-foreground">
              {isUser
                ? "Vista de consulta: revisa tu balance y los últimos movimientos."
                : "Controla el balance, usuarios y reportes desde un solo lugar."}
            </p>
          </div>
        </header>

        <section
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Accesos rápidos y resumen"
        >
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const tourId = link.href === "/" ? "home" : link.href.slice(1);
            const isPrimary = link.primary;

            return (
              <Link
                key={link.href}
                href={link.href}
                data-tour={`card-${tourId}`}
                className={cn(
                  "group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isPrimary && "sm:col-span-2 lg:col-span-2"
                )}
              >
                <Card
                  className={cn(
                    "cursor-pointer rounded-2xl border border-border bg-card/90 text-card-foreground shadow-soft transition-all duration-200 hover:border-primary/40 hover:shadow-soft-lg hover:shadow-primary/10",
                    isPrimary &&
                      "bg-gradient-to-br from-primary/10 via-background to-background hover:shadow-soft-xl"
                  )}
                >
                  <CardHeader className="flex flex-row items-center gap-4 p-6">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25",
                        isPrimary && "h-14 w-14"
                      )}
                    >
                      <Icon className={cn("h-6 w-6", isPrimary && "h-7 w-7")} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1">
                      <CardTitle className={cn("text-lg font-semibold", isPrimary && "text-xl")}>
                        {link.label}
                      </CardTitle>
                      <CardDescription className="mt-0.5">
                        {link.href === "/movements" &&
                          hasErrorSummary &&
                          "No se pudo cargar el resumen. Intenta nuevamente más tarde."}
                        {link.href === "/movements" &&
                          !hasErrorSummary &&
                          !isLoadingSummary &&
                          movements.length > 0 && (
                          <span>
                            Balance actual:{" "}
                            <span className="font-medium text-foreground">
                              {formatCurrency(balance)}
                            </span>{" "}
                            · Ingresos: {formatCurrency(income)} · Egresos: {formatCurrency(expense)}
                          </span>
                        )}
                        {link.href === "/movements" &&
                          !hasErrorSummary &&
                          (isLoadingSummary || movements.length === 0) &&
                          "Ver y gestionar tus movimientos."}
                        {link.href === "/users" &&
                          (canAccessUsers
                            ? isLoadingUsers
                              ? "Cargando usuarios…"
                              : `Usuarios registrados: ${totalUsers}`
                            : "Solo disponible para administradores.")}
                        {link.href === "/reports" &&
                          (canAccessReports
                            ? "Gráficos, saldo consolidado y exportación CSV."
                            : "Solo disponible para administradores.")}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </section>

        <section className="space-y-3" aria-label="Actividad reciente">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold tracking-tight">Últimos movimientos</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Se muestran los 5 movimientos más recientes.
            </p>
          </div>

          {isLoadingMovements ? (
            <Skeleton className="h-40 w-full rounded-lg" />
          ) : recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay movimientos registrados. Empieza creando tu primer ingreso o egreso.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border bg-card/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((m) => (
                    <TableRow key={m.id} className="uppercase">
                      <TableCell className="font-medium">{m.concept}</TableCell>
                      <TableCell>{formatCurrency(m.amount)}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {m.type === "INCOME" ? "INGRESO" : "EGRESO"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(m.date)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}

export default withSession(HomePage);
