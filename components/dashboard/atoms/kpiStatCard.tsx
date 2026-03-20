import clsx from "clsx";
import type { StatusTone } from "@/components/ui";
import { MiniBarSparkline } from "./miniBarSparkline";

type KPIStatCardProps = {
  label: string;
  value: string;
  delta: string;
  footer: string;
  sparkline: number[];
  tone?: StatusTone;
};

const toneClasses = {
  brand: "bg-bg-brand-soft text-text-brand",
  success: "bg-bg-success-soft text-text-success",
  warning: "bg-bg-warning-soft text-text-warning",
  danger: "bg-bg-danger-soft text-text-danger",
  neutral: "bg-bg-muted text-text-secondary",
};

export function KPIStatCard({
  label,
  value,
  delta,
  footer,
  sparkline,
  tone = "brand",
}: KPIStatCardProps) {
  return (
    <section className="rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
          {label}
        </p>
        <span
          className={clsx(
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
            toneClasses[tone],
          )}
        >
          {delta}
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[32px] font-semibold tracking-[-0.05em] text-text-primary">{value}</p>
          <p className="mt-2 max-w-[180px] text-[13px] leading-[1.5] text-text-secondary">
            {footer}
          </p>
        </div>

        <div className="hidden sm:block">
          <MiniBarSparkline points={sparkline} tone={tone} />
        </div>
      </div>
    </section>
  );
}
