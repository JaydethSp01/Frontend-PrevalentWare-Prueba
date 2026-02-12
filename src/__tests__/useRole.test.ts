import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRole } from "@/hooks/useRole";

const mockUseAuth = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

describe("useRole RBAC Hook", () => {
  beforeEach(() => {
    mockUseAuth.mockReset();
  });

  it("debe devolver permisos de ADMIN cuando el usuario tiene rol ADMIN", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", name: "Admin", email: "a@b.com", role: "ADMIN" },
      isPending: false,
    });
    const { result } = renderHook(() => useRole());
    expect(result.current.role).toBe("ADMIN");
    expect(result.current.isAdmin).toBe(true);
    expect(result.current.canAccessUsers).toBe(true);
    expect(result.current.canAccessReports).toBe(true);
    expect(result.current.canCreateMovement).toBe(true);
    expect(result.current.canEditMovement).toBe(true);
    expect(result.current.canEditUser).toBe(true);
  });

  it("debe devolver permisos de USER cuando el usuario tiene rol USER", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "2", name: "User", email: "u@b.com", role: "USER" },
      isPending: false,
    });
    const { result } = renderHook(() => useRole());
    expect(result.current.role).toBe("USER");
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isUser).toBe(true);
    expect(result.current.canAccessUsers).toBe(false);
    expect(result.current.canAccessReports).toBe(false);
    expect(result.current.canCreateMovement).toBe(false);
    expect(result.current.canEditMovement).toBe(false);
    expect(result.current.canEditUser).toBe(false);
  });

  it("debe tratar usuario sin rol como ADMIN (visualmente por defecto)", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "3", name: "New", email: "n@b.com" },
      isPending: false,
    });
    const { result } = renderHook(() => useRole());
    expect(result.current.role).toBe("ADMIN");
    expect(result.current.isAdmin).toBe(true);
  });
});
