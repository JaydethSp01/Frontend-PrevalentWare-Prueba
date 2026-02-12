"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Movement } from "@/core/domain";

interface BalanceSummaryProps {
  movements: Movement[];
}

export function BalanceSummary({ movements }: BalanceSummaryProps) {
  const income = movements
    .filter((m) => m.type === "INCOME")
    .reduce((s, m) => s + m.amount, 0);
  const expense = movements
    .filter((m) => m.type === "EXPENSE")
    .reduce((s, m) => s + m.amount, 0);
  const balance = income - expense;

  return (
    <div>
      <Card className="overflow-hidden border-2 border-primary/20 shadow-soft-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium text-muted-foreground">
            Saldo actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={`text-3xl font-bold tabular-nums ${
              balance >= 0 ? "text-emerald-400" : "text-destructive"
            }`}
          >
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(balance)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Ingresos: +
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(income)}{" "}
            · Egresos: −
            {new Intl.NumberFormat("es-ES", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(expense)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
