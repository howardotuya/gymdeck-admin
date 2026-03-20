import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { PlanCardItem } from "../data";

type PlanMobileCardProps = {
  plan: PlanCardItem;
  actionsMenu: ReactNode;
};

export function PlanMobileCard({ plan, actionsMenu }: PlanMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-text-primary">{plan.name}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{plan.id}</p>
          <p className="mt-2 text-[13px] text-text-secondary">{plan.type}</p>
        </div>
        <div className="flex items-start gap-2">
          <StatusBadge label={plan.status} tone={plan.statusTone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Price
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{plan.price}</p>
          <p className="mt-1 text-[12px] text-text-secondary">{plan.cadence}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Revenue
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{plan.revenue}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Branch scope
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{plan.branchScope}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Subscribers
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{plan.subscribers}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
          Access
        </p>
        <p className="mt-1 text-[14px] leading-[1.6] text-text-primary">{plan.access}</p>
      </div>
    </article>
  );
}
