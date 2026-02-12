"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { movementFormSchema, type MovementFormValues } from "@/lib/validations/movement";
import type { Movement } from "@/core/domain";

interface MovementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MovementFormValues) => void | Promise<void>;
  movement?: Movement | null;
}

const defaultValues: MovementFormValues = {
  concept: "",
  amount: 0,
  type: "EXPENSE",
  date: new Date().toISOString().slice(0, 10),
};

export function MovementFormDialog({
  open,
  onOpenChange,
  onSubmit,
  movement,
}: MovementFormDialogProps) {
  const form = useForm<MovementFormValues>({
    resolver: zodResolver(movementFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (movement) {
      form.reset({
        concept: movement.concept,
        amount: movement.amount,
        type: movement.type,
        date: movement.date.slice(0, 10),
      });
    } else {
      form.reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movement?.id, open]);

  const handleSubmit = form.handleSubmit(
    async (data) => {
      try {
        await onSubmit(data);
        form.reset(defaultValues);
        onOpenChange(false);
      } catch {
        toast.error("No se pudo guardar el movimiento. Revisa los datos e intenta de nuevo.");
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
          <DialogTitle>
            {movement ? "Editar movimiento" : "Nuevo movimiento"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="concept">Concepto</Label>
            <Input
              id="concept"
              aria-invalid={!!form.formState.errors.concept}
              aria-describedby={form.formState.errors.concept ? "concept-error" : undefined}
              {...form.register("concept")}
              placeholder="Descripción del movimiento"
            />
            {form.formState.errors.concept && (
              <p id="concept-error" className="text-sm text-destructive" role="alert">
                {form.formState.errors.concept.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              aria-invalid={!!form.formState.errors.amount}
              aria-describedby={form.formState.errors.amount ? "amount-error" : undefined}
              {...form.register("amount", {
                setValueAs: (v) => (v === "" || v === undefined ? NaN : Number(v)),
              })}
              placeholder="0.00"
            />
            {form.formState.errors.amount && (
              <p id="amount-error" className="text-sm text-destructive" role="alert">
                {form.formState.errors.amount.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(v) =>
                form.setValue("type", v as "INCOME" | "EXPENSE")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Ingreso</SelectItem>
                <SelectItem value="EXPENSE">Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Fecha</Label>
            <Input
              id="date"
              type="date"
              aria-invalid={!!form.formState.errors.date}
              aria-describedby={form.formState.errors.date ? "date-error" : undefined}
              {...form.register("date")}
            />
            {form.formState.errors.date && (
              <p id="date-error" className="text-sm text-destructive" role="alert">
                {form.formState.errors.date.message}
              </p>
            )}
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
              {movement ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
