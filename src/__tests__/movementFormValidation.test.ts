import { describe, it, expect } from "vitest";
import { movementFormSchema } from "@/lib/validations/movement";

/**
 * Form Validation: validar que el formulario de "Nuevo Movimiento"
 * rechace montos negativos.
 */
describe("Validación formulario Nuevo Movimiento", () => {
  it("debe rechazar montos negativos", () => {
    const result = movementFormSchema.safeParse({
      concept: "Test",
      amount: -100,
      type: "EXPENSE",
      date: "2025-01-01",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes("amount"))).toBe(true);
    }
  });

  it("debe rechazar monto cero", () => {
    const result = movementFormSchema.safeParse({
      concept: "Test",
      amount: 0,
      type: "EXPENSE",
      date: "2025-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("debe aceptar monto positivo", () => {
    const result = movementFormSchema.safeParse({
      concept: "Ingreso test",
      amount: 50.5,
      type: "INCOME",
      date: "2025-01-01",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.amount).toBe(50.5);
    }
  });

  it("debe sanitizar conceptos con scripts maliciosos", () => {
    const result = movementFormSchema.safeParse({
      concept: "Pago <script>alert(1)</script> normal",
      amount: 10,
      type: "EXPENSE",
      date: "2025-01-01",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.concept).not.toContain("<script>");
    }
  });
});
