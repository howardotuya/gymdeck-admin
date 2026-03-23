import { FormSectionCard } from "@/components/ui";
import { Field, inputClassName, type ClassFormState, type ClassFormUpdateField } from "./shared";

type CapacityBookingStepProps = {
  formState: ClassFormState;
  updateField: ClassFormUpdateField;
};

export function CapacityBookingStep({
  formState,
  updateField,
}: CapacityBookingStepProps) {
  return (
    <FormSectionCard>
      <div className="grid gap-4 md:grid-cols-2">
        <Field id="class-capacity" label="Total capacity">
          <input
            id="class-capacity"
            type="number"
            min="1"
            value={formState.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
            className={inputClassName}
          />
        </Field>

        <Field id="class-booking-close" label="Booking closes (mins before)">
          <input
            id="class-booking-close"
            type="number"
            min="0"
            value={formState.bookingCloseMinutes}
            onChange={(event) => updateField("bookingCloseMinutes", event.target.value)}
            className={inputClassName}
          />
        </Field>
      </div>
    </FormSectionCard>
  );
}
