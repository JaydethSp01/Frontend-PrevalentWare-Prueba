"use client";

import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/shared/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceSummary } from "@/components/features/reports/BalanceSummary";
import { IncomeExpenseChart } from "@/components/features/reports/IncomeExpenseChart";
import { DownloadCsvButton } from "@/components/features/reports/DownloadCsvButton";
import { Skeleton } from "@/components/ui/skeleton";
import { withRole } from "@/components/hoc/withRole";
import { movementsRepository } from "@/core/services";

function ReportsPage() {
  const {
    data: movements = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movements", "reports"],
    queryFn: () => movementsRepository.getAll(),
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-semibold tracking-tight">Reportes</h1>
          {!isLoading && (
            <DownloadCsvButton movements={movements} filename="reporte-movimientos.csv" />
          )}
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full max-w-md rounded-lg" />
            <Skeleton className="h-[320px] w-full rounded-lg" />
          </>
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            No se pudieron cargar los datos de reportes. Verifica tu conexión con el servidor e
            intenta nuevamente.
          </div>
        ) : (
          <>
            <BalanceSummary movements={movements} />
            <Card>
              <CardHeader>
                <CardTitle>Ingresos vs Egresos</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart movements={movements} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

export default withRole(ReportsPage, {
  requiredRole: "ADMIN",
  redirectTo: "/login",
});
