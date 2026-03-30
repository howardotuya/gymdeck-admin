import clsx from "clsx";
import { FormSectionCard } from "@/components/ui";
import { branchClassOptions, branchPlanOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  SelectionCard,
  type BranchFormSetSelections,
  type BranchFormUpdateSelection,
} from "./shared";

type ProgramsSetupStepProps = {
  formState: BranchFormState;
  setSelections: BranchFormSetSelections;
  toggleSelection: BranchFormUpdateSelection;
};

export function ProgramsSetupStep({
  formState,
  setSelections,
  toggleSelection,
}: ProgramsSetupStepProps) {
  const allPlanNames = branchPlanOptions.map((plan) => plan.name);
  const allClassNames = branchClassOptions.map((gymClass) => gymClass.name);
  const selectedPlanCount = formState.plans.length;
  const selectedClassCount = formState.classes.length;
  const allPlansSelected = allPlanNames.every((planName) => formState.plans.includes(planName));
  const allClassesSelected = allClassNames.every((className) =>
    formState.classes.includes(className),
  );

  return (
    <FormSectionCard
      title="Plans and classes"
      description="Select the membership products and recurring class types this branch should support at launch."
    >
      <div className="space-y-6">
        <div>
          <SectionHeader
            actionLabel={allPlansSelected ? "Clear all plans" : "Select all plans"}
            countLabel={`${selectedPlanCount} of ${allPlanNames.length} selected`}
            onAction={() => setSelections("plans", allPlansSelected ? [] : allPlanNames)}
            title="Plans"
          />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {branchPlanOptions.map((plan) => (
              <label
                key={plan.id}
                className={clsx(
                  "flex cursor-pointer gap-3 rounded-[20px] border px-4 py-4 transition-colors",
                  formState.plans.includes(plan.name)
                    ? "border-border-brand bg-bg-brand-soft/45"
                    : "border-border-soft bg-bg-muted hover:border-border-strong",
                )}
              >
                <input
                  type="checkbox"
                  checked={formState.plans.includes(plan.name)}
                  onChange={() => toggleSelection("plans", plan.name)}
                  className="mt-1 h-4 w-4 rounded border border-border-strong"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[14px] font-semibold text-text-primary">{plan.name}</p>
                    <span className="shrink-0 rounded-full bg-bg-surface px-3 py-1 text-[12px] font-semibold text-text-brand">
                      {plan.priceLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                    {plan.detail}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-border-soft pt-6">
          <SectionHeader
            actionLabel={allClassesSelected ? "Clear all classes" : "Select all classes"}
            countLabel={`${selectedClassCount} of ${allClassNames.length} selected`}
            onAction={() => setSelections("classes", allClassesSelected ? [] : allClassNames)}
            title="Classes"
          />
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {branchClassOptions.map((gymClass) => (
              <SelectionCard
                key={gymClass.id}
                checked={formState.classes.includes(gymClass.name)}
                label={gymClass.name}
                detail={gymClass.detail}
                onChange={() => toggleSelection("classes", gymClass.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </FormSectionCard>
  );
}

function SectionHeader({
  actionLabel,
  countLabel,
  onAction,
  title,
}: {
  actionLabel: string;
  countLabel: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
          {title}
        </p>
        <span className="inline-flex rounded-full bg-bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-text-brand">
          {countLabel}
        </span>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="inline-flex h-10 items-center rounded-full px-1 text-[13px] font-semibold text-text-brand transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand"
      >
        {actionLabel}
      </button>
    </div>
  );
}
