"use client";

import { useEffect, useId, useRef, useState } from "react";
import { MoreVerticalIcon } from "@/components/icons";
import type { CustomTableAction } from "../types";

type CustomTableActionMenuProps<T> = {
  row: T;
  rowLabel?: string;
  actions: CustomTableAction<T>[];
};

export function CustomTableActionMenu<T>({
  row,
  rowLabel = "row",
  actions,
}: CustomTableActionMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleActions = actions.filter((action) =>
    action.hidden ? !action.hidden(row) : true,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (visibleActions.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-label={`Open actions for ${rowLabel}`}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
        className="inline-flex h-10 w-10 items-center justify-center text-text-support transition-[background-color,border-color,color,box-shadow] hover:border-border-strong hover:bg-bg-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        onClick={() => {
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        <span className="sr-only">{`Open actions for ${rowLabel}`}</span>
        <MoreVerticalIcon size={18} />
      </button>

      {isOpen ? (
        <div
          id={menuId}
          role="menu"
          aria-label={`Actions for ${rowLabel}`}
          className="absolute right-0 top-full z-10 w-[176px] rounded-[16px] border border-border-soft bg-bg-surface p-2 shadow-[var(--shadow-control)]"
        >
          {visibleActions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              className={`block w-full rounded-full px-3 py-2.5 text-left text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30 hover:bg-bg-action-soft ${
                action.tone === "danger"
                  ? "text-text-danger"
                  : "text-text-support hover:text-text-primary"
              }`}
              onClick={() => {
                action.onSelect?.(row);
                setIsOpen(false);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
