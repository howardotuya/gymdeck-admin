import { Panel, SetupTopbar } from "@/components/ui";
import type { TransactionItem } from "./data";

type TransactionDetailPageProps = {
  transaction: TransactionItem;
};

function TransactionCard({ lines }: { lines: string[] }) {
  return (
    <div className="rounded-[20px] border border-border-soft bg-bg-muted px-5 py-5">
      {lines.map((line, index) => (
        <p
          key={`${line}-${index}`}
          className={
            index === 0
              ? "text-[20px] font-semibold tracking-[-0.03em] text-text-primary"
              : "mt-2 text-[14px] leading-[1.7] text-text-secondary"
          }
        >
          {line}
        </p>
      ))}
    </div>
  );
}

function TransactionMetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-medium text-text-primary">{value}</p>
    </div>
  );
}

export function TransactionDetailPage({
  transaction,
}: TransactionDetailPageProps) {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          backHref="/transactions"
          backLabel="Back to transactions"
          showCancel={false}
          showProceed={false}
        />
      </div>

      <Panel title="Transaction" bodyClassName="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <TransactionMetaItem label="Transaction ID" value={transaction.id} />
          <TransactionMetaItem
            label="Paid at"
            value={`${transaction.date} ${transaction.time}`}
          />
          <TransactionMetaItem label="Amount" value={transaction.amount} />
          <TransactionMetaItem label="Status" value={transaction.status} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TransactionCard
            lines={[
              transaction.member,
              transaction.memberDetails.email,
              transaction.memberDetails.status,
              transaction.memberDetails.phone,
            ]}
          />

          <TransactionCard
            lines={[
              transaction.plan,
              transaction.planDetails.category,
              transaction.amount,
            ]}
          />
        </div>
      </Panel>
    </div>
  );
}
