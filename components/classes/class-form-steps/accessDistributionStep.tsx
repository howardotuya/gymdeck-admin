import { FormSectionCard } from "@/components/ui";
import {
  Field,
  SelectionCard,
  planOptions,
  textAreaClassName,
  type ClassFormState,
  type ClassFormUpdateField,
} from "./shared";

type AccessDistributionStepProps = {
  formState: ClassFormState;
  togglePlan: (planLabel: string) => void;
  updateField: ClassFormUpdateField;
};

export function AccessDistributionStep({
  formState,
  togglePlan,
  updateField,
}: AccessDistributionStepProps) {
  return (
    <FormSectionCard
      title="Access and distribution"
      description="Set which products can book this class and decide how it should appear to members versus partner channels."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          {planOptions.map((plan) => (
            <SelectionCard
              key={plan.id}
              checked={formState.eligiblePlans.includes(plan.label)}
              label={plan.label}
              detail={plan.detail}
              onChange={() => togglePlan(plan.label)}
            />
          ))}
        </div>

        <Field id="class-notes" label="Operational notes">
          <textarea
            id="class-notes"
            value={formState.notes}
            onChange={(event) => updateField("notes", event.target.value)}
            className={textAreaClassName}
            placeholder="Add operator notes about equipment limits, room setup, partner constraints, or instructor handoff."
          />
        </Field>
      </div>
    </FormSectionCard>
  );
}
