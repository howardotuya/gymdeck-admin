import type { BranchFormState } from "../types";
import {
  BranchReadinessPanel,
  BranchSelectionPanel,
  BranchSummaryPanel,
} from "./shared";

type PreviewStepProps = {
  formState: BranchFormState;
};

export function PreviewStep({ formState }: PreviewStepProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <BranchSummaryPanel formState={formState} />
      <div className="space-y-4">
        <BranchReadinessPanel />
        <BranchSelectionPanel formState={formState} />
      </div>
    </div>
  );
}
