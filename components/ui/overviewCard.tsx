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
    card: "rounded-[24px] p-4",
    label: "max-w-[160px] text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle",
    value: "mt-4 text-[30px] font-semibold tracking-[-0.05em] text-text-primary",
    detail: "mt-2 text-[13px] leading-[1.5] text-text-secondary",
  },
  hero: {
    card: "rounded-[20px] p-5",
    label: "text-[14px] text-text-primary",
    value: "mt-4 text-[48px] font-semibold tracking-[-0.06em] text-text-primary",
    detail: "mt-3 max-w-[240px] text-[13px] leading-[1.6] text-text-secondary",
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
