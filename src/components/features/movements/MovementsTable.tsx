"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Movement } from "@/core/domain";
import { useRole } from "@/hooks/useRole";

interface MovementsTableProps {
  movements: Movement[];
  onEdit?: (movement: Movement) => void;
  onDelete?: (movement: Movement) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MovementsTable({ movements, onEdit, onDelete }: MovementsTableProps) {
  const { canEditMovement } = useRole();
  const showActions = canEditMovement && (onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Concepto</TableHead>
          <TableHead>Monto</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Usuario</TableHead>
          {showActions && (
            <TableHead className="w-[100px] text-right">Acciones</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {movements.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-medium">{m.concept}</TableCell>
            <TableCell className="uppercase">{formatAmount(m.amount)}</TableCell>
            <TableCell>
              <Badge
                variant={m.type === "INCOME" ? "success" : "warning"}
                className="uppercase"
              >
                {m.type === "INCOME" ? "INGRESO" : "EGRESO"}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatDate(m.date)}
            </TableCell>
            <TableCell>{m.userName ?? m.userId}</TableCell>
            {showActions && (
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(m)}
                      aria-label="Editar movimiento"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(m)}
                      aria-label="Eliminar movimiento"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
