"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import { AppTour } from "./AppTour";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";

const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutos

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useInactivityLogout(INACTIVITY_MS);

  return (
    <div className="flex min-h-screen bg-background font-sans" role="application" aria-label="Gestión Financiera">
      <AppTour />
      <Sidebar />
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main id="main-content" className="flex-1 p-4 sm:p-6" role="main" data-tour="main">
          {children}
        </main>
      </div>
    </div>
  );
}
