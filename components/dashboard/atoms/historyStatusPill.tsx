import clsx from "clsx";
import type { MembershipHistoryStatus } from "@/components/dashboard/types";

type HistoryStatusPillProps = {
  status: MembershipHistoryStatus;
  className?: string;
};

const statusClassName: Record<MembershipHistoryStatus, string> = {
  active: "bg-[#d7ffdd] text-[#255a3a]",
  completed: "bg-bg-muted text-[#5f6872]",
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
