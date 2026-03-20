import Link from "next/link";

type PlaceholderPageProps = {
  title: string;
  description: string;
  eyebrow: string;
};

export function PlaceholderPage({ title, description, eyebrow }: PlaceholderPageProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_320px]">
      <section className="rounded-[28px] border border-border-soft bg-bg-surface p-6 shadow-[var(--shadow-card)] lg:p-7">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-text-subtle">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text-primary">
          {title} is staged next.
        </h2>
        <p className="mt-3 max-w-[720px] text-[14px] leading-[1.7] text-text-secondary">
          {description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-bg-muted p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
              Status
            </p>
            <p className="mt-2 text-[16px] font-semibold text-text-primary">Shell ready</p>
          </div>
          <div className="rounded-2xl bg-bg-muted p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
              Styling
            </p>
            <p className="mt-2 text-[16px] font-semibold text-text-primary">Admin tokens live</p>
          </div>
          <div className="rounded-2xl bg-bg-muted p-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
              Next step
            </p>
            <p className="mt-2 text-[16px] font-semibold text-text-primary">Build page flow</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
          Recommended next
        </p>
        <div className="mt-4 space-y-3">
          <Link
            href="/"
            className="flex items-center rounded-2xl bg-bg-brand-strong px-4 py-4 text-[14px] font-semibold text-text-inverse"
          >
            Return to dashboard
          </Link>
          <Link
            href="/members"
            className="flex items-center rounded-2xl border border-border-soft px-4 py-4 text-[14px] font-semibold text-text-primary"
          >
            Start members module
          </Link>
          <Link
            href="/classes"
            className="flex items-center rounded-2xl border border-border-soft px-4 py-4 text-[14px] font-semibold text-text-primary"
          >
            Start classes module
          </Link>
        </div>
      </section>
    </div>
  );
}
