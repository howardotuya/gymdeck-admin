import Link from "next/link";
import clsx from "clsx";
import { KPIStatCard } from "./atoms/kpiStatCard";
import { Panel, StatusBadge } from "@/components/ui";
import {
  capacityWatch,
  dashboardFilters,
  expirySummary,
  kpiStats,
  overviewSeries,
  quickActions,
  recentBookings,
  recentPayments,
  reviewSummary,
  staffNotes,
  topPlans,
  upcomingClasses,
} from "./data";

function ToolbarButton({
  children,
  active = false,
  href,
}: {
  children: React.ReactNode;
  active?: boolean;
  href?: string;
}) {
  const className = clsx(
    "inline-flex h-11 items-center rounded-xl border px-4 text-[13px] font-semibold transition-colors",
    active
      ? "border-transparent bg-bg-brand-strong text-text-inverse"
      : "border-border-soft bg-bg-surface text-text-primary hover:border-border-strong",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {children}
    </button>
  );
}

function OverviewChart() {
  const checkInMax = Math.max(...overviewSeries.checkIns, 1);
  const bookingMax = Math.max(...overviewSeries.bookings, 1);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-[13px] text-text-secondary">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-bg-brand-strong" />
            Check-ins
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-bg-brand-soft ring-1 ring-border-brand" />
            Bookings
          </span>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-bg-muted p-1 text-[12px] font-medium text-text-secondary">
          {dashboardFilters.map((filter, index) => (
            <span
              key={filter}
              className={clsx(
                "rounded-full px-3 py-2",
                index === 0 && "bg-bg-surface text-text-primary shadow-[var(--shadow-card)]",
              )}
            >
              {filter}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-[20px] border border-border-subtle bg-bg-muted/70 p-4">
        <div className="grid grid-cols-8 gap-3">
          {overviewSeries.labels.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="flex h-[220px] w-full items-end justify-center gap-1">
                <span
                  className="w-[10px] rounded-full bg-bg-brand-soft ring-1 ring-border-brand"
                  style={{
                    height: `${Math.max((overviewSeries.bookings[index] / bookingMax) * 168, 20)}px`,
                  }}
                />
                <span
                  className="w-[10px] rounded-full bg-bg-brand-strong"
                  style={{
                    height: `${Math.max((overviewSeries.checkIns[index] / checkInMax) * 196, 28)}px`,
                  }}
                />
              </div>
              <span className="text-[12px] font-medium text-text-secondary">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileListCard<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  return <div className="space-y-3 md:hidden">{items.map(renderItem)}</div>;
}

function DesktopTable({
  children,
  columns,
}: {
  children: React.ReactNode;
  columns: React.ReactNode;
}) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left">
            {columns}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function DashboardPage() {
  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge label="Live operations" tone="success" />
          <span className="text-[13px] text-text-secondary">
            Last updated 4 minutes ago
          </span>
          <span className="text-[13px] text-text-secondary">
            2 urgent issues need review
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <ToolbarButton>Mar 20, 2026</ToolbarButton>
          <ToolbarButton href="/members" active>
            Check in member
          </ToolbarButton>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpiStats.map((kpi) => (
          <KPIStatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            delta={kpi.delta}
            footer={kpi.footer}
            sparkline={kpi.sparkline}
            tone={kpi.tone}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_360px]">
        <Panel
          eyebrow="Overview"
          title="Check-ins and bookings"
          description="The main dashboard view should prioritize operational flow first: active traffic, booking pressure, and the periods where the front desk is likely to feel it."
        >
          <OverviewChart />
        </Panel>

        <div className="space-y-4">
          <Panel eyebrow="Upcoming classes" title="Next sessions">
            <div className="space-y-3">
              {upcomingClasses.map((item) => (
                <div
                  key={`${item.time}-${item.name}`}
                  className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-text-primary">{item.name}</p>
                      <p className="mt-1 text-[13px] text-text-secondary">{item.instructor}</p>
                    </div>
                    <StatusBadge label={item.time} tone={item.tone} />
                  </div>
                  <p className="mt-3 text-[13px] text-text-secondary">{item.seats}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Capacity watch" title="Low-capacity and full classes">
            <div className="space-y-3">
              {capacityWatch.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{item.name}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">{item.detail}</p>
                  </div>
                  <StatusBadge label={item.label} tone={item.tone} />
                </div>
              ))}
            </div>
          </Panel>

          <Panel eyebrow="Staff notes" title="Alerts and follow-ups">
            <ul className="space-y-3">
              {staffNotes.map((note) => (
                <li
                  key={note}
                  className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4 text-[13px] leading-[1.6] text-text-secondary"
                >
                  {note}
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px]">
        <Panel
          eyebrow="Recent payments"
          title="Transactions"
          description="Amounts stay right-aligned and statuses stay visible so finance issues are easy to scan."
          action={
            <Link href="/payments" className="text-[13px] font-semibold text-text-brand">
              View all
            </Link>
          }
        >
          <MobileListCard
            items={recentPayments}
            renderItem={(payment) => (
              <div
                key={payment.id}
                className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{payment.member}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">{payment.plan}</p>
                  </div>
                  <p className="text-[14px] font-semibold text-text-primary">{payment.amount}</p>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <StatusBadge label={payment.status} tone={payment.tone} />
                  <span className="text-[12px] text-text-secondary">
                    {payment.method} • {payment.date}
                  </span>
                </div>
              </div>
            )}
          />

          <DesktopTable
            columns={
              <>
                {["Member", "Plan", "Method", "Status", "Amount"].map((column) => (
                  <th
                    key={column}
                    className={clsx(
                      "border-b border-border-soft px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-subtle",
                      column === "Amount" ? "text-right" : "",
                    )}
                  >
                    {column}
                  </th>
                ))}
              </>
            }
          >
            {recentPayments.map((payment) => (
              <tr key={payment.id} className="hover:bg-bg-muted/60">
                <td className="border-b border-border-subtle px-4 py-4">
                  <p className="text-[14px] font-semibold text-text-primary">{payment.member}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">{payment.id}</p>
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-[13px] text-text-secondary">
                  {payment.plan}
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-[13px] text-text-secondary">
                  {payment.method}
                </td>
                <td className="border-b border-border-subtle px-4 py-4">
                  <StatusBadge label={payment.status} tone={payment.tone} />
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-right">
                  <p className="text-[14px] font-semibold text-text-primary">{payment.amount}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">{payment.date}</p>
                </td>
              </tr>
            ))}
          </DesktopTable>
        </Panel>

        <Panel
          eyebrow="Recent bookings"
          title="Check-in queue"
          description="Bookings stay compact here because the detail page should carry the heavier actions."
          action={
            <Link href="/bookings" className="text-[13px] font-semibold text-text-brand">
              View all
            </Link>
          }
        >
          <MobileListCard
            items={recentBookings}
            renderItem={(booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{booking.member}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">
                      {booking.type} • {booking.slot}
                    </p>
                  </div>
                  <StatusBadge label={booking.status} tone={booking.tone} />
                </div>
                <p className="mt-3 text-[12px] text-text-secondary">
                  {booking.id} • {booking.time}
                </p>
              </div>
            )}
          />

          <DesktopTable
            columns={
              <>
                {["Member", "Type", "Slot", "Status", "Time"].map((column) => (
                  <th
                    key={column}
                    className="border-b border-border-soft px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-[0.08em] text-text-subtle"
                  >
                    {column}
                  </th>
                ))}
              </>
            }
          >
            {recentBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-bg-muted/60">
                <td className="border-b border-border-subtle px-4 py-4">
                  <p className="text-[14px] font-semibold text-text-primary">{booking.member}</p>
                  <p className="mt-1 text-[12px] text-text-secondary">{booking.id}</p>
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-[13px] text-text-secondary">
                  {booking.type}
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-[13px] text-text-secondary">
                  {booking.slot}
                </td>
                <td className="border-b border-border-subtle px-4 py-4">
                  <StatusBadge label={booking.status} tone={booking.tone} />
                </td>
                <td className="border-b border-border-subtle px-4 py-4 text-[13px] text-text-secondary">
                  {booking.time}
                </td>
              </tr>
            ))}
          </DesktopTable>
        </Panel>

        <Panel
          eyebrow="Quick actions"
          title="Most-used tasks"
          description="Keep high-frequency staff actions visible without forcing a deep page visit."
        >
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={clsx(
                  "block rounded-2xl border px-4 py-4 transition-colors",
                  action.primary
                    ? "border-transparent bg-bg-brand-strong text-text-inverse"
                    : "border-border-soft bg-bg-surface text-text-primary hover:border-border-strong",
                )}
              >
                <p className="text-[14px] font-semibold">{action.label}</p>
                <p
                  className={clsx(
                    "mt-1 text-[13px] leading-[1.5]",
                    action.primary ? "text-text-inverse/80" : "text-text-secondary",
                  )}
                >
                  {action.detail}
                </p>
              </Link>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Panel eyebrow="Reviews summary" title="Public sentiment">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[42px] font-semibold tracking-[-0.06em] text-text-primary">
                {reviewSummary.average}
              </p>
              <p className="text-[13px] text-text-secondary">{reviewSummary.total}</p>
            </div>
            <Link href="/reviews" className="text-[13px] font-semibold text-text-brand">
              Manage reviews
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {reviewSummary.distribution.map((item) => (
              <div key={item.label} className="grid grid-cols-[56px_minmax(0,1fr)_40px] items-center gap-3">
                <span className="text-[12px] text-text-secondary">{item.label}</span>
                <div className="h-2 rounded-full bg-bg-muted">
                  <div
                    className="h-full rounded-full bg-bg-brand-strong"
                    style={{ width: `${(item.value / reviewSummary.distribution[0].value) * 100}%` }}
                  />
                </div>
                <span className="text-right text-[12px] text-text-secondary">{item.value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Expiry summary" title="Membership renewals">
          <div className="space-y-3">
            {expirySummary.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[14px] font-semibold text-text-primary">{item.label}</p>
                  <span className="text-[20px] font-semibold tracking-[-0.04em] text-text-primary">
                    {item.value}
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-[1.5] text-text-secondary">{item.detail}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Top plans" title="Best-performing products">
          <div className="space-y-3">
            {topPlans.map((plan, index) => (
              <div
                key={plan.name}
                className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{plan.name}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">{plan.members}</p>
                  </div>
                  <StatusBadge
                    label={`#${index + 1}`}
                    tone={index === 0 ? "brand" : index === 1 ? "success" : "neutral"}
                  />
                </div>
                <p className="mt-3 text-[16px] font-semibold text-text-primary">{plan.revenue}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </div>
  );
}
