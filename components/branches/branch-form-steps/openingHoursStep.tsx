import clsx from "clsx";
import { FormSectionCard, Input } from "@/components/ui";
import type { BranchFormState } from "../types";
import {
  Field,
  type BranchFormUpdateHour,
} from "./shared";

type OpeningHoursStepProps = {
  formState: BranchFormState;
  updateHour: BranchFormUpdateHour;
};

export function OpeningHoursStep({
  formState,
  updateHour,
}: OpeningHoursStepProps) {
  return (
    <FormSectionCard
      title="Opening hours"
      description="Keep daily operating hours explicit so branch staff can scan them at a glance."
    >
      <div className="space-y-3">
        {formState.openingHours.map((item) => (
          <div
            key={item.id}
            className="rounded-[20px] border border-border-soft bg-bg-muted px-4 py-4"
          >
            <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)_140px_140px] md:items-center">
              <div>
                <p className="text-[14px] font-semibold text-text-primary">{item.day}</p>
                <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-text-secondary">
                  <input
                    type="checkbox"
                    checked={item.isOpen}
                    onChange={(event) =>
                      updateHour(item.id, { isOpen: event.target.checked })
                    }
                    className="h-4 w-4 rounded border border-border-strong"
                  />
                  Open for staff operations
                </label>
              </div>

              <p className="text-[13px] leading-[1.65] text-text-secondary">
                Set operating hours for front desk coverage, check-ins, and class access.
              </p>

              <Field id={`${item.id}-open`} label="Open">
                <Input
                  id={`${item.id}-open`}
                  type="time"
                  value={item.openTime}
                  disabled={!item.isOpen}
                  onChange={(event) => updateHour(item.id, { openTime: event.target.value })}
                  className={clsx(!item.isOpen && "opacity-50")}
                />
              </Field>

              <Field id={`${item.id}-close`} label="Close">
                <Input
                  id={`${item.id}-close`}
                  type="time"
                  value={item.closeTime}
                  disabled={!item.isOpen}
                  onChange={(event) => updateHour(item.id, { closeTime: event.target.value })}
                  className={clsx(!item.isOpen && "opacity-50")}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>
    </FormSectionCard>
  );
}
