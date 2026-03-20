"use client";

import clsx from "clsx";
import { useEffect, useId, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  panelClassName?: string;
};

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  panelClassName,
}: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-overlay px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={clsx(
          "w-full max-w-[560px] overflow-hidden rounded-[28px] border border-border-soft bg-bg-surface shadow-[var(--shadow-panel)]",
          panelClassName,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border-soft px-6 py-5">
          <div className="min-w-0">
            <h3 id={titleId} className="text-[22px] font-semibold tracking-[-0.04em] text-text-primary">
              {title}
            </h3>
            {description ? (
              <p className="mt-2 text-[14px] leading-[1.65] text-text-secondary">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-soft bg-bg-surface text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
          >
            <CloseIcon size={16} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? <div className="border-t border-border-soft px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
