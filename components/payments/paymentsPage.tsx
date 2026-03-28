"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { styles } from "@/constants";
import { NavTabs, OverviewCard, type NavTabItem } from "@/components/ui";
import { payoutOverview, payouts, transactionOverview, transactions } from "./data";
import { PayoutListTable } from "./organisms/payoutListTable";
import { TransactionListTable } from "./organisms/transactionListTable";

type FinanceTab = "transactions" | "payouts";

function normalizeFinanceTab(value: string | null): FinanceTab {
  return value === "payouts" ? "payouts" : "transactions";
}

export function PaymentsPage() {
  const searchParams = useSearchParams();
  const activeTab = normalizeFinanceTab(searchParams.get("tab"));
  const tabs = useMemo<NavTabItem[]>(
    () => [
      {
        href: "/transactions?tab=transactions",
        label: "Transactions",
        active: activeTab === "transactions",
      },
      {
        href: "/transactions?tab=payouts",
        label: "Payouts",
        active: activeTab === "payouts",
      },
    ],
    [activeTab],
  );
  const overview = activeTab === "payouts" ? payoutOverview : transactionOverview;

  return (
    <div className="space-y-6 lg:space-y-8">
      <NavTabs
        tabs={tabs}
        ariaLabel="Finance views"
        className={clsx(
          styles.APP_XSPACING,
          styles.NEGATIVE_APP_XSPACING,
          styles.NEGATIVE_APP_YTSPACING,
        )}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      {activeTab === "payouts" ? (
        <PayoutListTable payouts={payouts} />
      ) : (
        <TransactionListTable transactions={transactions} />
      )}
    </div>
  );
}
