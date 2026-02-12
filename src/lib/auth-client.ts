import { createAuthClient } from "better-auth/react";

// Normalizamos la URL para quedarnos solo con el origen (sin /api/auth)
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/auth\/?$/, "") ??
  "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: backendUrl,
  // Aseguramos que las cookies de sesión del backend se envíen
  // en las peticiones cross-origin (frontend -> backend).
  fetchOptions: {
    credentials: "include",
  },
});

export const signInWithGitHub = () => {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem("justLoggedIn", "1");
  }
  return authClient.signIn.social({
    provider: "github",
    callbackURL:
      typeof window !== "undefined" ? window.location.origin : undefined,
  });
};

export const signOut = () => {
  authClient.signOut();
};
