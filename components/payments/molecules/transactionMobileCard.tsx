import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { TransactionItem } from "../data";

type TransactionMobileCardProps = {
  transaction: TransactionItem;
  actionsMenu: ReactNode;
};

export function TransactionMobileCard({
  transaction,
  actionsMenu,
}: TransactionMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-text-primary">{transaction.member}</p>
            <StatusBadge label={transaction.status} tone={transaction.statusTone} />
          </div>
          <p className="mt-2 text-[13px] text-text-secondary">{transaction.id}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {transaction.plan}
          </p>
        </div>
        <div className="shrink-0">{actionsMenu}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Branch
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{transaction.branch}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Amount
          </p>
          <p className="mt-1 text-[14px] font-semibold text-text-primary">{transaction.amount}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Paid at
          </p>
          <p className="mt-1 text-[14px] text-text-primary">
            {transaction.date}{" "}
            <span className="text-[13px] text-text-secondary">{transaction.time}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
