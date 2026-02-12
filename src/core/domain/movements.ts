/**
 * Domain types for financial movements (PrevalentWare - Single Responsibility)
 */

export type MovementType = "INCOME" | "EXPENSE";

export interface Movement {
  id: string;
  concept: string;
  amount: number;
  type: MovementType;
  date: string;
  userId: string;
  userName?: string;
}

export interface MovementCreateInput {
  concept: string;
  amount: number;
  type: MovementType;
  date: string;
}

export interface MovementUpdateInput extends Partial<MovementCreateInput> {
  id: string;
}
