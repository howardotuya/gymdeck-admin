import Image from "next/image";
import { FormSectionCard } from "@/components/ui";
import { type ClassFormState } from "./shared";

type SummaryStepProps = {
  formState: ClassFormState;
  mode: "create" | "edit";
};

const summaryLabelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle";
const summaryValueClassName = "mt-2 text-[15px] font-medium text-text-primary";

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className={summaryLabelClassName}>{label}</p>
      <p className={summaryValueClassName}>{value}</p>
    </div>
  );
}

export function SummaryStep({ formState, mode }: SummaryStepProps) {
  const scheduleDays = formState.selectedDays.length
    ? formState.selectedDays.join(", ")
    : "Not set";
  const dateRange = formState.endDate
    ? `${formState.startDate} to ${formState.endDate}`
    : `${formState.startDate} onward`;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-text-primary">
          Summary
        </h2>
        <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">
          {mode === "edit"
            ? "Review the updated class details before saving changes."
            : "Review the class details before creating it."}
        </p>
      </div>

      <FormSectionCard bodyClassName="space-y-6">
        {formState.imagePreviewUrl ? (
          <div className="overflow-hidden rounded-[24px] border border-border-soft bg-bg-muted">
            <div className="relative h-[293px] bg-bg-subtle">
              <Image
                src={formState.imagePreviewUrl}
                alt={formState.imageName || "Class image preview"}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <SummaryItem label="Class name" value={formState.name || "Untitled class"} />
          <SummaryItem label="Category" value={formState.category} />
          <SummaryItem label="Format" value={formState.format} />
          <SummaryItem label="Level" value={formState.level} />
          <SummaryItem label="Branch" value={formState.branch} />
          <SummaryItem label="Lead instructor" value={formState.instructor} />
          <SummaryItem label="Studio or room" value={formState.room} />
          <SummaryItem label="Duration" value={`${formState.durationMinutes} mins`} />
        </div>

        <div className="h-px bg-border-soft" />

        <div className="grid gap-6 md:grid-cols-2">
          <SummaryItem label="Days" value={scheduleDays} />
          <SummaryItem
            label="Time"
            value={`${formState.startTime} - ${formState.endTime}`}
          />
          <SummaryItem label="Date range" value={dateRange} />
          <SummaryItem
            label="Booking closes"
            value={`${formState.bookingCloseMinutes} mins before`}
          />
          <SummaryItem label="Total capacity" value={formState.capacity} />
        </div>
      </FormSectionCard>
    </div>
  );
}
