import clsx from "clsx";
import type { ReactNode } from "react";

type FormSectionCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function FormSectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: FormSectionCardProps) {
  const hasHeader = Boolean(title || description || action);

  return (
    <section
      className={clsx(
        "rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-[640px]">
            {title ? (
              <h3 className="text-[20px] font-semibold tracking-[-0.03em] text-text-primary">
                {title}
              </h3>
            ) : null}
            {description ? (
              <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                {description}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={clsx(hasHeader ? "mt-5" : "", bodyClassName)}>{children}</div>
    </section>
  );
}
