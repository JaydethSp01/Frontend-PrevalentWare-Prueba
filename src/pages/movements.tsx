"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/shared/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MovementsTable } from "@/components/features/movements/MovementsTable";
import { MovementFormDialog } from "@/components/features/movements/MovementFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { withSession } from "@/components/hoc/withSession";
import { movementsRepository } from "@/core/services";
import { TablePagination } from "@/components/shared/TablePagination";
import { useRole } from "@/hooks/useRole";
import type { Movement } from "@/core/domain";
import type { MovementFormValues } from "@/lib/validations/movement";
import { Plus } from "lucide-react";
import { toast } from "sonner";

function MovementsPage() {
  const queryClient = useQueryClient();
  const { canCreateMovement } = useRole();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Movement | null>(null);
  const [deleting, setDeleting] = useState<Movement | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["movements", page, pageSize],
    queryFn: () => movementsRepository.getPage(page, pageSize),
  });
  const movements = data?.items ?? [];
  const total = data?.total ?? movements.length;

  const createMutation = useMutation({
    mutationFn: (data: MovementFormValues) =>
      movementsRepository.create({
        ...data,
        date: data.date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      toast.success("Movimiento creado");
    },
    onError: () => toast.error("Error al crear"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MovementFormValues }) =>
      movementsRepository.update(id, {
        ...data,
        date: data.date,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      setEditing(null);
      toast.success("Movimiento actualizado");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => movementsRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      setDeleting(null);
      toast.success("Movimiento eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar");
      setDeleting(null);
    },
  });

  const handleSubmit = (data: MovementFormValues) => {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Movimientos
            </h1>
            {!canCreateMovement && (
              <p className="mt-1 text-sm text-muted-foreground">
                Vista de consulta: solo puedes ver ingresos y egresos.
              </p>
            )}
          </div>
          {canCreateMovement && (
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo
            </Button>
          )}
        </div>

        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-lg" />
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            No se pudieron cargar los movimientos. Verifica tu conexión con el servidor e intenta
            nuevamente.
          </div>
        ) : (
          <>
            <MovementsTable
              movements={movements}
              onEdit={canCreateMovement ? setEditing : undefined}
              onDelete={canCreateMovement ? setDeleting : undefined}
            />
            <TablePagination
              page={page}
              pageSize={pageSize}
              total={total}
              isLoading={isLoading}
              onPageChange={setPage}
            />
          </>
        )}

        <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
          <DialogContent showClose>
            <DialogHeader>
              <DialogTitle>Eliminar movimiento</DialogTitle>
              <DialogDescription>
                {deleting
                  ? `¿Eliminar "${deleting.concept}" (${deleting.type === "INCOME" ? "ingreso" : "egreso"})? Esta acción no se puede deshacer.`
                  : ""}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleting(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => deleting && deleteMutation.mutate(deleting.id)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Eliminando…" : "Eliminar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {canCreateMovement && (
          <MovementFormDialog
            open={dialogOpen || !!editing}
            onOpenChange={(open) => {
              if (!open) setEditing(null);
              setDialogOpen(open);
            }}
            onSubmit={handleSubmit}
            movement={editing}
          />
        )}
      </div>
    </Layout>
  );
}

export default withSession(MovementsPage);
