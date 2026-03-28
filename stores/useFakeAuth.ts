"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthFlowMode = "login" | "register";

type FakeAuthState = {
  hasHydrated: boolean;
  isSignedIn: boolean;
  pendingEmail: string | null;
  authMode: AuthFlowMode;
  redirectPath: string | null;
  markHydrated: () => void;
  setSignedIn: (isSignedIn: boolean) => void;
  setRedirectPath: (redirectPath: string | null) => void;
  beginAuth: (payload: {
    email: string;
    mode: AuthFlowMode;
    redirectPath?: string | null;
  }) => void;
  resetAuthFlow: () => void;
  signIn: () => void;
  completeAuth: () => void;
  signOut: () => void;
};

export const useFakeAuth = create<FakeAuthState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      isSignedIn: false,
      pendingEmail: null,
      authMode: "login",
      redirectPath: null,
      markHydrated: () => set({ hasHydrated: true }),
      setSignedIn: (isSignedIn) => set({ isSignedIn }),
      setRedirectPath: (redirectPath) => set({ redirectPath }),
      beginAuth: ({ email, mode, redirectPath }) =>
        set({
          isSignedIn: false,
          pendingEmail: email.trim(),
          authMode: mode,
          redirectPath: redirectPath ?? null,
        }),
      resetAuthFlow: () =>
        set({
          pendingEmail: null,
          authMode: "login",
          redirectPath: null,
        }),
      signIn: () => set({ isSignedIn: true }),
      completeAuth: () =>
        set({
          isSignedIn: true,
          pendingEmail: null,
        }),
      signOut: () =>
        set({
          isSignedIn: false,
          pendingEmail: null,
          authMode: "login",
          redirectPath: null,
        }),
    }),
    {
      name: "gymdeck-admin-auth",
      partialize: (state) => ({
        isSignedIn: state.isSignedIn,
        pendingEmail: state.pendingEmail,
        authMode: state.authMode,
        redirectPath: state.redirectPath,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
