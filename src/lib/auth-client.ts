import { createAuthClient } from "better-auth/react";

const backendUrl =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

export const authClient = createAuthClient({
  baseURL: backendUrl || "http://localhost:8000",
});

export const signInWithGitHub = () =>
  authClient.signIn.social({
    provider: "github",
    callbackURL:
      typeof window !== "undefined" ? `${window.location.origin}` : "/",
  });

export const signOut = () => {
  authClient.signOut();
};
