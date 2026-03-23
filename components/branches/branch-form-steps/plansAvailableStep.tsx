import { FormSectionCard } from "@/components/ui";
import { branchPlanOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  SelectionCard,
  type BranchFormUpdateSelection,
} from "./shared";

type PlansAvailableStepProps = {
  formState: BranchFormState;
  toggleSelection: BranchFormUpdateSelection;
};

export function PlansAvailableStep({
  formState,
  toggleSelection,
}: PlansAvailableStepProps) {
  return (
    <FormSectionCard
      title="Plans available"
      description="Select the membership or access products that should be available at this location."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {branchPlanOptions.map((plan) => (
          <SelectionCard
            key={plan.id}
            checked={formState.plans.includes(plan.name)}
            label={plan.name}
            detail={plan.detail}
            onChange={() => toggleSelection("plans", plan.name)}
          />
        ))}
      </div>
    </FormSectionCard>
  );
}
