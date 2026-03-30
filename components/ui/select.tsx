"use client";

import { SearchIcon } from "@/components/icons";
import clsx from "clsx";
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formFieldClassName, formSelectTriggerClassName } from "./fieldStyles";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
};

type SelectProps = {
  id: string;
  options: readonly SelectOption[];
  value: string[] | string;
  onChange: (value: string[] | string) => void;
  disabled?: boolean;
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  allOptionLabel?: string;
  className?: string;
};

const DESKTOP_DROPDOWN_HEIGHT = 320;
const VIEWPORT_PADDING = 24;

export function Select({
  id,
  options,
  value,
  onChange,
  disabled = false,
  multiple = false,
  placeholder = "Select option(s)",
  searchPlaceholder = "Search options",
  emptyMessage = "No options found.",
  allOptionLabel,
  className,
}: SelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [positionAbove, setPositionAbove] = useState(false);
  const [dropdownMaxHeight, setDropdownMaxHeight] = useState(DESKTOP_DROPDOWN_HEIGHT);

  const selectedValues = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value],
  );

  const isAllSelected =
    multiple &&
    selectedValues.length === options.length &&
    options.length > 0;

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) => {
      const haystack = [option.label, option.sublabel].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query);
    });
  }, [options, search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();

      if (!rect) {
        return;
      }

      const spaceBelow = window.innerHeight - rect.bottom - VIEWPORT_PADDING;
      const spaceAbove = rect.top - VIEWPORT_PADDING;
      const shouldPositionAbove =
        spaceBelow < DESKTOP_DROPDOWN_HEIGHT && spaceAbove > spaceBelow;

      setPositionAbove(shouldPositionAbove);
      setDropdownMaxHeight(
        Math.max(
          160,
          Math.min(
            DESKTOP_DROPDOWN_HEIGHT,
            shouldPositionAbove ? spaceAbove : spaceBelow,
          ),
        ),
      );
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
    }
  }, [open]);

  const toggleOpen = () => {
    if (disabled) {
      return;
    }

    setOpen((current) => {
      if (current) {
        setSearch("");
      }

      return !current;
    });
  };

  const toggleAll = () => {
    if (!multiple) {
      return;
    }

    onChange(isAllSelected ? [] : options.map((option) => option.value));
  };

  const toggleValue = (nextValue: string) => {
    if (multiple) {
      const nextValues = selectedValues.includes(nextValue)
        ? selectedValues.filter((item) => item !== nextValue)
        : [...selectedValues, nextValue];
      onChange(nextValues);
      return;
    }

    onChange(nextValue);
    setOpen(false);
    setSearch("");
  };

  const handleRemoveTag = (
    event: ReactKeyboardEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>,
    targetValue: string,
  ) => {
    event.stopPropagation();

    if (!multiple) {
      onChange("");
      return;
    }

    onChange(selectedValues.filter((item) => item !== targetValue));
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleOpen();
    }
  };

  const selectedOptions = options.filter((option) => selectedValues.includes(option.value));
  const singleValue = selectedOptions[0];

  return (
    <div ref={containerRef} className={clsx("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-ui-control-open={open ? "true" : undefined}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
        className={clsx(
          formSelectTriggerClassName,
          "relative flex items-center pr-11",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <div className={clsx("min-w-0 flex-1", multiple && "flex flex-wrap items-center gap-2")}>
          {multiple ? (
            isAllSelected && allOptionLabel ? (
              <SelectedTag
                label={allOptionLabel}
                onRemove={(event) => {
                  event.stopPropagation();
                  onChange([]);
                }}
              />
            ) : selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <SelectedTag
                  key={option.value}
                  label={option.label}
                  sublabel={option.sublabel}
                  onRemove={(event) => handleRemoveTag(event, option.value)}
                />
              ))
            ) : (
              <span className="block truncate leading-[1.35] text-text-secondary">{placeholder}</span>
            )
          ) : singleValue ? (
            <span className="block min-w-0 leading-[1.35]">
              <span className="block truncate text-[14px] font-medium text-text-primary">
                {singleValue.label}
              </span>
              {singleValue.sublabel ? (
                <span className="mt-0.5 block truncate text-[12px] text-text-secondary">
                  {singleValue.sublabel}
                </span>
              ) : null}
            </span>
          ) : (
            <span className="block truncate leading-[1.35] text-text-secondary">{placeholder}</span>
          )}
        </div>
        <ChevronIcon
          open={open}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </button>

      {open ? (
        <div
          className={clsx(
            "absolute left-0 right-0 z-20 rounded-[20px] border border-border-soft bg-bg-surface p-3 shadow-[var(--shadow-card)]",
            positionAbove ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          <div className="space-y-3">
            <div className="relative">
              <SearchIcon
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={searchPlaceholder}
                className={clsx(formFieldClassName, "bg-bg-muted pl-11 pr-4")}
              />
            </div>

            <div className="space-y-1 overflow-y-auto pr-1" style={{ maxHeight: dropdownMaxHeight }}>
              {multiple && allOptionLabel ? (
                <DropdownOption
                  checked={isAllSelected}
                  label={allOptionLabel}
                  multiple={multiple}
                  onClick={toggleAll}
                />
              ) : null}

              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <DropdownOption
                    key={option.value}
                    checked={selectedValues.includes(option.value)}
                    label={option.label}
                    sublabel={option.sublabel}
                    multiple={multiple}
                    onClick={() => toggleValue(option.value)}
                  />
                ))
              ) : (
                <div className="rounded-xl px-3 py-4 text-[14px] text-text-secondary">
                  {emptyMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DropdownOption({
  checked,
  label,
  sublabel,
  multiple,
  onClick,
}: {
  checked: boolean;
  label: string;
  sublabel?: string;
  multiple: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex w-full items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition-colors",
        checked
          ? "border-border-brand bg-bg-brand-soft/45"
          : "border-transparent bg-transparent hover:border-border-soft hover:bg-bg-muted",
      )}
    >
      {multiple ? (
        <span
          className={clsx(
            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
            checked
              ? "border-border-brand bg-brand-primary text-text-inverse"
              : "border-border-strong bg-transparent text-transparent",
          )}
        >
          <CheckIcon />
        </span>
      ) : (
        <span
          className={clsx(
            "h-2.5 w-2.5 shrink-0 rounded-full transition-colors",
            checked ? "bg-brand-primary" : "bg-border-soft",
          )}
        />
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[14px] font-medium text-text-primary">{label}</span>
        {sublabel ? (
          <span className="mt-0.5 block truncate text-[12px] text-text-secondary">{sublabel}</span>
        ) : null}
      </span>
    </button>
  );
}

function SelectedTag({
  label,
  sublabel,
  onRemove,
}: {
  label: string;
  sublabel?: string;
  onRemove: (event: ReactKeyboardEvent<HTMLButtonElement> | ReactMouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-border-soft bg-bg-muted px-3 py-1.5">
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-medium text-text-primary">{label}</span>
        {sublabel ? (
          <span className="block truncate text-[11px] text-text-secondary">{sublabel}</span>
        ) : null}
      </span>
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="rounded-full p-1 text-text-secondary transition-colors hover:bg-bg-control hover:text-text-primary"
      >
        <CloseIcon />
      </button>
    </span>
  );
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={clsx(
        "h-4 w-4 shrink-0 text-text-secondary transition-transform",
        open && "rotate-180",
        className,
      )}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3 w-3">
      <path
        d="M3.5 8.25L6.5 11.25L12.5 5.25"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="h-3 w-3">
      <path
        d="M4 4L12 12M12 4L4 12"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
