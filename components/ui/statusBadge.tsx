import clsx from "clsx";

export type StatusTone = "brand" | "success" | "warning" | "danger" | "neutral";

type StatusBadgeProps = {
  label: string;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  brand: "bg-bg-brand-soft text-text-brand",
  success: "bg-bg-success-soft text-text-success",
  warning: "bg-bg-warning-soft text-text-warning",
  danger: "bg-bg-danger-soft text-text-danger",
  neutral: "bg-bg-muted text-text-secondary",
};

export function StatusBadge({ label, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]",
        toneClasses[tone],
      )}
    >
      {label}
    </span>
  );
}
