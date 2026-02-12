import { createAuthClient } from "better-auth/react";

// Normalizamos la URL para quedarnos solo con el origen (sin /api/auth)
const backendUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/auth\/?$/, "") ??
  "http://localhost:8000";

export const authClient = createAuthClient({
  baseURL: backendUrl,
});

export const signInWithGitHub = () =>
  authClient.signIn.social({
    provider: "github",
  });

export const signOut = () => {
  authClient.signOut();
};
