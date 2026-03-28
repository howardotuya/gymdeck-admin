import Link from "next/link";
import clsx from "clsx";
import { Panel, StatusBadge, type StatusTone } from "@/components/ui";
import {
  capacityWatch,
  expirySummary,
  kpiStats,
  overviewSeries,
  recentBookings,
  recentPayments,
  staffNotes,
  upcomingClasses,
} from "./data";

const primaryActions = [
  { href: "/check-ins", label: "Check in member", primary: true },
  { href: "/transactions", label: "Open ledger", primary: false },
] as const;

const summaryToneClasses: Record<StatusTone, string> = {
  brand: "text-text-brand",
  success: "text-text-success",
  warning: "text-text-warning",
  danger: "text-text-danger",
  neutral: "text-text-secondary",
};

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
        "inline-flex h-10 items-center rounded-full border px-4 text-[13px] font-semibold transition-colors",
        primary
          ? "border-transparent bg-bg-brand-strong text-text-inverse"
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
  detail: string;
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
      <p className="mt-1.5 text-[12px] leading-[1.5] text-text-secondary">{detail}</p>
    </article>
  );
}

function SummaryRow({
  label,
  value,
  detail,
  tone = "neutral",
}: {
  label: string;
  value: string;
  detail: string;
  tone?: StatusTone;
}) {
  return (
    <div className="rounded-[18px] bg-bg-muted px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-semibold text-text-primary">{label}</p>
        <span className={clsx("text-[13px] font-semibold", summaryToneClasses[tone])}>
          {value}
        </span>
      </div>
      <p className="mt-1.5 text-[12px] leading-[1.5] text-text-secondary">{detail}</p>
    </div>
  );
}

function formatSlotLabel(label: string) {
  if (label.endsWith("a")) {
    return `${label.slice(0, -1)} AM`;
  }

  if (label.endsWith("p")) {
    return `${label.slice(0, -1)} PM`;
  }

  return label;
}

function OverviewChart() {
  const checkInMax = Math.max(...overviewSeries.checkIns, 1);
  const bookingMax = Math.max(...overviewSeries.bookings, 1);
  const peakCheckIns = Math.max(...overviewSeries.checkIns, 1);
  const peakCheckInsIndex = overviewSeries.checkIns.indexOf(peakCheckIns);
  const totalCheckIns = overviewSeries.checkIns.reduce((sum, value) => sum + value, 0);
  const totalBookings = overviewSeries.bookings.reduce((sum, value) => sum + value, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-[12px] text-text-secondary">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-bg-brand-strong" />
          Check-ins
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-bg-brand-soft ring-1 ring-border-brand" />
          Bookings
        </span>
      </div>

      <div className="rounded-[18px] border border-border-subtle bg-bg-muted/70 p-4">
        <div className="grid grid-cols-8 gap-2 sm:gap-3">
          {overviewSeries.labels.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-2.5">
              <div className="flex h-[164px] w-full items-end justify-center gap-1">
                <span
                  className="w-[10px] rounded-full bg-bg-brand-soft ring-1 ring-border-brand"
                  style={{
                    height: `${Math.max((overviewSeries.bookings[index] / bookingMax) * 122, 16)}px`,
                  }}
                />
                <span
                  className="w-[10px] rounded-full bg-bg-brand-strong"
                  style={{
                    height: `${Math.max((overviewSeries.checkIns[index] / checkInMax) * 146, 20)}px`,
                  }}
                />
              </div>
              <span className="text-[11px] font-medium text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-[12px] text-text-secondary">
        <span className="rounded-full bg-bg-muted px-3 py-1.5">
          {totalCheckIns.toLocaleString()} total check-ins
        </span>
        <span className="rounded-full bg-bg-muted px-3 py-1.5">
          {totalBookings.toLocaleString()} total bookings
        </span>
        <span className="rounded-full bg-bg-muted px-3 py-1.5">
          Peak at {formatSlotLabel(overviewSeries.labels[peakCheckInsIndex] ?? "6p")}
        </span>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const primaryMetrics = kpiStats.slice(0, 4);
  const expiringToday = expirySummary[0];
  const pendingIssues = kpiStats[5];
  const primaryCapacityWatch = capacityWatch[0];
  const notePreview = staffNotes[0];

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-bg-success-soft px-3 py-1 text-[12px] font-semibold text-text-success">
              Live operations
            </span>
            <span className="rounded-full bg-bg-muted px-3 py-1 text-[12px] font-semibold text-text-secondary">
              Thu, Mar 26
            </span>
          </div>

          <div>
            <h2 className="text-[30px] font-semibold tracking-[-0.05em] text-text-primary">
              Dashboard
            </h2>
            <p className="mt-2 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">
              Essential traffic, check-ins, and revenue for the day.
            </p>
          </div>
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
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.footer}
            delta={metric.delta}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_320px]">
        <Panel eyebrow="Overview" title="Traffic and bookings">
          <OverviewChart />
        </Panel>

        <Panel eyebrow="Today" title="Needs attention" bodyClassName="space-y-3">
          {expiringToday ? (
            <SummaryRow
              label={expiringToday.label}
              value={expiringToday.value}
              detail={expiringToday.detail}
              tone="warning"
            />
          ) : null}

          {pendingIssues ? (
            <SummaryRow
              label={pendingIssues.label}
              value={pendingIssues.value}
              detail={pendingIssues.footer}
              tone="danger"
            />
          ) : null}

          {primaryCapacityWatch ? (
            <SummaryRow
              label={primaryCapacityWatch.name}
              value={primaryCapacityWatch.label}
              detail={primaryCapacityWatch.detail}
              tone={primaryCapacityWatch.tone}
            />
          ) : null}

          {notePreview ? (
            <div className="rounded-[18px] border border-border-subtle bg-bg-surface px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">
                Staff note
              </p>
              <p className="mt-2 text-[13px] leading-[1.6] text-text-secondary">{notePreview}</p>
            </div>
          ) : null}

          <div className="border-t border-border-soft pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                Next classes
              </p>
              <Link href="/classes" className="text-[13px] font-semibold text-text-brand">
                Open classes
              </Link>
            </div>

            <div className="mt-3 space-y-2">
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
                  <StatusBadge label={item.time} tone={item.tone} />
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Panel
          eyebrow="Queue"
          title="Recent bookings"
          action={
            <Link href="/check-ins" className="text-[13px] font-semibold text-text-brand">
              Open check-ins
            </Link>
          }
          bodyClassName="space-y-2"
        >
          {recentBookings.slice(0, 3).map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between gap-3 rounded-[18px] bg-bg-muted px-4 py-3"
            >
              <div>
                <p className="text-[14px] font-semibold text-text-primary">{booking.member}</p>
                <p className="mt-1 text-[12px] text-text-secondary">
                  {booking.type} • {booking.slot}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge label={booking.status} tone={booking.tone} />
                <p className="mt-1 text-[12px] text-text-secondary">{booking.time}</p>
              </div>
            </div>
          ))}
        </Panel>

        <Panel
          eyebrow="Payments"
          title="Recent transactions"
          action={
            <Link href="/transactions" className="text-[13px] font-semibold text-text-brand">
              Open ledger
            </Link>
          }
          bodyClassName="space-y-2"
        >
          {recentPayments.slice(0, 3).map((payment) => (
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
          ))}
        </Panel>
      </section>
    </div>
  );
}
