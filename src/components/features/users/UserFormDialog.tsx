"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import type { User, UserRole } from "@/core/domain";

const userFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || (v.length >= 7 && v.length <= 20),
      "El teléfono debe tener entre 7 y 20 caracteres"
    ),
  role: z.enum(["ADMIN", "USER"] as const),
});

export type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
  user: User | null;
}

const defaultValues: UserFormValues = {
  name: "",
  phone: "",
  role: "ADMIN",
};

export function UserFormDialog({
  open,
  onOpenChange,
  onSubmit,
  user,
}: UserFormDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        phone: user.phone ?? "",
        role: user.role,
      });
    } else {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, open]);

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        await onSubmit(data);
        onOpenChange(false);
      } catch {
        toast.error("No se pudo guardar. Revisa los datos e intenta de nuevo.");
      }
    },
    (errors) => {
      const firstError = Object.values(errors)[0]?.message;
      toast.error(firstError ?? "Revisa los campos marcados antes de guardar.");
    }
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose>
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="user-name">Nombre</Label>
            <Input
              id="user-name"
              {...form.register("name")}
              placeholder="Nombre"
              autoComplete="name"
              aria-invalid={!!form.formState.errors.name}
              aria-describedby={form.formState.errors.name ? "user-name-error" : undefined}
            />
            {form.formState.errors.name && (
              <p id="user-name-error" className="text-sm text-destructive" role="alert">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-phone">Teléfono</Label>
            <Input
              id="user-phone"
              {...form.register("phone")}
              placeholder="+34 600 000 000"
              autoComplete="tel"
              aria-invalid={!!form.formState.errors.phone}
              aria-describedby={form.formState.errors.phone ? "user-phone-error" : undefined}
            />
            {form.formState.errors.phone && (
              <p id="user-phone-error" className="text-sm text-destructive" role="alert">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="user-role">Rol</Label>
            <Select
              value={form.watch("role")}
              onValueChange={(v) => form.setValue("role", v as UserRole)}
            >
              <SelectTrigger id="user-role">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">ADMIN</SelectItem>
                <SelectItem value="USER">USER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Guardando…" : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
