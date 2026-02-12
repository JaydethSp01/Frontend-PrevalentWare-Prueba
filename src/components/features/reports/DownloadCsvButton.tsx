"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { Movement } from "@/core/domain";

interface DownloadCsvButtonProps {
  movements: Movement[];
  filename?: string;
}

export function DownloadCsvButton({
  movements,
  filename = "movimientos.csv",
}: DownloadCsvButtonProps) {
  const download = () => {
    const headers = ["Concepto", "Monto", "Tipo", "Fecha", "Usuario"];
    const rows = movements.map((m) => [
      `"${m.concept.replace(/"/g, '""')}"`,
      m.amount.toFixed(2),
      m.type,
      m.date,
      m.userName ?? m.userId,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={download} variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Descargar CSV
    </Button>
  );
}
