import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { ClassRecord } from "../data";

type ClassMobileCardProps = {
  classItem: ClassRecord;
  actionsMenu: ReactNode;
};

function getLifecycleStatus(classItem: ClassRecord) {
  if (classItem.status === "Inactive" || classItem.status === "Draft") {
    return { label: "Inactive", tone: "neutral" as const };
  }

  return { label: "Active", tone: "success" as const };
}

export function ClassMobileCard({ classItem, actionsMenu }: ClassMobileCardProps) {
  const lifecycleStatus = getLifecycleStatus(classItem);

  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold text-text-primary">{classItem.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-text-secondary">
            <span className="truncate">{classItem.branch}</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-border-strong"
            />
            <span className="truncate">{classItem.instructor}</span>
          </div>
          <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.08em] text-text-subtle">
            {classItem.id}
          </p>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          <StatusBadge label={lifecycleStatus.label} tone={lifecycleStatus.tone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Weekly slots
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{classItem.activeSchedules}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Booked seats
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{classItem.bookedSeats}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Duration
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{classItem.duration}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Format
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{classItem.format}</p>
        </div>
      </div>
    </article>
  );
}
