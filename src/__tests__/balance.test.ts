import { describe, it, expect } from "vitest";
import type { Movement } from "@/core/domain";

/**
 * Cálculo de Saldo: validar que la suma de ingresos menos egresos sea correcta.
 */
function calculateBalance(movements: Movement[]): number {
  const income = movements
    .filter((m) => m.type === "INCOME")
    .reduce((s, m) => s + m.amount, 0);
  const expense = movements
    .filter((m) => m.type === "EXPENSE")
    .reduce((s, m) => s + m.amount, 0);
  return income - expense;
}

describe("Cálculo de Saldo", () => {
  it("debe calcular el saldo como ingresos menos egresos", () => {
    const movements: Movement[] = [
      { id: "1", concept: "A", amount: 100, type: "INCOME", date: "2025-01-01", userId: "u1" },
      { id: "2", concept: "B", amount: 30, type: "EXPENSE", date: "2025-01-02", userId: "u1" },
      { id: "3", concept: "C", amount: 50, type: "EXPENSE", date: "2025-01-03", userId: "u1" },
    ];
    expect(calculateBalance(movements)).toBe(100 - 30 - 50);
    expect(calculateBalance(movements)).toBe(20);
  });

  it("debe devolver 0 cuando no hay movimientos", () => {
    expect(calculateBalance([])).toBe(0);
  });

  it("debe permitir saldo negativo", () => {
    const movements: Movement[] = [
      { id: "1", concept: "E", amount: 100, type: "EXPENSE", date: "2025-01-01", userId: "u1" },
    ];
    expect(calculateBalance(movements)).toBe(-100);
  });
});
