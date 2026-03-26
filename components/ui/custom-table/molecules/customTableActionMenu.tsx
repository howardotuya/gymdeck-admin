"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MoreVerticalIcon } from "@/components/icons";
import type { CustomTableAction } from "../types";

type CustomTableActionMenuProps<T> = {
  row: T;
  rowLabel?: string;
  actions: CustomTableAction<T>[];
  placement?: "top" | "bottom";
};

export function CustomTableActionMenu<T>({
  row,
  rowLabel = "row",
  actions,
  placement = "bottom",
}: CustomTableActionMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const visibleActions = actions.filter((action) =>
    action.hidden ? !action.hidden(row) : true,
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateMenuPosition = () => {
      const container = containerRef.current;

      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const menuWidth = 224;
      const viewportPadding = 16;
      const left = Math.min(
        Math.max(rect.right - menuWidth, viewportPadding),
        window.innerWidth - menuWidth - viewportPadding,
      );
      const top =
        placement === "top" ? rect.top - 8 : rect.bottom + 8;

      setMenuPosition({
        top,
        left,
      });
    };

    updateMenuPosition();

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      const clickedTrigger = containerRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", updateMenuPosition);
    window.addEventListener("scroll", updateMenuPosition, true);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updateMenuPosition);
      window.removeEventListener("scroll", updateMenuPosition, true);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, placement]);

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

      {isOpen && menuPosition
        ? createPortal(
            <div
              id={menuId}
              ref={menuRef}
              role="menu"
              aria-label={`Actions for ${rowLabel}`}
              className="fixed z-[100] min-w-[176px] w-max max-w-[min(calc(100vw-2rem),24rem)] rounded-[16px] border border-border-soft bg-bg-surface p-2 shadow-[var(--shadow-control)]"
              style={{
                left: menuPosition.left,
                top: menuPosition.top,
                transform: placement === "top" ? "translateY(-100%)" : undefined,
              }}
            >
              {visibleActions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  role="menuitem"
                  className={`block w-full whitespace-nowrap rounded-full px-3 py-2.5 text-left text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30 hover:bg-bg-action-soft ${
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
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
