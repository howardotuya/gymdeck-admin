"use client";

import clsx from "clsx";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { styles } from "@/constants";
import { NavTabs, OverviewCard, type NavTabItem } from "@/components/ui";
import {
  filterCollectionByPlatformScope,
  usePlatformScope,
} from "@/stores/usePlatformScope";
import { payouts, transactions, type PayoutItem, type TransactionItem } from "./data";
import { PayoutListTable } from "./organisms/payoutListTable";
import { TransactionListTable } from "./organisms/transactionListTable";

type FinanceTab = "transactions" | "payouts";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function normalizeFinanceTab(value: string | null): FinanceTab {
  return value === "payouts" ? "payouts" : "transactions";
}

function parseCurrencyAmount(value: string) {
  return Number(value.replace(/[^\d.]/g, ""));
}

function formatCurrencyAmount(value: number) {
  return currencyFormatter.format(value).replace(/\u00a0/g, " ");
}

function getTransactionOverviewItems(items: TransactionItem[]) {
  const settledRevenue = items.reduce((total, transaction) => {
    const amount = parseCurrencyAmount(transaction.amount);

    if (transaction.status === "Successful") {
      return total + amount;
    }

    if (transaction.status === "Refunded") {
      return total - amount;
    }

    return total;
  }, 0);

  const successfulPayments = items.filter((transaction) => transaction.status === "Successful");
  const failedPayments = items.filter((transaction) => transaction.status === "Failed");
  const refundedPayments = items.filter((transaction) => transaction.status === "Refunded");

  return [
    {
      label: "Total revenue",
      value: formatCurrencyAmount(settledRevenue),
    },
    {
      label: "Successful payments",
      value: successfulPayments.length.toLocaleString(),
    },
    {
      label: "Failed payments",
      value: failedPayments.length.toLocaleString(),
    },
    {
      label: "Refund count",
      value: refundedPayments.length.toLocaleString(),
    },
  ];
}

function getPayoutOverviewItems(items: PayoutItem[]) {
  const totalWithdrawals = items.reduce(
    (total, payout) => total + parseCurrencyAmount(payout.amount),
    0,
  );
  const pendingWithdrawals = items.filter((payout) => payout.status === "Pending");
  const completedWithdrawals = items.filter((payout) => payout.status === "Completed");
  const failedWithdrawals = items.filter((payout) => payout.status === "Failed");

  return [
    {
      label: "Total withdrawals",
      value: formatCurrencyAmount(totalWithdrawals),
    },
    {
      label: "Pending withdrawals",
      value: pendingWithdrawals.length.toLocaleString(),
    },
    {
      label: "Completed withdrawals",
      value: completedWithdrawals.length.toLocaleString(),
    },
    {
      label: "Failed withdrawals",
      value: failedWithdrawals.length.toLocaleString(),
    },
  ];
}

export function PaymentsPage() {
  const { selectedBranchId, timelineScope } = usePlatformScope();
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
  const filteredTransactions = useMemo(
    () =>
      filterCollectionByPlatformScope({
        items: transactions,
        selectedBranchId,
        timelineScope,
        getBranchName: (transaction) => transaction.branch,
        getDate: (transaction) => `${transaction.date} ${transaction.time}`,
      }),
    [selectedBranchId, timelineScope],
  );
  const filteredPayouts = useMemo(
    () =>
      filterCollectionByPlatformScope({
        items: payouts,
        selectedBranchId,
        timelineScope,
        getDate: (payout) => payout.requestedDate,
      }),
    [selectedBranchId, timelineScope],
  );
  const overview = useMemo(
    () =>
      activeTab === "payouts"
        ? getPayoutOverviewItems(filteredPayouts)
        : getTransactionOverviewItems(filteredTransactions),
    [activeTab, filteredPayouts, filteredTransactions],
  );

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
          <OverviewCard key={item.label} label={item.label} value={item.value} size="hero" />
        ))}
      </section>

      {activeTab === "payouts" ? (
        <PayoutListTable payouts={filteredPayouts} />
      ) : (
        <TransactionListTable transactions={filteredTransactions} />
      )}
    </div>
  );
}
