"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/logo";
import { ImageUploadField, Input, Select } from "@/components/ui";
import {
  formFieldComfortableClassName,
} from "@/components/ui/fieldStyles";
import {
  useFakeAuth,
  type OnboardingStepId,
  type TeamInviteDraft,
} from "@/stores/useFakeAuth";
import { AddressMapField } from "./addressMapField";
import {
  businessTypeOptions,
  countryCodeByCountryName,
  locationCountryOptions,
  locationStateOptionsByCountry,
  onboardingSteps,
  onboardingStepOrder,
} from "./data";

const labelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-full border border-border-soft bg-bg-surface px-5 text-[14px] font-medium text-text-support transition-colors hover:bg-bg-action-soft";

const ghostButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-full px-4 text-[14px] font-medium text-text-secondary transition-colors hover:bg-bg-action-soft hover:text-text-primary";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-[14px] font-semibold text-text-inverse shadow-[0_1px_2px_rgba(16,24,40,0.08)] transition-all hover:bg-brand-primary-hover";

const brandSoftBadgeClassName =
  "rounded-full border border-border-soft bg-bg-subtle px-4 py-2 text-[12px] font-medium text-text-secondary";

const stepContent = {
  business: {
    eyebrow: "Step 1 of 4",
    title: "Set up the business identity.",
    description:
      "Add the essentials only: logo, workspace name, owner, and business type.",
  },
  location: {
    eyebrow: "Step 2 of 4",
    title: "Set the first location.",
    description:
      "Search or click the map, then confirm the address details GymDeck extracted.",
  },
  team: {
    eyebrow: "Step 3 of 4",
    title: "Invite the first operators.",
    description:
      "Keep this optional. Add teammates now or leave it for later from the dashboard.",
  },
  finish: {
    eyebrow: "Step 4 of 4",
    title: "Review and continue.",
    description:
      "Check the basics once, then enter GymDeck and finish the rest inside the product.",
  },
} satisfies Record<
  OnboardingStepId,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
>;

const sidePanelContent = {
  business: {
    eyebrow: "GymDeck launch",
    title: "Shape the workspace staff will recognize first.",
    description:
      "Start with the gym name, logo, and owner details that should stay consistent across the GymDeck admin and member-facing surfaces.",
    sectionTitle: "What this step sets up",
    items: [
      {
        title: "Workspace identity",
        description:
          "Your business name and logo become the foundation for the workspace.",
      },
      {
        title: "Owner record",
        description:
          "The primary contact stays tied to the workspace from the start.",
      },
      {
        title: "Business type",
        description:
          "Single-location, multi-location, or franchise keeps the setup flexible.",
      },
    ],
    pills: ["Brand first", "Gym ready", "Operator friendly"],
  },
  location: {
    eyebrow: "First branch",
    title: "Pin down the first location members should find.",
    description:
      "This is the club address GymDeck can use for maps, branch context, schedules, and public-facing location details.",
    sectionTitle: "What this step sets up",
    items: [
      {
        title: "Branch address",
        description:
          "Set the primary club address people should see when they open the workspace.",
      },
      {
        title: "Map-assisted setup",
        description:
          "Search or tap the map to prefill the city, state, and local area faster.",
      },
      {
        title: "Launch-ready location data",
        description:
          "Get the branch details in place before classes, staff, and listings grow.",
      },
    ],
    pills: ["Map assisted", "Branch ready", "Member visible"],
  },
  team: {
    eyebrow: "Opening team",
    title: "Bring in the operators who will run opening day.",
    description:
      "Invite managers or front-desk staff now if you want a fast handoff, or keep the launch lean and add them later from inside GymDeck.",
    sectionTitle: "What this step sets up",
    items: [
      {
        title: "Optional invites",
        description:
          "You can skip this step without blocking the rest of the workspace launch.",
      },
      {
        title: "Early operator access",
        description:
          "Add the first people who need to help with schedules, members, or front desk flow.",
      },
      {
        title: "Flexible staffing later",
        description:
          "Roles and deeper permissions can still be refined after onboarding.",
      },
    ],
    pills: ["Invite later", "Launch lean", "Team flexible"],
  },
  finish: {
    eyebrow: "Ready to enter",
    title: "Check the essentials, then open the workspace.",
    description:
      "You only need the basics in place to enter GymDeck. Everything else can keep evolving from settings after launch.",
    sectionTitle: "What is ready now",
    items: [
      {
        title: "Identity confirmed",
        description:
          "The workspace already has the brand and business details needed to begin.",
      },
      {
        title: "First branch captured",
        description:
          "Your opening location is ready for staff and member-facing context.",
      },
      {
        title: "Team can grow later",
        description:
          "Add more operators, locations, and setup details once you are inside the product.",
      },
    ],
    pills: ["Launch ready", "Edit anytime", "GymDeck admin"],
  },
} satisfies Record<
  OnboardingStepId,
  {
    eyebrow: string;
    title: string;
    description: string;
    sectionTitle: string;
    items: Array<{
      title: string;
      description: string;
    }>;
    pills: string[];
  }
>;

type OnboardingPageProps = {
  mapApiKey: string;
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2" htmlFor={htmlFor}>
      <span className={labelClassName}>{label}</span>
      {children}
    </label>
  );
}

function SurfaceCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        "rounded-[28px] border border-border-soft bg-bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04),0_16px_36px_rgba(16,24,40,0.06)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

function FormShell({
  title,
  description,
  aside,
  children,
}: {
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <SurfaceCard className="p-5 sm:p-7">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 border-b border-border-soft pb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-[24px] font-semibold tracking-[-0.04em] text-text-primary sm:text-[28px]">
                {title}
              </h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
                {description}
              </p>
            </div>
            {aside ? <div className="shrink-0">{aside}</div> : null}
          </div>
        </div>
        {children}
      </div>
    </SurfaceCard>
  );
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read file."));
    };

    reader.onerror = () => reject(reader.error ?? new Error("Unable to read file."));
    reader.readAsDataURL(file);
  });
}

function createInvite(id: number): TeamInviteDraft {
  return {
    id: `invite-${id}`,
    firstName: "",
    lastName: "",
    email: "",
  };
}

export function OnboardingPage({ mapApiKey }: OnboardingPageProps) {
  const router = useRouter();
  const draft = useFakeAuth((state) => state.onboardingDraft);
  const activeStep = useFakeAuth((state) => state.onboardingStep);
  const redirectPath = useFakeAuth((state) => state.redirectPath);
  const accountEmail = useFakeAuth((state) => state.accountEmail);
  const setRedirectPath = useFakeAuth((state) => state.setRedirectPath);
  const setOnboardingStep = useFakeAuth((state) => state.setOnboardingStep);
  const updateOnboardingDraft = useFakeAuth((state) => state.updateOnboardingDraft);
  const completeOnboarding = useFakeAuth((state) => state.completeOnboarding);
  const signOut = useFakeAuth((state) => state.signOut);
  const teamInvites = Array.isArray(draft.teamInvites) ? draft.teamInvites : [];

  const businessStepComplete =
    (draft.firstName ?? "").trim().length > 0 &&
    (draft.lastName ?? "").trim().length > 0 &&
    (draft.businessName ?? "").trim().length > 0 &&
    (draft.businessType ?? "").trim().length > 0;
  const locationStepComplete =
    (draft.locationCountry ?? "").trim().length > 0 &&
    (draft.locationState ?? "").trim().length > 0 &&
    (draft.locationCity ?? "").trim().length > 0 &&
    (draft.locationLga ?? "").trim().length > 0 &&
    (draft.locationHouse ?? "").trim().length > 0;

  const hasIncompleteInvites = teamInvites.some((invite) => {
    const hasAnyValue =
      invite.firstName.trim().length > 0 ||
      invite.lastName.trim().length > 0 ||
      invite.email.trim().length > 0;

    if (!hasAnyValue) {
      return false;
    }

    return (
      invite.firstName.trim().length === 0 ||
      invite.lastName.trim().length === 0 ||
      invite.email.trim().length === 0
    );
  });

  const finishDestination = redirectPath ?? "/";
  const baseStateOptions =
    locationStateOptionsByCountry[
      draft.locationCountry as keyof typeof locationStateOptionsByCountry
    ] ?? [];
  const countryOptions =
    draft.locationCountry.trim().length > 0 &&
    !locationCountryOptions.some((option) => option.value === draft.locationCountry)
      ? [{ value: draft.locationCountry, label: draft.locationCountry }, ...locationCountryOptions]
      : locationCountryOptions;
  const stateOptions =
    draft.locationState.trim().length > 0 &&
    !baseStateOptions.some((option) => option.value === draft.locationState)
      ? [{ value: draft.locationState, label: draft.locationState }, ...baseStateOptions]
      : baseStateOptions;
  const selectedCountryCode = countryCodeByCountryName[draft.locationCountry] ?? undefined;
  const currentStepContent = stepContent[activeStep];
  const currentStepIndex = onboardingStepOrder.indexOf(activeStep);
  const currentSidePanelContent = sidePanelContent[activeStep];
  const completedInviteCount = teamInvites.filter(
    (invite) =>
      invite.firstName.trim().length > 0 &&
      invite.lastName.trim().length > 0 &&
      invite.email.trim().length > 0,
  ).length;

  const goToNextStep = () => {
    const currentIndex = onboardingStepOrder.indexOf(activeStep);
    const nextStep = onboardingStepOrder[currentIndex + 1];

    if (nextStep) {
      setOnboardingStep(nextStep);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = onboardingStepOrder.indexOf(activeStep);
    const previousStep = onboardingStepOrder[currentIndex - 1];

    if (previousStep) {
      setOnboardingStep(previousStep);
    }
  };

  const updateInvite = (inviteId: string, patch: Partial<TeamInviteDraft>) => {
    updateOnboardingDraft({
      teamInvites: teamInvites.map((invite) =>
        invite.id === inviteId ? { ...invite, ...patch } : invite,
      ),
    });
  };

  const addInvite = () => {
    updateOnboardingDraft({
      teamInvites: [...teamInvites, createInvite(teamInvites.length + 1)],
    });
  };

  const removeInvite = (inviteId: string) => {
    if (teamInvites.length <= 1) {
      updateOnboardingDraft({
        teamInvites: [createInvite(1)],
      });
      return;
    }

    updateOnboardingDraft({
      teamInvites: teamInvites.filter((invite) => invite.id !== inviteId),
    });
  };

  const handleBusinessLogoSelect = async (file: File) => {
    try {
      const previewUrl = await readFileAsDataUrl(file);

      updateOnboardingDraft({
        businessLogoUrl: previewUrl,
        businessLogoFileName: file.name,
      });
    } catch {
      toast.error("We could not process that logo. Try a different image.");
    }
  };

  const handleBusinessLogoRemove = () => {
    updateOnboardingDraft({
      businessLogoUrl: "",
      businessLogoFileName: "",
    });
  };

  const handleBusinessContinue = () => {
    if (!businessStepComplete) {
      toast.error("Add the workspace details before continuing.");
      return;
    }

    goToNextStep();
  };

  const handleLocationContinue = () => {
    if (!locationStepComplete) {
      toast.error("Complete the location details before continuing.");
      return;
    }

    goToNextStep();
  };

  const handleTeamContinue = () => {
    if (hasIncompleteInvites) {
      toast.error("Each team invite needs a first name, last name, and email.");
      return;
    }

    goToNextStep();
  };

  const handleFinish = () => {
    completeOnboarding();
    setRedirectPath(null);
    router.replace(finishDestination);
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/auth/login");
  };

  return (
    <div className="onboarding-shell min-h-screen bg-bg-page">
      <div className="mx-auto max-w-[1380px] lg:px-4 lg:py-4">
        <div className="grid items-start gap-0 lg:grid-cols-[0.8fr_1.2fr] lg:gap-5">
          <SurfaceCard className="relative overflow-hidden border-white/10 bg-[#1b1b1f] text-white shadow-[0_20px_60px_rgba(16,24,40,0.18)] lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
            <div className="absolute inset-0">
              <Image
                src="/assets/background.jpg"
                alt=""
                fill
                className="object-cover"
                priority
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.42)_48%,rgba(0,0,0,0.56)_100%)]" />
            </div>

            <div className="relative flex h-full flex-col p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <BrandLogo textClassName="text-white" />
                </div>

                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/76">
                  New GymDeck workspace
                </span>
              </div>

              <div className="mt-10 max-w-[28rem] space-y-6">
                <div className="space-y-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/64">
                    {currentSidePanelContent.eyebrow}
                  </p>
                  <h1 className="max-w-[13ch] text-[30px] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[36px]">
                    {currentSidePanelContent.title}
                  </h1>
                  <p className="max-w-[38ch] text-[14px] leading-[1.7] text-white/72">
                    {currentSidePanelContent.description}
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/62">
                    {currentSidePanelContent.sectionTitle}
                  </p>
                  <div className="mt-3 space-y-3">
                    {currentSidePanelContent.items.map((item) => (
                      <div key={item.title} className="flex items-start gap-3">
                        <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/72" />
                        <div>
                          <p className="text-[13px] font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-[12px] leading-[1.6] text-white/62">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {currentSidePanelContent.pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-medium text-white/76"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SurfaceCard>

          <div className="flex min-h-screen flex-col gap-4 px-4 py-4 sm:px-6 sm:py-6 lg:min-h-[calc(100vh-2rem)] lg:px-0 lg:py-0">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-muted">
                    {currentStepContent.eyebrow}
                  </span>

                  <div className="flex min-w-0 flex-1 gap-2 sm:max-w-[220px]" aria-hidden="true">
                    {onboardingSteps.map((step, index) => {
                      const isActive = step.id === activeStep;
                      const isComplete = index < currentStepIndex;

                      return (
                        <span
                          key={step.id}
                          className={clsx(
                            "h-1.5 flex-1 rounded-full transition-colors",
                            isActive
                              ? "bg-text-primary"
                              : isComplete
                                ? "bg-border-strong"
                                : "bg-border-soft",
                          )}
                        />
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-[13px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                >
                  Sign out
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {activeStep === "business" ? (
                <FormShell
                  title="Create workspace"
                  description="This step sets the business identity staff will recognize across the admin."
                  aside={<div className={brandSoftBadgeClassName}>Required fields only</div>}
                >
                  <div className="space-y-5">
                    <div>
                      <ImageUploadField
                        id="onboarding-business-logo"
                        label="Business logo"
                        hint="Optional now. Add the logo used across the admin workspace and profile surfaces."
                        fileName={draft.businessLogoFileName || undefined}
                        previewUrl={draft.businessLogoUrl || undefined}
                        previewLabel="Business logo"
                        previewObjectFit="contain"
                        previewHeight={180}
                        emptyStateTitle="Upload business logo"
                        emptyStateDescription="Drag and drop a JPG, PNG, or WebP logo here, or click to browse."
                        onSelect={handleBusinessLogoSelect}
                        onRemove={handleBusinessLogoRemove}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="First name" htmlFor="owner-first-name">
                        <Input
                          id="owner-first-name"
                          type="text"
                          value={draft.firstName}
                          onChange={(event) =>
                            updateOnboardingDraft({ firstName: event.target.value })
                          }
                          className={formFieldComfortableClassName}
                          placeholder="Jane"
                          autoComplete="given-name"
                        />
                      </Field>

                      <Field label="Last name" htmlFor="owner-last-name">
                        <Input
                          id="owner-last-name"
                          type="text"
                          value={draft.lastName}
                          onChange={(event) =>
                            updateOnboardingDraft({ lastName: event.target.value })
                          }
                          className={formFieldComfortableClassName}
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </Field>
                    </div>

                    <Field label="Gym or business name" htmlFor="business-name">
                      <Input
                        id="business-name"
                        type="text"
                        value={draft.businessName}
                        onChange={(event) =>
                          updateOnboardingDraft({ businessName: event.target.value })
                        }
                        className={formFieldComfortableClassName}
                        placeholder="GymDeck Yaba"
                      />
                    </Field>

                    <Field label="Business type">
                      <Select
                        id="business-type"
                        options={businessTypeOptions}
                        value={draft.businessType}
                        onChange={(value) =>
                          updateOnboardingDraft({ businessType: String(value) })
                        }
                        placeholder="Select business type"
                      />
                    </Field>

                    <Field label="Account email">
                      <Input
                        id="account-email"
                        type="email"
                        value={accountEmail ?? "email@example.com"}
                        readOnly
                        muted
                        density="comfortable"
                      />
                    </Field>

                    <div className="flex items-center justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleBusinessContinue}
                        className={primaryButtonClassName}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </FormShell>
              ) : null}

              {activeStep === "location" ? (
                <FormShell
                  title="Set up location"
                  description="Choose the first address people should see. The map helps prefill the rest."
                >
                  <div className="space-y-5">
                    <div className="rounded-[24px] border border-border-soft bg-bg-subtle p-4">
                      <AddressMapField
                        apiKey={mapApiKey}
                        countryCode={selectedCountryCode}
                        value={draft.locationFormattedAddress}
                        latitude={draft.locationLatitude}
                        longitude={draft.locationLongitude}
                        onSearchChange={(value) =>
                          updateOnboardingDraft({ locationFormattedAddress: value })
                        }
                        onAddressPick={(patch) => updateOnboardingDraft(patch)}
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Country">
                        <Select
                          id="location-country"
                          options={countryOptions}
                          value={draft.locationCountry}
                          onChange={(value) => {
                            const nextCountry = String(value);
                            const nextStateOptions =
                              locationStateOptionsByCountry[
                                nextCountry as keyof typeof locationStateOptionsByCountry
                              ] ?? [];
                            const nextState = nextStateOptions.some(
                              (option) => option.value === draft.locationState,
                            )
                              ? draft.locationState
                              : "";

                            updateOnboardingDraft({
                              locationCountry: nextCountry,
                              locationState: nextState,
                            });
                          }}
                          placeholder="Select country"
                        />
                      </Field>

                      <Field label="State">
                        {stateOptions.length > 0 ? (
                          <Select
                            id="location-state"
                            options={stateOptions}
                            value={draft.locationState}
                            onChange={(value) =>
                              updateOnboardingDraft({ locationState: String(value) })
                            }
                            placeholder="Select state"
                          />
                        ) : (
                          <Input
                            id="location-state"
                            type="text"
                            value={draft.locationState}
                            onChange={(event) =>
                              updateOnboardingDraft({ locationState: event.target.value })
                            }
                            className={formFieldComfortableClassName}
                            placeholder="State or region"
                          />
                        )}
                      </Field>

                      <Field label="City" htmlFor="location-city">
                        <Input
                          id="location-city"
                          type="text"
                          value={draft.locationCity}
                          onChange={(event) =>
                            updateOnboardingDraft({ locationCity: event.target.value })
                          }
                          className={formFieldComfortableClassName}
                          placeholder="Yaba"
                        />
                      </Field>

                      <Field label="Local area" htmlFor="location-lga">
                        <Input
                          id="location-lga"
                          type="text"
                          value={draft.locationLga}
                          onChange={(event) =>
                            updateOnboardingDraft({ locationLga: event.target.value })
                          }
                          className={formFieldComfortableClassName}
                          placeholder="Lagos Mainland"
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Street address" htmlFor="location-house">
                          <Input
                            id="location-house"
                            type="text"
                            value={draft.locationHouse}
                            onChange={(event) =>
                              updateOnboardingDraft({ locationHouse: event.target.value })
                            }
                            className={formFieldComfortableClassName}
                            placeholder="12 Adeola Odeku Street"
                          />
                        </Field>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className={secondaryButtonClassName}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleLocationContinue}
                        className={primaryButtonClassName}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </FormShell>
              ) : null}

              {activeStep === "team" ? (
                <FormShell
                  title="Team setup"
                  description="Invite the first operators now, or leave it for later."
                  aside={
                    <button
                      type="button"
                      onClick={addInvite}
                      className={secondaryButtonClassName}
                    >
                      Add teammate
                    </button>
                  }
                >
                  <div className="space-y-4">
                    {teamInvites.map((invite, index) => (
                      <div
                        key={invite.id}
                        className="rounded-[24px] border border-border-soft bg-bg-subtle p-4 sm:p-5"
                      >
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-[16px] font-semibold text-text-primary">
                              Team member {index + 1}
                            </p>
                            <p className="mt-1 text-[13px] leading-[1.65] text-text-secondary">
                              Leave this row empty if you are not inviting anyone yet.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeInvite(invite.id)}
                            className={ghostButtonClassName}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                          <Field label="First name" htmlFor={`invite-first-name-${invite.id}`}>
                            <Input
                              id={`invite-first-name-${invite.id}`}
                              type="text"
                              value={invite.firstName}
                              onChange={(event) =>
                                updateInvite(invite.id, { firstName: event.target.value })
                              }
                              className={formFieldComfortableClassName}
                              placeholder="Tolu"
                            />
                          </Field>

                          <Field label="Last name" htmlFor={`invite-last-name-${invite.id}`}>
                            <Input
                              id={`invite-last-name-${invite.id}`}
                              type="text"
                              value={invite.lastName}
                              onChange={(event) =>
                                updateInvite(invite.id, { lastName: event.target.value })
                              }
                              className={formFieldComfortableClassName}
                              placeholder="Adebayo"
                            />
                          </Field>

                          <Field label="Email" htmlFor={`invite-email-${invite.id}`}>
                            <Input
                              id={`invite-email-${invite.id}`}
                              type="email"
                              value={invite.email}
                              onChange={(event) =>
                                updateInvite(invite.id, { email: event.target.value })
                              }
                              className={formFieldComfortableClassName}
                              placeholder="tolu@gymdeck.com"
                            />
                          </Field>
                        </div>
                      </div>
                    ))}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className={secondaryButtonClassName}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleTeamContinue}
                        className={primaryButtonClassName}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </FormShell>
              ) : null}

              {activeStep === "finish" ? (
                <FormShell
                  title="Workspace ready"
                  description="This is enough to enter GymDeck and keep refining inside the product."
                >
                  <div className="space-y-4">
                    <div className="rounded-[24px] border border-border-soft bg-bg-subtle p-5">
                      <div className="flex items-start gap-4">
                        {draft.businessLogoUrl ? (
                          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-border-soft bg-bg-surface">
                            <Image
                              src={draft.businessLogoUrl}
                              alt="Business logo"
                              fill
                              unoptimized
                              className="object-contain p-2"
                            />
                          </div>
                        ) : null}

                        <div>
                          <p className={labelClassName}>Workspace</p>
                          <p className="mt-2 text-[18px] font-semibold text-text-primary">
                            {draft.businessName || "Untitled workspace"}
                          </p>
                          <p className="mt-1 text-[14px] text-text-secondary">
                            {[draft.firstName, draft.lastName].filter(Boolean).join(" ") ||
                              "Owner name not set"}
                          </p>
                          <p className="mt-1 text-[14px] text-text-secondary">
                            {draft.businessType || "Business type not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-border-soft bg-bg-subtle p-5">
                      <p className={labelClassName}>Location</p>
                      <p className="mt-2 text-[18px] font-semibold text-text-primary">
                        {draft.locationHouse || "Address not set"}
                      </p>
                      <p className="mt-1 text-[14px] text-text-secondary">
                        {[draft.locationCity, draft.locationLga, draft.locationState]
                          .filter(Boolean)
                          .join(", ") || "City, local area, and state not set"}
                      </p>
                      <p className="mt-1 text-[14px] text-text-secondary">
                        {draft.locationCountry || "Country not set"}
                      </p>
                    </div>

                    <div className="rounded-[24px] border border-border-soft bg-bg-subtle p-5">
                      <p className={labelClassName}>Team invites</p>
                      <p className="mt-2 text-[16px] font-semibold text-text-primary">
                        {completedInviteCount}{" "}
                        {completedInviteCount === 1 ? "invite ready" : "invites ready"}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={goToPreviousStep}
                        className={secondaryButtonClassName}
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={handleFinish}
                        className={primaryButtonClassName}
                      >
                        Enter GymDeck
                      </button>
                    </div>
                  </div>
                </FormShell>
              ) : null}

              <p className="px-1 pt-4 text-[13px] leading-[1.7] text-text-secondary">
                Need to change something later? You can update workspace details from{" "}
                <Link
                  href="/settings"
                  className="font-semibold text-text-primary underline decoration-border-strong underline-offset-4"
                >
                  Settings
                </Link>{" "}
                after setup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
