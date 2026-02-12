"use client";

import { useAuth } from "./useAuth";
import type { UserRole } from "@/core/domain";

/**
 * RBAC: returns current user role and permission flags.
 * For this demo, all users are visually treated as ADMIN (per requirements).
 */
export function useRole() {
  const { user, isPending } = useAuth();

  const role: UserRole = ((user as { role?: string } | null)?.role as UserRole) ?? "ADMIN";
  const isAdmin = role === "ADMIN";
  const isUser = role === "USER";

  const canAccessUsers = isAdmin;
  const canAccessReports = isAdmin;
  const canCreateMovement = isAdmin;
  const canEditMovement = isAdmin;
  const canEditUser = isAdmin;

  return {
    role,
    isAdmin,
    isUser,
    canAccessUsers,
    canAccessReports,
    canCreateMovement,
    canEditMovement,
    canEditUser,
    isPending,
  };
}
