import clsx from "clsx";
import type { StatusTone } from "@/components/ui";

type MiniBarSparklineProps = {
  points: number[];
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  brand: "bg-bg-brand-strong/80",
  success: "bg-text-success/80",
  warning: "bg-text-warning/80",
  danger: "bg-text-danger/80",
  neutral: "bg-text-secondary/60",
};

export function MiniBarSparkline({ points, tone = "brand" }: MiniBarSparklineProps) {
  const max = Math.max(...points, 1);

  return (
    <div className="flex h-10 items-end gap-1">
      {points.map((point, index) => (
        <span
          key={`${point}-${index}`}
          className={clsx("w-1.5 rounded-full", toneClasses[tone])}
          style={{ height: `${Math.max((point / max) * 100, 16)}%` }}
        />
      ))}
    </div>
  );
}
