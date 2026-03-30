import { FormSectionCard, Input } from "@/components/ui";
import { Field, type ClassFormState, type ClassFormUpdateField } from "./shared";

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
          <Input
            id="class-capacity"
            type="number"
            min="1"
            value={formState.capacity}
            onChange={(event) => updateField("capacity", event.target.value)}
          />
        </Field>

        <Field id="class-booking-close" label="Booking closes (mins before)">
          <Input
            id="class-booking-close"
            type="number"
            min="0"
            value={formState.bookingCloseMinutes}
            onChange={(event) => updateField("bookingCloseMinutes", event.target.value)}
          />
        </Field>
      </div>
    </FormSectionCard>
  );
}
