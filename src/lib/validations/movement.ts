import { z } from "zod";

const SANITIZE_REGEX = /<script|javascript:|on\w+=|<\/script>/gi;

function sanitizeConcept(value: string): string {
  return value.replace(SANITIZE_REGEX, "").trim();
}

/**
 * Input sanitization: positive amounts, concepts without malicious scripts.
 */
export const movementFormSchema = z.object({
  concept: z
    .string()
    .min(1, "El concepto es requerido")
    .max(500)
    .transform(sanitizeConcept)
    .refine((v) => v.length >= 1, "El concepto no puede quedar vacío"),
  amount: z
    .number({ invalid_type_error: "El monto debe ser un número válido" })
    .refine((n) => !Number.isNaN(n), "El monto es requerido")
    .refine((n) => n > 0, "El monto debe ser mayor que cero"),
  type: z.enum(["INCOME", "EXPENSE"]),
  date: z.string().min(1, "La fecha es requerida"),
});

export type MovementFormValues = z.infer<typeof movementFormSchema>;
