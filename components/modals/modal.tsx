"use client";

import clsx from "clsx";
import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef } from "react";
import { CloseFillIcon } from "@/components/icons";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );
}

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  bodyClassName?: string;
  overlayClassName?: string;
  panelClassName?: string;
  panelOverlay?: ReactNode;
  titleClassName?: string;
  closeButtonAriaLabel?: string;
};

export function Modal({
  bodyClassName,
  children,
  closeButtonAriaLabel = "Close modal",
  overlayClassName,
  onClose,
  panelClassName,
  panelOverlay,
  title,
  titleClassName,
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const panel = panelRef.current;
    if (!panel) {
      return;
    }

    const focusableElements = getFocusableElements(panel);
    const autofocusTarget = focusableElements.find((element) => element.dataset.autofocus === "true");
    const initialFocus = autofocusTarget ?? focusableElements[0] ?? panel;

    const rafId = window.requestAnimationFrame(() => {
      initialFocus.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      previousFocusedElementRef.current?.focus();
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = getFocusableElements(event.currentTarget);
    if (focusableElements.length === 0) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault();
      lastFocusable.focus();
    } else if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault();
      firstFocusable.focus();
    }
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 flex items-center justify-center bg-bg-overlay-medium px-4 py-8",
        overlayClassName,
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={clsx(
          "relative w-full max-w-[573px] max-h-[calc(100dvh-2rem)] overflow-auto rounded-[24px] bg-bg-surface p-8 shadow-[0_24px_48px_var(--shadow-modal)]",
          panelClassName,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id={titleId}
            className={clsx(
              "text-[20px] leading-[1.4] font-semibold text-text-primary md:text-[24px]",
              titleClassName,
            )}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeButtonAriaLabel}
            className="inline-flex size-9 items-center justify-center rounded-full bg-bg-action-soft text-text-support transition-colors hover:bg-bg-action-soft-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
          >
            <CloseFillIcon className="size-5" />
          </button>
        </div>

        <div className={clsx("mt-10", bodyClassName)}>{children}</div>

        {panelOverlay}
      </div>
    </div>
  );
}
