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
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-text-primary">{transaction.member}</p>
            <StatusBadge label={transaction.status} tone={transaction.statusTone} />
          </div>
          <p className="mt-2 text-[13px] text-text-secondary">{transaction.id}</p>
          <p className="mt-1 text-[13px] text-text-secondary">
            {transaction.plan} • {transaction.branch}
          </p>
        </div>

        <div className="flex items-start gap-2">
          <div className="text-right">
            <p className="text-[15px] font-semibold text-text-primary">{transaction.amount}</p>
            <p className="mt-1 text-[12px] text-text-secondary">{transaction.method}</p>
          </div>
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Invoice
          </p>
          <div className="mt-2">
            <StatusBadge label={transaction.invoiceState} tone={transaction.invoiceTone} />
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Date
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{transaction.date}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{transaction.time}</p>
        </div>
      </div>
    </article>
  );
}
