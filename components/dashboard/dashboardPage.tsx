"use client";

import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";
import { initialCheckInRecords, type CheckInRecord } from "@/components/check-ins/data";
import { members } from "@/components/members/data";
import { transactions, type TransactionItem } from "@/components/payments/data";
import { Panel, StatusBadge } from "@/components/ui";
import {
  filterCollectionByPlatformScope,
  usePlatformScope,
} from "@/stores/usePlatformScope";
import { upcomingClasses } from "./data";

const primaryActions = [
  { href: "/check-ins", label: "Check in member", primary: true },
  { href: "/transactions", label: "Open ledger", primary: false },
] as const;

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function parseCurrencyAmount(value: string) {
  return Number(value.replace(/[^\d.]/g, ""));
}

function formatCurrencyAmount(value: number) {
  return currencyFormatter.format(value).replace(/\u00a0/g, " ");
}

function getCheckInTimestamp(record: CheckInRecord) {
  return new Date(`${record.date} ${record.time}`);
}

function getTransactionTimestamp(transaction: TransactionItem) {
  return new Date(`${transaction.date} ${transaction.time}`);
}

function ActionButton({
  href,
  label,
  primary = false,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-semibold transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30",
        primary
          ? "border-transparent bg-brand-primary text-text-inverse hover:bg-brand-primary-hover"
          : "border-border-soft bg-bg-surface text-text-primary hover:border-border-strong",
      )}
    >
      {label}
    </Link>
  );
}

function MetricCard({
  label,
  value,
  detail,
  delta,
}: {
  label: string;
  value: string;
  detail?: string;
  delta: string;
}) {
  return (
    <article className="rounded-[18px] border border-border-soft bg-bg-surface p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">
          {label}
        </p>
        <span className="text-[12px] font-semibold text-text-secondary">{delta}</span>
      </div>
      <p className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text-primary">
        {value}
      </p>
      {detail ? <p className="mt-1.5 text-[12px] leading-[1.5] text-text-secondary">{detail}</p> : null}
    </article>
  );
}

export function DashboardPage() {
  const {
    selectedBranchId,
    timelineLabel,
    timelineScope,
  } = usePlatformScope();
  const filteredCheckIns = useMemo(
    () =>
      filterCollectionByPlatformScope({
        items: initialCheckInRecords,
        selectedBranchId,
        timelineScope,
        getBranchName: (record) => record.branch,
        getDate: (record) => `${record.date} ${record.time}`,
      }),
    [selectedBranchId, timelineScope],
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
  const scopedMemberSignups = useMemo(
    () =>
      filterCollectionByPlatformScope({
        items: members,
        selectedBranchId,
        timelineScope,
        getBranchName: (member) => member.branch,
        getDate: (member) => member.joinedDate,
      }),
    [selectedBranchId, timelineScope],
  );
  const recentCheckIns = useMemo(
    () =>
      [...filteredCheckIns]
        .sort((left, right) => getCheckInTimestamp(right).getTime() - getCheckInTimestamp(left).getTime())
        .slice(0, 3),
    [filteredCheckIns],
  );
  const recentTransactions = useMemo(
    () =>
      [...filteredTransactions]
        .sort(
          (left, right) =>
            getTransactionTimestamp(right).getTime() - getTransactionTimestamp(left).getTime(),
        )
        .slice(0, 3),
    [filteredTransactions],
  );
  const settledTransactions = filteredTransactions.filter(
    (transaction) => transaction.status === "Successful",
  ).length;
  const netRevenue = filteredTransactions.reduce((total, transaction) => {
    const amount = parseCurrencyAmount(transaction.amount);

    if (transaction.status === "Successful") {
      return total + amount;
    }

    if (transaction.status === "Refunded") {
      return total - amount;
    }

    return total;
  }, 0);
  const branchScopeDelta = selectedBranchId === "all" ? "All branches" : "1 branch";
  const primaryMetrics = [
    {
      label: "Members added",
      value: scopedMemberSignups.length.toLocaleString(),
      delta: branchScopeDelta,
    },
    {
      label: "Check-ins",
      value: filteredCheckIns.length.toLocaleString(),
      delta: timelineLabel,
    },
    {
      label: "Payments settled",
      value: settledTransactions.toLocaleString(),
      delta: timelineLabel,
    },
    {
      label: "Net revenue",
      value: formatCurrencyAmount(netRevenue),
      delta: timelineLabel,
    },
  ];

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-text-primary">
            Dashboard
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {primaryActions.map((action) => (
            <ActionButton
              key={action.href}
              href={action.href}
              label={action.label}
              primary={Boolean(action.primary)}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {primaryMetrics.map((metric) => (
          <MetricCard key={metric.label} label={metric.label} value={metric.value} delta={metric.delta} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Next classes"
          action={
            <Link href="/classes" className="text-[13px] font-semibold text-text-brand">
              Open classes
            </Link>
          }
          className="xl:col-span-2"
          bodyClassName="grid gap-3 lg:grid-cols-2"
        >
          {upcomingClasses.slice(0, 2).map((item) => (
            <div
              key={`${item.time}-${item.name}`}
              className="flex items-center justify-between gap-3 rounded-[18px] bg-bg-muted px-4 py-3"
            >
              <div>
                <p className="text-[14px] font-semibold text-text-primary">{item.name}</p>
                <p className="mt-1 text-[12px] text-text-secondary">
                  {item.instructor} • {item.seats}
                </p>
              </div>
              <StatusBadge label={item.time} tone="neutral" />
            </div>
          ))}
        </Panel>

        <Panel
          title="Recent check-ins"
          action={
            <Link href="/check-ins" className="text-[13px] font-semibold text-text-brand">
              Open check-ins
            </Link>
          }
          bodyClassName="space-y-2"
        >
          {recentCheckIns.length ? (
            recentCheckIns.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between gap-3 rounded-[18px] bg-bg-muted px-4 py-3"
              >
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">{record.member}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {record.typeLabel} • {record.itemName}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge label={record.status} tone={record.statusTone} />
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {record.date} • {record.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] bg-bg-muted px-4 py-6 text-[13px] text-text-secondary">
              No check-ins fall inside the current branch and timeline filters.
            </div>
          )}
        </Panel>

        <Panel
          title="Recent transactions"
          action={
            <Link href="/transactions" className="text-[13px] font-semibold text-text-brand">
              Open ledger
            </Link>
          }
          bodyClassName="space-y-2"
        >
          {recentTransactions.length ? (
            recentTransactions.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-3 rounded-[18px] bg-bg-muted px-4 py-3"
              >
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">{payment.member}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {payment.plan} • {payment.method}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-text-primary">{payment.amount}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">
                    {payment.status} • {payment.date}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[18px] bg-bg-muted px-4 py-6 text-[13px] text-text-secondary">
              No transactions fall inside the current branch and timeline filters.
            </div>
          )}
        </Panel>
      </section>
    </div>
  );
}
