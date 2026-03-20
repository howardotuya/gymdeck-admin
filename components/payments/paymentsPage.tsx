import { OverviewCard } from "@/components/ui";
import { paymentOverview, transactions } from "./data";
import { TransactionListTable } from "./organisms/transactionListTable";

export function PaymentsPage() {
  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {paymentOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <TransactionListTable transactions={transactions} />
    </div>
  );
}
