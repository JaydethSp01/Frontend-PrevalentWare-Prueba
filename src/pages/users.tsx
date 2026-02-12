"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/shared/Layout";
import { UsersTable } from "@/components/features/users/UsersTable";
import { UserFormDialog } from "@/components/features/users/UserFormDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { withRole } from "@/components/hoc/withRole";
import { usersRepository } from "@/core/services";
import { TablePagination } from "@/components/shared/TablePagination";
import type { User } from "@/core/domain";
import type { UserFormValues } from "@/components/features/users/UserFormDialog";
import { toast } from "sonner";

function UsersPage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<User | null>(null);
  const [deleting, setDeleting] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => usersRepository.getPage(page, pageSize),
  });
  const users = data?.items ?? [];
  const total = data?.total ?? users.length;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserFormValues }) =>
      usersRepository.update(id, {
        name: data.name,
        role: data.role,
        phone: data.phone && data.phone.trim().length > 0 ? data.phone.trim() : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setEditing(null);
      toast.success("Usuario actualizado");
    },
    onError: () => toast.error("Error al actualizar"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleting(null);
      toast.success("Usuario eliminado");
    },
    onError: () => {
      toast.error("Error al eliminar");
      setDeleting(null);
    },
  });

  const handleEditSubmit = (data: UserFormValues) => {
    if (editing) updateMutation.mutate({ id: editing.id, data });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight">Usuarios</h1>
        {isLoading ? (
          <Skeleton className="h-[400px] w-full rounded-lg" />
        ) : error ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            No se pudieron cargar los usuarios. Verifica tu conexión con el servidor e intenta
            nuevamente.
          </div>
        ) : (
          <>
            <UsersTable
              users={users}
              onEdit={setEditing}
              onDelete={setDeleting}
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

        <UserFormDialog
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          onSubmit={handleEditSubmit}
          user={editing}
        />

        <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
          <DialogContent showClose>
            <DialogHeader>
              <DialogTitle>Eliminar usuario</DialogTitle>
              <DialogDescription>
                {deleting
                  ? `¿Eliminar a "${deleting.name}" (${deleting.email})? Se eliminarán también sus sesiones y movimientos. Esta acción no se puede deshacer.`
                  : ""}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleting(null)}>
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
      </div>
    </Layout>
  );
}

export default withRole(UsersPage, {
  requiredRole: "ADMIN",
  redirectTo: "/login",
});
