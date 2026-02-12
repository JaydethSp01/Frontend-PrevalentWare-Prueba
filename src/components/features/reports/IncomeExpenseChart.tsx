"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";
import type { Movement } from "@/core/domain";

interface IncomeExpenseChartProps {
  movements: Movement[];
}

export function IncomeExpenseChart({ movements }: IncomeExpenseChartProps) {
  const data = useMemo(() => {
    const byMonth: Record<
      string,
      { key: string; month: string; ingresos: number; egresos: number }
    > = {};
    movements.forEach((m) => {
      const date = new Date(m.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const label = date.toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit",
      });
      if (!byMonth[key]) {
        byMonth[key] = { key, month: label, ingresos: 0, egresos: 0 };
      }
      if (m.type === "INCOME") byMonth[key].ingresos += m.amount;
      else byMonth[key].egresos += m.amount;
    });
    return Object.values(byMonth).sort((a, b) => a.key.localeCompare(b.key));
  }, [movements]);

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="month" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "COP",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(value)
            }
          />
          <Legend />
          <Bar
            dataKey="ingresos"
            fill="rgb(16, 185, 129)"
            name="Ingresos"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="egresos"
            fill="rgb(245, 158, 11)"
            name="Egresos"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
