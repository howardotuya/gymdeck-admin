import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { PayoutItem } from "../data";

type PayoutMobileCardProps = {
  payout: PayoutItem;
  actionsMenu: ReactNode;
};

export function PayoutMobileCard({ payout, actionsMenu }: PayoutMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-text-primary">{payout.withdrawal}</p>
            <StatusBadge label={payout.status} tone={payout.statusTone} />
          </div>
          <p className="mt-2 text-[13px] text-text-secondary">{payout.id}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{payout.cadence}</p>
        </div>
        <div className="shrink-0">{actionsMenu}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Amount
          </p>
          <p className="mt-1 text-[14px] font-semibold text-text-primary">{payout.amount}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Requested
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{payout.requestedDate}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Account
          </p>
          <p className="mt-1 text-[14px] text-text-primary">
            {payout.beneficiaryDetails.bankName} • {payout.beneficiaryDetails.accountNumber}
          </p>
        </div>
      </div>
    </article>
  );
}
