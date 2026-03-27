import type { ReactNode } from "react";
import clsx from "clsx";

export const primaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";

export const secondaryActionClassName =
  "inline-flex h-11 items-center justify-center rounded-full border border-border-soft bg-bg-surface px-5 text-[14px] font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-bg-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";

export const inputClassName =
  "h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

export const textAreaClassName =
  "min-h-[120px] w-full rounded-xl border border-border-soft bg-bg-input px-4 py-3 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

export function Field({
  id,
  label,
  helper,
  children,
  className,
}: {
  id: string;
  label: string;
  helper?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={id} className={clsx("flex flex-col gap-2", className)}>
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </span>
      {children}
      {helper ? <span className="text-[12px] text-text-secondary">{helper}</span> : null}
    </label>
  );
}
