import { createAuthClient } from "better-auth/react";

const baseURL =
  typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL,
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
