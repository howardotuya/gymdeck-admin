"use client";

import Image from "next/image";
import { type KeyboardEvent, useEffect, useRef } from "react";
import type { GalleryTile } from "@/components/gallery/types";
import { ArrowLeftSLineIcon, CloseFillIcon } from "@/components/icons";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") && !element.getAttribute("aria-hidden"),
  );
}

type GalleryLightboxProps = {
  media: GalleryTile;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

export function GalleryLightbox({
  currentIndex,
  media,
  onClose,
  onNext,
  onPrevious,
  totalCount,
}: GalleryLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    previousFocusedElementRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const rafId = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      document.body.style.overflow = previousOverflow;
      previousFocusedElementRef.current?.focus();
    };
  }, []);

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onPrevious();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      onNext();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const dialogElement = dialogRef.current;
    if (!dialogElement) {
      return;
    }

    const focusableElements = getFocusableElements(dialogElement);
    if (focusableElements.length === 0) {
      event.preventDefault();
      dialogElement.focus();
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
    <div className="fixed inset-0 z-[110]">
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-bg-overlay-backdrop"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Selected gallery media"
        tabIndex={-1}
        onKeyDown={handleDialogKeyDown}
        className="relative h-full w-full focus:outline-none"
      >
        <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="pointer-events-auto inline-flex items-center gap-3 text-[14px] leading-[1.4] text-text-inverse-soft transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse/40"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-text-inverse/12">
              <CloseFillIcon className="size-5 text-text-inverse-soft" />
            </span>
            Close
          </button>
        </div>

        <div className="absolute left-1/2 top-[120px] h-[min(487px,calc(100dvh-300px))] w-[min(342px,calc(100vw-48px))] -translate-x-1/2 overflow-hidden rounded-[20px] lg:hidden">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority
            sizes="(min-width: 1024px) 553px, 342px"
            className="object-cover grayscale"
          />
        </div>

        <div className="absolute bottom-16 left-6 right-6 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={onPrevious}
            aria-label="Previous media"
            className="inline-flex size-11 items-center justify-center rounded-full border border-text-inverse/15 bg-text-inverse/12 text-text-inverse transition-colors hover:bg-text-inverse/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse/40"
          >
            <ArrowLeftSLineIcon className="size-5 rotate-180" />
          </button>

          <p className="text-center text-[16px] leading-[1.4] text-text-inverse-soft">
            {currentIndex}/{totalCount}
          </p>

          <button
            type="button"
            onClick={onNext}
            aria-label="Next media"
            className="inline-flex size-11 items-center justify-center rounded-full border border-text-inverse/15 bg-text-inverse/12 text-text-inverse transition-colors hover:bg-text-inverse/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse/40"
          >
            <ArrowLeftSLineIcon className="size-5" />
          </button>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden h-[min(711px,calc(100dvh-240px))] w-[min(553px,calc(100vw-96px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[20px] lg:block">
          <Image
            src={media.src}
            alt={media.alt}
            fill
            priority
            sizes="(min-width: 1024px) 553px, 342px"
            className="object-cover grayscale"
          />
        </div>

        <button
          type="button"
          onClick={onPrevious}
          aria-label="Previous media"
          className="absolute left-6 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-text-inverse/15 bg-text-inverse/12 text-text-inverse transition-colors hover:bg-text-inverse/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse/40 lg:inline-flex"
        >
          <ArrowLeftSLineIcon className="size-5 rotate-180" />
        </button>

        <button
          type="button"
          onClick={onNext}
          aria-label="Next media"
          className="absolute right-6 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-text-inverse/15 bg-text-inverse/12 text-text-inverse transition-colors hover:bg-text-inverse/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-inverse/40 lg:inline-flex"
        >
          <ArrowLeftSLineIcon className="size-5" />
        </button>

        <p className="pointer-events-none absolute inset-x-0 bottom-16 hidden text-center text-[16px] leading-[1.4] text-text-inverse-soft lg:block">
          {currentIndex}/{totalCount}
        </p>
      </div>
    </div>
  );
}
