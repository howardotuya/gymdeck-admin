import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { Branch } from "../types";

type BranchMobileCardProps = {
  branch: Branch;
  actionsMenu: ReactNode;
};

export function BranchMobileCard({ branch, actionsMenu }: BranchMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-text-primary">{branch.name}</p>
          <p className="mt-2 text-[13px] leading-[1.6] text-text-secondary">{branch.address}</p>
        </div>
        <div className="flex items-start gap-2">
          <StatusBadge label={branch.status} tone={branch.tone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Manager
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{branch.manager}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Members
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{branch.members.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Staff
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{branch.staffCount}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Contact
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{branch.phone}</p>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/branches/${branch.id}`}
          className="inline-flex h-10 items-center rounded-xl border border-border-soft px-4 text-[13px] font-semibold text-text-primary transition-colors hover:border-border-strong"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
