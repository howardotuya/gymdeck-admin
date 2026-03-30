import clsx from "clsx";
import { FormSectionCard, Input } from "@/components/ui";
import {
  Field,
  weekdayOptions,
  type ClassFormState,
  type ClassFormUpdateField,
} from "./shared";

type ScheduleRecurrenceStepProps = {
  formState: ClassFormState;
  toggleDay: (day: string) => void;
  updateField: ClassFormUpdateField;
};

export function ScheduleRecurrenceStep({
  formState,
  toggleDay,
  updateField,
}: ScheduleRecurrenceStepProps) {
  return (
    <FormSectionCard>
      <div className="space-y-5">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            Weekly schedule
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {weekdayOptions.map((day) => {
              const active = formState.selectedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={clsx(
                    "rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors",
                    active
                      ? "border-border-brand bg-bg-brand-soft/45 text-text-brand"
                      : "border-border-soft bg-bg-muted text-text-secondary hover:border-border-strong",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field id="class-start-time" label="Start time">
            <Input
              id="class-start-time"
              type="time"
              value={formState.startTime}
              onChange={(event) => updateField("startTime", event.target.value)}
            />
          </Field>

          <Field id="class-end-time" label="End time">
            <Input
              id="class-end-time"
              type="time"
              value={formState.endTime}
              onChange={(event) => updateField("endTime", event.target.value)}
            />
          </Field>

          <Field id="class-start-date" label="Start date">
            <Input
              id="class-start-date"
              type="date"
              value={formState.startDate}
              onChange={(event) => updateField("startDate", event.target.value)}
            />
          </Field>

          <Field id="class-end-date" label="End date">
            <Input
              id="class-end-date"
              type="date"
              value={formState.endDate}
              onChange={(event) => updateField("endDate", event.target.value)}
            />
          </Field>
        </div>
      </div>
    </FormSectionCard>
  );
}
