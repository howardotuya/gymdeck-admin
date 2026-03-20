import clsx from "clsx";
import type { ReactNode } from "react";

type PanelProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function Panel({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: PanelProps) {
  return (
    <section
      className={clsx(
        "rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {eyebrow || title || action ? (
        <div className="flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-2 max-w-[560px] text-[13px] leading-[1.6] text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={clsx(eyebrow || title || action ? "mt-5" : "", bodyClassName)}>{children}</div>
    </section>
  );
}
