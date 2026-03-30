import clsx from "clsx";
import type { ReactNode } from "react";
import {
  formFieldClassName,
  formTextAreaClassName,
} from "@/components/ui/fieldStyles";

export const primaryActionClassName =
  "inline-flex h-[49px] items-center justify-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";
export const secondaryActionClassName =
  "inline-flex h-[49px] items-center justify-center rounded-full border border-border-soft bg-bg-surface px-5 text-[14px] font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-bg-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/20";
export const inputClassName = formFieldClassName;
export const textAreaClassName = formTextAreaClassName;

export function Field({
  id,
  label,
  required = false,
  helper,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
      {helper ? <span className="text-[12px] text-text-secondary">{helper}</span> : null}
    </label>
  );
}

export function SelectionPill({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={clsx(
        "inline-flex min-h-11 items-center rounded-full border px-4 text-[14px] font-medium transition-colors",
        checked
          ? "border-border-brand bg-bg-brand-soft text-text-brand"
          : "border-border-soft bg-bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary",
      )}
    >
      {label}
    </button>
  );
}
