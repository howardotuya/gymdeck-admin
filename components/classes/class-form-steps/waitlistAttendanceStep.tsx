import clsx from "clsx";
import { FormSectionCard, Input, Select, type SelectOption } from "@/components/ui";
import {
  Field,
  ToggleCard,
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
  const waitlistModeSelectOptions: SelectOption[] = waitlistModeOptions.map((option) => ({
    value: option,
    label: option,
  }));
  const reminderSelectOptions: SelectOption[] = reminderOptions.map((option) => ({
    value: option,
    label: option,
  }));
  const noShowPolicySelectOptions: SelectOption[] = noShowPolicyOptions.map((option) => ({
    value: option,
    label: option,
  }));

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
            <Select
              id="class-waitlist-mode"
              options={waitlistModeSelectOptions}
              value={formState.waitlistMode}
              onChange={(value) =>
                updateField("waitlistMode", value as ClassFormState["waitlistMode"])
              }
              disabled={!formState.waitlistEnabled}
              className={clsx(!formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-waitlist-max" label="Max waitlist size">
            <Input
              id="class-waitlist-max"
              type="number"
              min="0"
              value={formState.waitlistMax}
              onChange={(event) => updateField("waitlistMax", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(!formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-waitlist-cutoff" label="Auto-promote cutoff (mins before)">
            <Input
              id="class-waitlist-cutoff"
              type="number"
              min="0"
              value={formState.waitlistCutoffMinutes}
              onChange={(event) => updateField("waitlistCutoffMinutes", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(!formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-waitlist-claim" label="Claim window (mins)">
            <Input
              id="class-waitlist-claim"
              type="number"
              min="0"
              value={formState.waitlistClaimMinutes}
              onChange={(event) => updateField("waitlistClaimMinutes", event.target.value)}
              disabled={!formState.waitlistEnabled}
              className={clsx(!formState.waitlistEnabled && "opacity-50")}
            />
          </Field>

          <Field id="class-reminders" label="Reminder schedule">
            <Select
              id="class-reminders"
              options={reminderSelectOptions}
              value={formState.reminderSchedule}
              onChange={(value) =>
                updateField(
                  "reminderSchedule",
                  value as ClassFormState["reminderSchedule"],
                )
              }
            />
          </Field>

          <Field id="class-no-show-policy" label="No-show policy">
            <Select
              id="class-no-show-policy"
              options={noShowPolicySelectOptions}
              value={formState.noShowPolicy}
              onChange={(value) =>
                updateField("noShowPolicy", value as ClassFormState["noShowPolicy"])
              }
            />
          </Field>
        </div>
      </div>
    </FormSectionCard>
  );
}
