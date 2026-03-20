import clsx from "clsx";
import type { MembershipHistoryStatus } from "@/components/dashboard/types";

type HistoryStatusPillProps = {
  status: MembershipHistoryStatus;
  className?: string;
};

const statusClassName: Record<MembershipHistoryStatus, string> = {
  active: "bg-bg-status-success-soft text-text-status-success",
  completed: "bg-bg-muted text-text-status-neutral",
};

const statusLabel: Record<MembershipHistoryStatus, string> = {
  active: "Active",
  completed: "Completed",
};

export function HistoryStatusPill({ className, status }: HistoryStatusPillProps) {
  return (
    <span
      className={clsx(
        "inline-flex h-6 items-center justify-center rounded-full px-2 text-[12px] leading-none font-normal",
        statusClassName[status],
        className,
      )}
    >
      {statusLabel[status]}
    </span>
  );
}
