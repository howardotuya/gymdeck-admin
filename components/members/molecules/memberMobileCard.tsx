import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { MemberRow } from "../data";

type MemberMobileCardProps = {
  member: MemberRow;
  actionsMenu: ReactNode;
};

export function MemberMobileCard({ member, actionsMenu }: MemberMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-muted text-[13px] font-semibold text-text-secondary">
            {member.initials}
          </span>
          <div>
            <p className="text-[15px] font-semibold text-text-primary">{member.name}</p>
            <p className="mt-1 text-[13px] text-text-secondary">{member.id}</p>
            <p className="mt-2 text-[13px] text-text-secondary">
              {member.plan} • {member.branch}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <StatusBadge label={member.status} tone={member.tone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Contact
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{member.phone}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Classes
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{member.classesBooked}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Last visit
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{member.lastVisit}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Expiry
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{member.expiryDate}</p>
        </div>
      </div>
    </article>
  );
}
