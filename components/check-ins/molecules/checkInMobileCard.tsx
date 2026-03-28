import type { ReactNode } from "react";
import type { CheckInRecord } from "../data";

type CheckInMobileCardProps = {
  record: CheckInRecord;
  actionsMenu: ReactNode;
};

export function CheckInMobileCard({ record, actionsMenu }: CheckInMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[15px] font-semibold text-text-primary">{record.member}</p>
        </div>
        <div className="shrink-0">{actionsMenu}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Type
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{record.typeLabel}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Branch
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{record.branch}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Date
          </p>
          <p className="mt-1 text-[14px] text-text-primary">
            {record.date} <span className="text-text-secondary">{record.time}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
