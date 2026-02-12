"use client";

import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  page,
  pageSize,
  total,
  isLoading = false,
  onPageChange,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  const clampedPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const end = total === 0 ? 0 : Math.min(total, clampedPage * pageSize);

  const canPrev = clampedPage > 1;
  const canNext = clampedPage < totalPages;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 text-sm text-muted-foreground sm:flex-row">
      <div>
        {total === 0 ? "Sin resultados" : `Mostrando ${start}–${end} de ${total}`}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => canPrev && onPageChange(clampedPage - 1)}
          disabled={!canPrev || isLoading}
        >
          Anterior
        </Button>
        <span className="min-w-[80px] text-center">
          Página {total === 0 ? 0 : clampedPage} de {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => canNext && onPageChange(clampedPage + 1)}
          disabled={!canNext || isLoading}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

