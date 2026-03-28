import clsx from "clsx";
import type { ReactNode } from "react";

type OverviewCardProps = {
  label: string;
  value: string;
  detail?: string;
  accessory?: ReactNode;
  size?: "default" | "hero";
  className?: string;
};

const overviewCardStyles = {
  default: {
    card: "rounded-[20px] p-4 sm:rounded-[24px]",
    label:
      "max-w-[160px] text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle sm:text-[12px]",
    value: "mt-3 text-[28px] font-semibold tracking-[-0.05em] text-text-primary sm:mt-4 sm:text-[30px]",
    detail: "mt-2 text-[13px] leading-[1.5] text-text-secondary",
  },
  hero: {
    card: "rounded-[18px] p-4 sm:rounded-[20px] sm:p-5",
    label: "text-[13px] text-text-primary sm:text-[14px]",
    value: "mt-3 text-[36px] font-semibold tracking-[-0.06em] text-text-primary sm:mt-4 sm:text-[48px]",
    detail: "mt-3 max-w-none text-[13px] leading-[1.6] text-text-secondary sm:max-w-[240px]",
  },
} as const;

export function OverviewCard({
  label,
  value,
  detail,
  accessory,
  size = "default",
  className,
}: OverviewCardProps) {
  const styles = overviewCardStyles[size];

  return (
    <article
      className={clsx(
        "border border-border-soft bg-bg-surface shadow-[var(--shadow-card)]",
        styles.card,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={styles.label}>{label}</p>
        {accessory ? <div className="shrink-0">{accessory}</div> : null}
      </div>
      <p className={styles.value}>{value}</p>
      {detail ? <p className={styles.detail}>{detail}</p> : null}
    </article>
  );
}
