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
import { toDateOnly } from "@/lib/utils";

interface IncomeExpenseChartProps {
  movements: Movement[];
}

const tooltipFormatter = (value: number) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-background/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
      <p className="mb-1 font-semibold text-foreground">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="flex items-center justify-between gap-2">
          <span className="font-medium" style={{ color: entry.color }}>
            {entry.name}:
          </span>
          <span className="text-foreground">
            {tooltipFormatter(entry.value ?? 0)}
          </span>
        </p>
      ))}
    </div>
  );
};

export function IncomeExpenseChart({ movements }: IncomeExpenseChartProps) {
  const data = useMemo(() => {
    const byMonth: Record<
      string,
      { key: string; month: string; ingresos: number; egresos: number }
    > = {};
    movements.forEach((m) => {
      const [y, mo] = toDateOnly(m.date).split("-").map(Number);
      const key = `${y}-${String(mo).padStart(2, "0")}`;
      const label = new Date(y, mo - 1, 1).toLocaleDateString("es-ES", {
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
          <Tooltip content={<CustomTooltip />} />
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
