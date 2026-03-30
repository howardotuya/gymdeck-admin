import { branchCountryOptions, branchStateOptionsByCountry } from "@/components/branches/data";
import type { SelectOption, SetupStep } from "@/components/ui";
import type { OnboardingStepId } from "@/stores/useFakeAuth";

export const onboardingSteps: readonly SetupStep[] = [
  { id: "business", label: "Create workspace" },
  { id: "location", label: "Set up location" },
  { id: "team", label: "Team setup" },
  { id: "finish", label: "Finish" },
] as const;

export const businessTypeOptions: readonly SelectOption[] = [
  { value: "single-location", label: "Single location" },
  { value: "multi-location", label: "Multi-location" },
  { value: "franchise", label: "Franchise" },
] as const;

export const locationCountryOptions = branchCountryOptions satisfies readonly SelectOption[];
export const locationStateOptionsByCountry = branchStateOptionsByCountry;

export const countryCodeByCountryName: Record<string, string> = {
  Nigeria: "ng",
  Ghana: "gh",
  Kenya: "ke",
  "South Africa": "za",
  "United Kingdom": "gb",
  "United States": "us",
};

export const onboardingStepOrder: readonly OnboardingStepId[] = onboardingSteps.map(
  (step) => step.id as OnboardingStepId,
);
