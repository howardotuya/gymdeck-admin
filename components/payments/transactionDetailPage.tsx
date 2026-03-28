import { Panel, SetupTopbar } from "@/components/ui";
import type { FinanceRecord } from "./data";

type TransactionDetailPageProps = {
  record: FinanceRecord;
};

function FinanceCard({ lines }: { lines: string[] }) {
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

function FinanceMetaItem({
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

export function TransactionDetailPage({ record }: TransactionDetailPageProps) {
  if (record.kind === "transaction") {
    const transaction = record.item;

    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="w-full">
          <SetupTopbar
            backHref="/transactions?tab=transactions"
            backLabel="Back to transactions"
            showCancel={false}
            showProceed={false}
          />
        </div>

        <Panel title="Transaction" bodyClassName="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <FinanceMetaItem label="Transaction ID" value={transaction.id} />
            <FinanceMetaItem
              label="Paid at"
              value={`${transaction.date} ${transaction.time}`}
            />
            <FinanceMetaItem label="Amount" value={transaction.amount} />
            <FinanceMetaItem label="Status" value={transaction.status} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FinanceCard
              lines={[
                transaction.member,
                transaction.memberDetails.email,
                transaction.memberDetails.status,
                transaction.memberDetails.phone,
              ]}
            />

            <FinanceCard
              lines={[
                transaction.plan,
                transaction.planDetails.category,
                transaction.amount,
                transaction.transactionDetails.gatewayReference,
              ]}
            />
          </div>
        </Panel>
      </div>
    );
  }

  const payout = record.item;

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          backHref="/transactions?tab=payouts"
          backLabel="Back to payouts"
          showCancel={false}
          showProceed={false}
        />
      </div>

      <Panel title="Payout" bodyClassName="space-y-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <FinanceMetaItem label="Payout ID" value={payout.id} />
          <FinanceMetaItem label="Withdrawal" value={payout.withdrawal} />
          <FinanceMetaItem label="Amount" value={payout.amount} />
          <FinanceMetaItem label="Status" value={payout.status} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FinanceCard
            lines={[
              payout.withdrawal,
              payout.cadence,
              payout.beneficiaryDetails.bankName,
              payout.beneficiaryDetails.accountName,
            ]}
          />

          <FinanceCard
            lines={[
              payout.settlementDetails.reference,
              payout.requestedDate,
              payout.processedDate,
              payout.beneficiaryDetails.accountNumber,
            ]}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FinanceCard
            lines={[
              "Withdrawal note",
              payout.settlementDetails.note,
              payout.beneficiaryDetails.note,
            ]}
          />
          <FinanceCard
            lines={[
              "Exception",
              payout.settlementDetails.failureReason ?? "No failure recorded",
              `Requested ${payout.settlementDetails.requestedAt} / Processed ${payout.settlementDetails.processedAt}`,
            ]}
          />
        </div>
      </Panel>
    </div>
  );
}
