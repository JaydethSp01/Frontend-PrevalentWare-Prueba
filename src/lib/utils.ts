import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fecha en formato ISO o YYYY-MM-DD → día civil en local (evita desfase por UTC). */
export function formatMovementDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Extrae YYYY-MM-DD de una fecha ISO o ya en ese formato. */
export function toDateOnly(dateStr: string): string {
  return dateStr.split("T")[0];
}
