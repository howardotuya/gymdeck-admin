"use client";

import clsx from "clsx";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/logo";
import { ImageUploadField, Select } from "@/components/ui";
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
  onboardingStepOrder,
} from "./data";

const textFieldClassName =
  "h-12 w-full rounded-2xl border border-border-input bg-bg-input px-4 text-[15px] text-text-primary outline-none transition-all placeholder:text-text-muted focus:border-[rgba(100,117,233,0.32)] focus:ring-4 focus:ring-[rgba(100,117,233,0.1)]";

const labelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted";

const secondaryButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-full bg-bg-action-soft px-5 text-[14px] font-medium text-text-support transition-colors hover:bg-bg-action-soft-hover";

const ghostButtonClassName =
  "inline-flex h-11 items-center justify-center rounded-full px-4 text-[14px] font-medium text-text-secondary transition-colors hover:bg-bg-action-soft hover:text-text-primary";

const primaryButtonClassName =
  "inline-flex h-12 items-center justify-center rounded-full bg-brand-primary px-6 text-[14px] font-semibold text-text-inverse transition-all hover:bg-brand-primary-hover";

const brandSoftBadgeClassName =
  "rounded-full bg-[rgba(100,117,233,0.08)] px-4 py-2 text-[13px] font-medium text-[#6475e9]";

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
            <div className="max-w-[36rem]">
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
  const stateOptions =
    locationStateOptionsByCountry[
      draft.locationCountry as keyof typeof locationStateOptionsByCountry
    ] ?? [];
  const selectedCountryCode = countryCodeByCountryName[draft.locationCountry] ?? undefined;
  const currentStepContent = stepContent[activeStep];
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
    <div className="min-h-screen bg-[#f4f4f5]">
      <div className="mx-auto max-w-[1380px] px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid h-[calc(100vh-2rem)] gap-4 overflow-hidden lg:grid-cols-[0.8fr_1.2fr] lg:gap-5">
          <SurfaceCard className="relative h-full overflow-hidden border-white/10 bg-[#1b1b1f] text-white shadow-[0_20px_60px_rgba(16,24,40,0.18)]">
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

            <div className="relative flex h-full flex-col overflow-y-auto p-5 sm:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div className="inline-flex rounded-full border border-white/16 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <BrandLogo textClassName="text-white" />
                </div>

                <span className="rounded-full border border-white/14 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/76">
                  New workspace
                </span>
              </div>

              <div className="mt-10 max-w-[28rem] space-y-6">
                <div className="space-y-3">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white/64">
                    Fast onboarding
                  </p>
                  <h1 className="max-w-[11ch] text-[30px] font-semibold leading-[1.02] tracking-[-0.06em] text-white sm:text-[36px]">
                    Build the workspace members will trust.
                  </h1>
                  <p className="max-w-[34ch] text-[14px] leading-[1.7] text-white/72">
                    Clear hierarchy, less clutter, and the right details up front.
                  </p>
                </div>

                <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/62">
                    Design principles
                  </p>
                  <div className="mt-3 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/72" />
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          One primary action
                        </p>
                        <p className="mt-1 text-[12px] leading-[1.6] text-white/62">
                          The page keeps the next action obvious at every step.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/72" />
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          Persistent labels
                        </p>
                        <p className="mt-1 text-[12px] leading-[1.6] text-white/62">
                          Labels stay visible and spacing stays breathable.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-white/72" />
                      <div>
                        <p className="text-[13px] font-semibold text-white">
                          Brand-first identity
                        </p>
                        <p className="mt-1 text-[12px] leading-[1.6] text-white/62">
                          Logo, business name, and workspace details feel like one system.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-medium text-white/76">
                    Responsive
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-medium text-white/76">
                    Minimal
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-medium text-white/76">
                    Brand aligned
                  </span>
                </div>
              </div>
            </div>
          </SurfaceCard>

          <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
            <SurfaceCard className="px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#6475e9]">
                    {currentStepContent.eyebrow}
                  </p>
                  <div>
                    <p className="max-w-[20ch] text-[30px] font-semibold tracking-[-0.05em] text-text-primary sm:text-[34px]">
                      {currentStepContent.title}
                    </p>
                    <p className="mt-2 max-w-[40rem] text-[14px] leading-[1.7] text-text-secondary">
                      {currentStepContent.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href="/settings" className={secondaryButtonClassName}>
                    Settings later
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className={ghostButtonClassName}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </SurfaceCard>

            <div className="flex-1 overflow-y-auto pr-1">
              {activeStep === "business" ? (
                <FormShell
                  title="Create workspace"
                  description="This step sets the business identity staff will recognize across the admin."
                  aside={<div className={brandSoftBadgeClassName}>Required fields only</div>}
                >
                  <div className="max-w-[40rem] space-y-5">
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
                        <input
                          id="owner-first-name"
                          type="text"
                          value={draft.firstName}
                          onChange={(event) =>
                            updateOnboardingDraft({ firstName: event.target.value })
                          }
                          className={textFieldClassName}
                          placeholder="Jane"
                          autoComplete="given-name"
                        />
                      </Field>

                      <Field label="Last name" htmlFor="owner-last-name">
                        <input
                          id="owner-last-name"
                          type="text"
                          value={draft.lastName}
                          onChange={(event) =>
                            updateOnboardingDraft({ lastName: event.target.value })
                          }
                          className={textFieldClassName}
                          placeholder="Doe"
                          autoComplete="family-name"
                        />
                      </Field>
                    </div>

                    <Field label="Gym or business name" htmlFor="business-name">
                      <input
                        id="business-name"
                        type="text"
                        value={draft.businessName}
                        onChange={(event) =>
                          updateOnboardingDraft({ businessName: event.target.value })
                        }
                        className={textFieldClassName}
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
                      <div className="flex h-12 items-center rounded-2xl border border-border-input bg-bg-muted px-4 text-[14px] text-text-secondary">
                        {accountEmail ?? "email@example.com"}
                      </div>
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
                  <div className="max-w-[44rem] space-y-5">
                    <div className="rounded-[24px] border border-border-soft bg-bg-subtle p-4">
                      <AddressMapField
                        apiKey={mapApiKey}
                        countryCode={selectedCountryCode}
                        value={draft.locationFormattedAddress}
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
                          options={locationCountryOptions}
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
                          <input
                            id="location-state"
                            type="text"
                            value={draft.locationState}
                            onChange={(event) =>
                              updateOnboardingDraft({ locationState: event.target.value })
                            }
                            className={textFieldClassName}
                            placeholder="State or region"
                          />
                        )}
                      </Field>

                      <Field label="City" htmlFor="location-city">
                        <input
                          id="location-city"
                          type="text"
                          value={draft.locationCity}
                          onChange={(event) =>
                            updateOnboardingDraft({ locationCity: event.target.value })
                          }
                          className={textFieldClassName}
                          placeholder="Yaba"
                        />
                      </Field>

                      <Field label="Local area" htmlFor="location-lga">
                        <input
                          id="location-lga"
                          type="text"
                          value={draft.locationLga}
                          onChange={(event) =>
                            updateOnboardingDraft({ locationLga: event.target.value })
                          }
                          className={textFieldClassName}
                          placeholder="Lagos Mainland"
                        />
                      </Field>

                      <div className="sm:col-span-2">
                        <Field label="Street address" htmlFor="location-house">
                          <input
                            id="location-house"
                            type="text"
                            value={draft.locationHouse}
                            onChange={(event) =>
                              updateOnboardingDraft({ locationHouse: event.target.value })
                            }
                            className={textFieldClassName}
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
                  <div className="max-w-[46rem] space-y-4">
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
                            <input
                              id={`invite-first-name-${invite.id}`}
                              type="text"
                              value={invite.firstName}
                              onChange={(event) =>
                                updateInvite(invite.id, { firstName: event.target.value })
                              }
                              className={textFieldClassName}
                              placeholder="Tolu"
                            />
                          </Field>

                          <Field label="Last name" htmlFor={`invite-last-name-${invite.id}`}>
                            <input
                              id={`invite-last-name-${invite.id}`}
                              type="text"
                              value={invite.lastName}
                              onChange={(event) =>
                                updateInvite(invite.id, { lastName: event.target.value })
                              }
                              className={textFieldClassName}
                              placeholder="Adebayo"
                            />
                          </Field>

                          <Field label="Email" htmlFor={`invite-email-${invite.id}`}>
                            <input
                              id={`invite-email-${invite.id}`}
                              type="email"
                              value={invite.email}
                              onChange={(event) =>
                                updateInvite(invite.id, { email: event.target.value })
                              }
                              className={textFieldClassName}
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
                  <div className="max-w-[42rem] space-y-4">
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
                <Link href="/settings" className="font-semibold text-[#6475e9]">
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
