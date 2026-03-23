import clsx from "clsx";
import { FormSectionCard } from "@/components/ui";
import {
  Field,
  ToggleCard,
  inputClassName,
  noShowPolicyOptions,
  reminderOptions,
  waitlistModeOptions,
  type ClassFormState,
  type ClassFormUpdateField,
} from "./shared";

type WaitlistAttendanceStepProps = {
  formState: ClassFormState;
  updateField: ClassFormUpdateField;
};

export function WaitlistAttendanceStep({
  formState,
  updateField,
}: WaitlistAttendanceStepProps) {
  return (
    <FormSectionCard
      title="Waitlist and attendance policy"
      description="The mature products all expose waitlist cutoff, claim windows, reminders, and no-show policy close to class booking rules."
    >
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          <ToggleCard
            checked={formState.waitlistEnabled}
            onChange={() => updateField("waitlistEnabled", !formState.waitlistEnabled)}
            title="Enable waitlist"
            detail="Allow members to queue automatically when the class reaches capacity."
          />
          <ToggleCard
            checked={formState.allowRecurringReservations}
            onChange={() =>
              updateField("allowRecurringReservations", !formState.allowRecurringReservations)
            }
            title="Allow recurring reservations"
            detail="Useful for high-retention classes where members hold the same slot weekly."
          />
          <ToggleCard
            checked={formState.allowGuests}
            onChange={() => updateField("allowGuests", !formState.allowGuests)}
            title="Allow guest bookings"
            detail="Enable only when the class should accept friend or family add-ons."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field id="class-waitlist-mode" label="Waitlist mode">
            <select
              id="class-waitlist-mode"
              value={formState.waitlistMode}
              onChange={(event) =>
                updateField("waitlistMode", event.target.value as ClassFormState["waitlistMode"])
              }
              className={clsx(inputClassName, !formState.waitlistEnabled && "opacity-50")}
              disabled={!formState.waitlistEnabled}
            >
              {waitlistModeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id="class-waitlist-max" label="Max waitlist size">
            <input
              id="class-waitlist-max"
              type="number"
              min="0"
              value={formState.waitlistMax}
              onChange={(event) => updateField("waitlistMax", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(inputClassName, !formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-waitlist-cutoff" label="Auto-promote cutoff (mins before)">
            <input
              id="class-waitlist-cutoff"
              type="number"
              min="0"
              value={formState.waitlistCutoffMinutes}
              onChange={(event) => updateField("waitlistCutoffMinutes", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(inputClassName, !formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-waitlist-claim" label="Claim window (mins)">
            <input
              id="class-waitlist-claim"
              type="number"
              min="0"
              value={formState.waitlistClaimMinutes}
              onChange={(event) => updateField("waitlistClaimMinutes", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(inputClassName, !formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-reminders" label="Reminder schedule">
            <select
              id="class-reminders"
              value={formState.reminderSchedule}
              onChange={(event) =>
                updateField(
                  "reminderSchedule",
                  event.target.value as ClassFormState["reminderSchedule"],
                )
              }
              className={inputClassName}
            >
              {reminderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id="class-no-show-policy" label="No-show policy">
            <select
              id="class-no-show-policy"
              value={formState.noShowPolicy}
              onChange={(event) =>
                updateField("noShowPolicy", event.target.value as ClassFormState["noShowPolicy"])
              }
              className={inputClassName}
            >
              {noShowPolicyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </FormSectionCard>
  );
}
