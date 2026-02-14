"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { signOut } from "@/lib/auth-client";

const EVENTS = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];

/**
 * Cierra sesión y redirige a /login tras `inactivityMs` sin interacción del usuario.
 * Solo tiene efecto en el cliente (páginas que usan Layout/dashboard).
 */
export function useInactivityLogout(inactivityMs: number) {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        signOut();
        router.replace("/login");
      }, inactivityMs);
    };

    resetTimer();
    EVENTS.forEach((ev) => window.addEventListener(ev, resetTimer));

    return () => {
      EVENTS.forEach((ev) => window.removeEventListener(ev, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [inactivityMs, router]);
}
