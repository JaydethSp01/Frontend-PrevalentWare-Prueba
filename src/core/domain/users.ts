/**
 * Domain types for users (PrevalentWare)
 */

export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  image?: string;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
}
