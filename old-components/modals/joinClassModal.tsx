"use client";

import clsx from "clsx";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CloseFillIcon, MapPin2LineIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import { useModalStore } from "@/stores/useModalStore";
import type { JoinClassModalPayload } from "@/stores/useModalStore";

type JoinClassModalProps = {
  payload: JoinClassModalPayload;
  onClose: () => void;
};

export function JoinClassModal({ onClose, payload }: JoinClassModalProps) {
  const [isReserveDrawerOpen, setIsReserveDrawerOpen] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const openModal = useModalStore((state) => state.openModal);

  const reservationRows = [
    { label: "Gym", value: payload.location },
    { label: "Date", value: payload.reservationDate },
    { label: "Time", value: payload.reservationTime },
    { label: "Booking Type", value: payload.bookingType },
  ];

  useEffect(() => {
    if (!isReserveDrawerOpen) {
      return;
    }

    const rafId = window.requestAnimationFrame(() => {
      const confirmButton = confirmButtonRef.current;
      if (!confirmButton) {
        return;
      }

      try {
        confirmButton.focus({ preventScroll: true });
      } catch {
        confirmButton.focus();
      }
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isReserveDrawerOpen]);

  const handleConfirmBooking = () => {
    openModal("classBookingConfirmed", {
      classTitle: payload.classTitle,
      schedule: payload.schedule,
      location: payload.location,
      about: payload.about,
      pricePerSeatLabel: payload.pricePerSeatLabel,
    });
    onClose();
  };

  return (
    <Modal
      title="Join Class"
      onClose={onClose}
      panelClassName="relative max-w-[358px] !p-6 md:max-w-[671px] md:!p-8"
      bodyClassName="mt-6 md:mt-8"
      panelOverlay={
        <>
          <button
            type="button"
            aria-label="Close reserve drawer"
            tabIndex={isReserveDrawerOpen ? 0 : -1}
            onClick={() => {
              setIsReserveDrawerOpen(false);
            }}
            className={clsx(
              "absolute inset-0 z-10 transition-opacity duration-250 ease-out",
              isReserveDrawerOpen
                ? "bg-bg-overlay-soft opacity-100"
                : "pointer-events-none bg-bg-overlay-clear opacity-0",
            )}
          />

          <section
            aria-hidden={!isReserveDrawerOpen}
            className={clsx(
              "absolute inset-x-0 bottom-0 z-20 rounded-t-[24px] bg-bg-surface px-6 pb-8 pt-8 shadow-[0_-8px_24px_var(--shadow-modal-drawer)] transform-gpu transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:px-8",
              isReserveDrawerOpen
                ? "translate-y-0"
                : "pointer-events-none translate-y-[105%]",
            )}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-[20px] leading-[1.4] font-semibold text-text-primary">
                  Reserve Your Spot
                </h3>
                <button
                  type="button"
                  aria-label="Close reserve drawer"
                  tabIndex={isReserveDrawerOpen ? 0 : -1}
                  onClick={() => {
                    setIsReserveDrawerOpen(false);
                  }}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-bg-action-soft text-text-support transition-colors hover:bg-bg-action-soft-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
                >
                  <CloseFillIcon className="size-5" />
                </button>
              </div>

              <dl className="space-y-4">
                {reservationRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-6">
                    <dt className="text-[16px] leading-[1.4] text-text-secondary">{row.label}</dt>
                    <dd className="text-right text-[16px] leading-[1.4] font-medium text-text-primary">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="h-px bg-border-soft" />

              <div className="space-y-4">
                <button
                  ref={confirmButtonRef}
                  type="button"
                  tabIndex={isReserveDrawerOpen ? 0 : -1}
                  onClick={handleConfirmBooking}
                  className="inline-flex h-[51px] w-full items-center justify-between rounded-full bg-brand-primary px-4 text-[14px] leading-normal text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
                >
                  <span className="font-medium">Confirm</span>
                  <span className="font-bold">{payload.confirmAmountLabel}</span>
                </button>

                <p className="text-center text-[14px] leading-[1.5] text-text-support">
                  {payload.cancellationPolicyBlurb}
                </p>
              </div>
            </div>
          </section>
        </>
      }
    >
      <div className="space-y-6 md:space-y-8">
        <section className="relative h-[293px] overflow-hidden rounded-2xl">
          <Image
            src="/assets/temp-gym-classes.jpg"
            alt={`${payload.classTitle} class`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-bg-overlay-soft" />

          <div className="absolute inset-x-0 bottom-0 h-[64%] rounded-2xl mask-[linear-gradient(to_top,black_0%,transparent_100%)] backdrop-blur-[21px]" />

          <div className="absolute inset-x-0 bottom-0 h-[64%] bg-linear-to-t from-bg-overlay-deep to-bg-overlay-clear" />

          <div className="absolute right-4 top-6 inline-flex items-center justify-center rounded-full bg-bg-surface/95 px-2 py-1 backdrop-blur-[7.8px] md:right-6">
            <span className="text-[12px] leading-[1.4] font-bold text-text-brand">
              {payload.pricePerSeatLabel}
            </span>
          </div>

          <div className="absolute inset-x-4 bottom-5 space-y-5 text-text-inverse md:inset-x-6 md:bottom-6">
            <div className="space-y-2">
              <h3 className="text-[20px] leading-[1.4] font-semibold md:text-[24px]">
                {payload.classTitle}
              </h3>
              <p className="text-[14px] leading-[1.4] md:text-[16px]">
                {payload.schedule}
              </p>
            </div>
            <p className="inline-flex items-center gap-1 text-[14px] leading-[1.4]">
              <MapPin2LineIcon className="size-[18px] text-text-inverse" />
              Location: {payload.location}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[18px] leading-[1.4] font-semibold text-text-primary">
            About Class
          </h3>
          <p className="text-[14px] leading-normal text-text-support md:text-[16px]">
            {payload.about}
          </p>
        </section>

        <div className="h-px bg-border-soft" />

        <button
          type="button"
          data-autofocus="true"
          onClick={() => {
            setIsReserveDrawerOpen(true);
          }}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Book now
        </button>
      </div>
    </Modal>
  );
}
