"use client";

import clsx from "clsx";
import { useEffect } from "react";
import { CloseIcon, FilterIcon } from "@/components/icons";
import { Select } from "@/components/ui/select";
import { TableControlButton } from "../atoms/tableControlButton";
import type {
  CustomTableDateRangeValue,
  CustomTableFilterField,
  CustomTableFilterValues,
} from "../types";

type CustomTableFilterSidebarProps<T> = {
  open: boolean;
  fields: CustomTableFilterField<T>[];
  values: CustomTableFilterValues;
  onChange: (values: CustomTableFilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
};

function getTextValue(value: unknown) {
  return typeof value === "string" ? value : "";
}

function getCheckboxValue(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function getDateRangeValue(value: unknown): CustomTableDateRangeValue {
  if (!value || typeof value !== "object") {
    return {};
  }

  const { start, end } = value as CustomTableDateRangeValue;
  return {
    start: typeof start === "string" ? start : "",
    end: typeof end === "string" ? end : "",
  };
}

export function CustomTableFilterSidebar<T>({
  open,
  fields,
  values,
  onApply,
  onChange,
  onClear,
  onClose,
}: CustomTableFilterSidebarProps<T>) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  const updateValue = (fieldId: string, value: unknown) => {
    const nextValues = { ...values };

    if (
      value == null ||
      (typeof value === "string" && value.trim().length === 0) ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" &&
        !Array.isArray(value) &&
        Object.values(value as Record<string, unknown>).every(
          (entry) => entry == null || String(entry).trim().length === 0,
        ))
    ) {
      delete nextValues[fieldId];
    } else {
      nextValues[fieldId] = value;
    }

    onChange(nextValues);
  };

  return (
    <div
      className="fixed inset-0 z-[150] bg-bg-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filter table rows"
        onMouseDown={(event) => event.stopPropagation()}
        className="absolute inset-y-0 right-0 flex h-full w-full max-w-[440px] flex-col border-l border-border-soft bg-bg-surface shadow-[var(--shadow-panel)]"
      >
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-bg-muted text-text-secondary">
              <FilterIcon size={18} />
            </span>
            <div>
              <p className="text-[18px] font-semibold text-text-primary">
                Filter By
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="inline-flex size-10 items-center justify-center rounded-full bg-bg-action-soft text-text-support transition-colors hover:bg-bg-action-soft-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
          {fields.map((field) => {
            if (field.type === "text") {
              return (
                <label key={field.id} className="block">
                  <span className="mb-2 block text-[13px] font-medium text-text-primary">
                    {field.label}
                  </span>
                  <input
                    type="text"
                    value={getTextValue(values[field.id])}
                    placeholder={
                      field.placeholder ??
                      `Filter by ${field.label.toLowerCase()}`
                    }
                    onChange={(event) =>
                      updateValue(field.id, event.target.value)
                    }
                    className="min-h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 py-2 text-[14px] text-text-primary outline-none transition-shadow placeholder:text-text-secondary focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]"
                  />
                </label>
              );
            }

            if (field.type === "select") {
              return (
                <div key={field.id}>
                  <p className="mb-2 text-[13px] font-medium text-text-primary">
                    {field.label}
                  </p>
                  <Select
                    id={field.id}
                    options={field.options}
                    value={
                      field.multiple
                        ? Array.isArray(values[field.id])
                          ? (values[field.id] as string[])
                          : []
                        : typeof values[field.id] === "string"
                          ? (values[field.id] as string)
                          : ""
                    }
                    onChange={(value) => updateValue(field.id, value)}
                    multiple={field.multiple}
                    placeholder={
                      field.placeholder ?? `Select ${field.label.toLowerCase()}`
                    }
                    allOptionLabel={field.allOptionLabel}
                  />
                </div>
              );
            }

            if (field.type === "checkbox") {
              return (
                <label
                  key={field.id}
                  className="flex items-start gap-3 rounded-[20px] border border-border-soft bg-bg-muted/40 px-4 py-4"
                >
                  <input
                    type="checkbox"
                    checked={getCheckboxValue(values[field.id])}
                    onChange={(event) =>
                      updateValue(field.id, event.target.checked)
                    }
                    className="mt-1 size-4 rounded border-border-soft text-brand-primary focus:ring-brand-primary/20"
                  />
                  <span>
                    <span className="block text-[14px] font-medium text-text-primary">
                      {field.label}
                    </span>
                    {field.description ? (
                      <span className="mt-1 block text-[13px] text-text-secondary">
                        {field.description}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            }

            if (field.type === "radio") {
              return (
                <fieldset key={field.id}>
                  <legend className="mb-3 text-[13px] font-medium text-text-primary">
                    {field.label}
                  </legend>
                  <div className="space-y-3">
                    {field.options.map((option) => (
                      <label
                        key={option.value}
                        className={clsx(
                          "flex items-center gap-3 rounded-[18px] border px-4 py-3 transition-colors",
                          values[field.id] === option.value
                            ? "border-border-strong bg-bg-muted"
                            : "border-border-soft bg-bg-surface",
                        )}
                      >
                        <input
                          type="radio"
                          name={field.id}
                          value={option.value}
                          checked={values[field.id] === option.value}
                          onChange={() => updateValue(field.id, option.value)}
                          className="size-4 border-border-soft text-brand-primary focus:ring-brand-primary/20"
                        />
                        <span className="text-[14px] text-text-primary">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            }

            if (field.type === "date") {
              return (
                <label key={field.id} className="block">
                  <span className="mb-2 block text-[13px] font-medium text-text-primary">
                    {field.label}
                  </span>
                  <input
                    type="date"
                    value={getTextValue(values[field.id])}
                    onChange={(event) =>
                      updateValue(field.id, event.target.value)
                    }
                    className="min-h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 py-2 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]"
                  />
                </label>
              );
            }

            const dateRangeValue = getDateRangeValue(values[field.id]);

            return (
              <div key={field.id}>
                <p className="mb-3 text-[13px] font-medium text-text-primary">
                  {field.label}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-[12px] uppercase tracking-[0.08em] text-text-subtle">
                      {field.startLabel ?? "Start"}
                    </span>
                    <input
                      type="date"
                      value={dateRangeValue.start ?? ""}
                      onChange={(event) =>
                        updateValue(field.id, {
                          ...dateRangeValue,
                          start: event.target.value,
                        })
                      }
                      className="min-h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 py-2 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[12px] uppercase tracking-[0.08em] text-text-subtle">
                      {field.endLabel ?? "End"}
                    </span>
                    <input
                      type="date"
                      value={dateRangeValue.end ?? ""}
                      onChange={(event) =>
                        updateValue(field.id, {
                          ...dateRangeValue,
                          end: event.target.value,
                        })
                      }
                      className="min-h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 py-2 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]"
                    />
                  </label>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border-soft px-6 py-5">
          <div className="flex flex-wrap justify-end gap-3">
            <TableControlButton onClick={onClear}>
              Clear Filter
            </TableControlButton>
            <TableControlButton variant="primary" onClick={onApply}>
              Apply Filters
            </TableControlButton>
          </div>
        </div>
      </aside>
    </div>
  );
}
