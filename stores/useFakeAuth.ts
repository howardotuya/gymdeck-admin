"use client";

import { create } from "zustand";

type FakeAuthState = {
  isSignedIn: boolean;
  setSignedIn: (isSignedIn: boolean) => void;
  signIn: () => void;
  signOut: () => void;
};

export const useFakeAuth = create<FakeAuthState>((set) => ({
  isSignedIn: true,
  setSignedIn: (isSignedIn) => set({ isSignedIn }),
  signIn: () => set({ isSignedIn: true }),
  signOut: () => set({ isSignedIn: false }),
}));
