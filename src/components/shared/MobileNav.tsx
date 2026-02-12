"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/movements", label: "Movimientos", icon: ArrowLeftRight },
  { href: "/users", label: "Usuarios", icon: Users, adminOnly: true },
  { href: "/reports", label: "Reportes", icon: FileBarChart, adminOnly: true },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const router = useRouter();
  const { canAccessUsers, canAccessReports } = useRole();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showClose
        className="left-0 top-0 right-auto h-full w-[280px] max-w-[85vw] translate-x-0 translate-y-0 rounded-none border-r border-border data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
      >
        <nav className="flex flex-col gap-1 overflow-y-auto pt-4" aria-label="Menú móvil">
          {navItems.map((item) => {
            if (item.adminOnly && item.href === "/users" && !canAccessUsers)
              return null;
            if (item.adminOnly && item.href === "/reports" && !canAccessReports)
              return null;
            const isActive = router.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
