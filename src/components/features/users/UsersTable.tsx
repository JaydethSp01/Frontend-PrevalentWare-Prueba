"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";
import type { User } from "@/core/domain";
import { useRole } from "@/hooks/useRole";

interface UsersTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  const { canEditUser } = useRole();
  const showActions = canEditUser && (onEdit || onDelete);

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Correo</TableHead>
          <TableHead>Teléfono</TableHead>
          <TableHead>Rol</TableHead>
          {showActions && (
            <TableHead className="w-[100px] text-right">Acciones</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-medium">{u.name}</TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell className="text-muted-foreground">
              {u.phone ?? "—"}
            </TableCell>
            <TableCell>
              <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                {u.role}
              </Badge>
            </TableCell>
            {showActions && (
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(u)}
                      aria-label="Editar usuario"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(u)}
                      aria-label="Eliminar usuario"
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
