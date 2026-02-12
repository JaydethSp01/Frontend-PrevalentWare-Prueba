"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Users,
  FileBarChart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/hooks/useRole";

import logoPrevalentWare from "@/assets/logo-prevalentware.png";

const navItems = [
  { href: "/", label: "Inicio", icon: LayoutDashboard },
  { href: "/movements", label: "Movimientos", icon: ArrowLeftRight },
  { href: "/users", label: "Usuarios", icon: Users, adminOnly: true },
  { href: "/reports", label: "Reportes", icon: FileBarChart, adminOnly: true },
];

export function Sidebar() {
  const router = useRouter();
  const { canAccessUsers, canAccessReports } = useRole();

  return (
    <aside
      id="tour-sidebar"
      className="hidden w-60 flex-col border-r border-border bg-card shadow-soft lg:flex"
      aria-label="Navegación principal"
    >
      <div className="flex h-20 items-center gap-3 border-b border-border bg-gradient-to-r from-background via-card/95 to-card px-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shadow-soft-lg">
          <Image
            src={logoPrevalentWare}
            alt="PrevalentWare digital solutions"
            width={96}
            height={32}
            className="h-8 w-24 shrink-0 object-contain drop-shadow-[0_0_8px_rgba(0,0,0,0.7)]"
            priority
          />
        </div>
        <span className="truncate text-sm font-semibold tracking-tight text-foreground">
          Gestión Financiera
        </span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3" aria-label="Menú">
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
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card",
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
    </aside>
  );
}
