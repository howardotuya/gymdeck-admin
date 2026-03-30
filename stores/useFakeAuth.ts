"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthFlowMode = "login" | "register";
export type OnboardingStepId = "business" | "location" | "team" | "finish";

export type TeamInviteDraft = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type OnboardingDraft = {
  businessLogoUrl: string;
  businessLogoFileName: string;
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  locationCountry: string;
  locationState: string;
  locationCity: string;
  locationLga: string;
  locationHouse: string;
  locationFormattedAddress: string;
  locationPlaceId: string;
  locationLatitude: number | null;
  locationLongitude: number | null;
  teamInvites: TeamInviteDraft[];
};

function createTeamInviteDraft(id: string): TeamInviteDraft {
  return {
    id,
    firstName: "",
    lastName: "",
    email: "",
  };
}

const initialOnboardingDraft: OnboardingDraft = {
  businessLogoUrl: "",
  businessLogoFileName: "",
  firstName: "",
  lastName: "",
  businessName: "",
  businessType: "",
  locationCountry: "Nigeria",
  locationState: "",
  locationCity: "",
  locationLga: "",
  locationHouse: "",
  locationFormattedAddress: "",
  locationPlaceId: "",
  locationLatitude: null,
  locationLongitude: null,
  teamInvites: [createTeamInviteDraft("invite-1")],
};

function normalizeTeamInvites(value: unknown): TeamInviteDraft[] {
  if (!Array.isArray(value)) {
    return initialOnboardingDraft.teamInvites;
  }

  const invites = value
    .map((item, index) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const candidate = item as Partial<TeamInviteDraft>;

      return {
        id:
          typeof candidate.id === "string" && candidate.id.trim().length > 0
            ? candidate.id
            : `invite-${index + 1}`,
        firstName: typeof candidate.firstName === "string" ? candidate.firstName : "",
        lastName: typeof candidate.lastName === "string" ? candidate.lastName : "",
        email: typeof candidate.email === "string" ? candidate.email : "",
      };
    })
    .filter((item): item is TeamInviteDraft => item !== null);

  return invites.length > 0 ? invites : initialOnboardingDraft.teamInvites;
}

function normalizeOnboardingDraft(value: unknown): OnboardingDraft {
  if (!value || typeof value !== "object") {
    return initialOnboardingDraft;
  }

  const draft = value as Partial<OnboardingDraft> & Record<string, unknown>;

  return {
    businessLogoUrl:
      typeof draft.businessLogoUrl === "string" ? draft.businessLogoUrl : "",
    businessLogoFileName:
      typeof draft.businessLogoFileName === "string" ? draft.businessLogoFileName : "",
    firstName: typeof draft.firstName === "string" ? draft.firstName : "",
    lastName: typeof draft.lastName === "string" ? draft.lastName : "",
    businessName: typeof draft.businessName === "string" ? draft.businessName : "",
    businessType: typeof draft.businessType === "string" ? draft.businessType : "",
    locationCountry:
      typeof draft.locationCountry === "string"
        ? draft.locationCountry
        : initialOnboardingDraft.locationCountry,
    locationState: typeof draft.locationState === "string" ? draft.locationState : "",
    locationCity: typeof draft.locationCity === "string" ? draft.locationCity : "",
    locationLga: typeof draft.locationLga === "string" ? draft.locationLga : "",
    locationHouse: typeof draft.locationHouse === "string" ? draft.locationHouse : "",
    locationFormattedAddress:
      typeof draft.locationFormattedAddress === "string"
        ? draft.locationFormattedAddress
        : "",
    locationPlaceId: typeof draft.locationPlaceId === "string" ? draft.locationPlaceId : "",
    locationLatitude:
      typeof draft.locationLatitude === "number" ? draft.locationLatitude : null,
    locationLongitude:
      typeof draft.locationLongitude === "number" ? draft.locationLongitude : null,
    teamInvites: normalizeTeamInvites(draft.teamInvites),
  };
}

type FakeAuthState = {
  hasHydrated: boolean;
  isSignedIn: boolean;
  accountEmail: string | null;
  pendingEmail: string | null;
  authMode: AuthFlowMode;
  redirectPath: string | null;
  onboardingCompleted: boolean;
  onboardingStep: OnboardingStepId;
  onboardingDraft: OnboardingDraft;
  markHydrated: () => void;
  setSignedIn: (isSignedIn: boolean) => void;
  setRedirectPath: (redirectPath: string | null) => void;
  setOnboardingStep: (step: OnboardingStepId) => void;
  updateOnboardingDraft: (payload: Partial<OnboardingDraft>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
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
      accountEmail: null,
      pendingEmail: null,
      authMode: "login",
      redirectPath: null,
      onboardingCompleted: false,
      onboardingStep: "business",
      onboardingDraft: initialOnboardingDraft,
      markHydrated: () => set({ hasHydrated: true }),
      setSignedIn: (isSignedIn) => set({ isSignedIn }),
      setRedirectPath: (redirectPath) => set({ redirectPath }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),
      updateOnboardingDraft: (payload) =>
        set((state) => ({
          onboardingDraft: {
            ...state.onboardingDraft,
            ...payload,
          },
        })),
      completeOnboarding: () =>
        set({
          onboardingCompleted: true,
          onboardingStep: "finish",
        }),
      resetOnboarding: () =>
        set({
          onboardingCompleted: false,
          onboardingStep: "business",
          onboardingDraft: initialOnboardingDraft,
        }),
      beginAuth: ({ email, mode, redirectPath }) =>
        set({
          isSignedIn: false,
          pendingEmail: email.trim(),
          accountEmail: mode === "register" ? email.trim() : null,
          authMode: mode,
          redirectPath: redirectPath ?? null,
          ...(mode === "register"
            ? {
                onboardingCompleted: false,
                onboardingStep: "business" as OnboardingStepId,
                onboardingDraft: initialOnboardingDraft,
              }
            : {}),
        }),
      resetAuthFlow: () =>
        set({
          pendingEmail: null,
          authMode: "login",
          redirectPath: null,
        }),
      signIn: () => set({ isSignedIn: true }),
      completeAuth: () =>
        set((state) => ({
          isSignedIn: true,
          accountEmail: state.pendingEmail,
          pendingEmail: null,
        })),
      signOut: () =>
        set({
          isSignedIn: false,
          accountEmail: null,
          pendingEmail: null,
          authMode: "login",
          redirectPath: null,
        }),
    }),
    {
      name: "gymdeck-admin-auth",
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return persistedState;
        }

        const state = persistedState as Partial<FakeAuthState> & Record<string, unknown>;

        return {
          ...state,
          onboardingDraft: normalizeOnboardingDraft(state.onboardingDraft),
        };
      },
      merge: (persistedState, currentState) => {
        if (!persistedState || typeof persistedState !== "object") {
          return currentState;
        }

        const state = persistedState as Partial<FakeAuthState> & Record<string, unknown>;

        return {
          ...currentState,
          ...state,
          onboardingDraft: normalizeOnboardingDraft(state.onboardingDraft),
        };
      },
      partialize: (state) => ({
        isSignedIn: state.isSignedIn,
        accountEmail: state.accountEmail,
        pendingEmail: state.pendingEmail,
        authMode: state.authMode,
        redirectPath: state.redirectPath,
        onboardingCompleted: state.onboardingCompleted,
        onboardingStep: state.onboardingStep,
        onboardingDraft: state.onboardingDraft,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    },
  ),
);
