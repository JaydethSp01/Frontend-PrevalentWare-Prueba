"use client";

import { useEffect, useRef } from "react";
import { useRole } from "@/hooks/useRole";

const TOUR_STORAGE_KEY = "app_tour_done";

export function AppTour() {
  const { isAdmin } = useRole();
  const started = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !isAdmin || started.current) return;
    if (window.localStorage.getItem(TOUR_STORAGE_KEY)) return;

    const runTour = async () => {
      const { driver } = await import("driver.js");
      await import("driver.js/dist/driver.css");

      const baseSteps = [
        {
          element: "body",
          popover: {
            title: "¡Bienvenido a Gestión Financiera!",
            description:
              "Este recorrido te muestra las secciones principales. Puedes saltarlo con Esc o el botón.",
            side: "bottom" as const,
            align: "center" as const,
          },
        },
        {
          element: "#tour-sidebar",
          popover: {
            title: "Menú de navegación",
            description:
              "Desde aquí accedes a Inicio, Movimientos, Usuarios y Reportes en máximo un par de clics.",
            side: "right" as const,
            align: "start" as const,
          },
        },
        {
          element: "#main-content",
          popover: {
            title: "Área de contenido",
            description: "Aquí verás el dashboard, tablas y reportes según la sección elegida.",
            side: "bottom" as const,
            align: "start" as const,
          },
        },
        {
          element: '[data-tour="card-movements"]',
          popover: {
            title: "Movimientos",
            description: "Registra ingresos y egresos, edita conceptos y montos.",
            side: "top" as const,
            align: "center" as const,
          },
        },
      ];

      const optionalSteps = [
        {
          element: '[data-tour="card-users"]',
          popover: {
            title: "Usuarios (Admin)",
            description: "Como administrador puedes ver y editar usuarios.",
            side: "top" as const,
            align: "center" as const,
          },
        },
        {
          element: '[data-tour="card-reports"]',
          popover: {
            title: "Reportes",
            description: "Saldo actual, gráfico ingresos vs egresos y descarga CSV.",
            side: "top" as const,
            align: "center" as const,
          },
        },
      ];

      const steps = [
        ...baseSteps,
        ...optionalSteps.filter((s) => document.querySelector(s.element)),
      ];

      const driverObj = driver({
        showProgress: true,
        steps,
        onDestroyStarted: () => {
          window.localStorage.setItem(TOUR_STORAGE_KEY, "1");
          driverObj.destroy();
        },
      });

      started.current = true;
      driverObj.drive();
    };

    const t = setTimeout(runTour, 800);
    return () => clearTimeout(t);
  }, [isAdmin]);

  return null;
}
