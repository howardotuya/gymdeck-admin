import { FormSectionCard } from "@/components/ui";
import { branchClassOptions } from "../data";
import type { BranchFormState } from "../types";
import {
  SelectionCard,
  type BranchFormUpdateSelection,
} from "./shared";

type ClassesAvailableStepProps = {
  formState: BranchFormState;
  toggleSelection: BranchFormUpdateSelection;
};

export function ClassesAvailableStep({
  formState,
  toggleSelection,
}: ClassesAvailableStepProps) {
  return (
    <FormSectionCard
      title="Classes available"
      description="Select the recurring class types the branch should offer. This step is optional."
    >
      <div className="grid gap-3 md:grid-cols-2">
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
    </FormSectionCard>
  );
}
