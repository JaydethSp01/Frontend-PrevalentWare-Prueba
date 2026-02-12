"use client";

import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "@/lib/auth-client";

interface NavbarProps {
  onOpenMobileMenu?: () => void;
}

export function Navbar({ onOpenMobileMenu }: NavbarProps) {
  const { user, isAuthenticated } = useAuth();
  const { role } = useRole();

  const handleSignOut = () => {
    signOut();
    toast.success("Has cerrado sesión correctamente");
    window.location.href = "/login";
  };

  return (
    <header
      className="flex h-14 items-center justify-between gap-2 border-b border-border bg-card px-4 shadow-soft sm:px-6"
      role="banner"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {onOpenMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </Button>
        )}
        <div className="min-w-0 truncate text-sm text-muted-foreground">
        {isAuthenticated && user && (
          <span className="truncate">
            {user.name ?? user.email} ·{" "}
            <span className="font-medium text-foreground">{role}</span>
          </span>
        )}
        </div>
      </div>
      {isAuthenticated && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          aria-label="Cerrar sesión"
          className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </Button>
      )}
    </header>
  );
}
