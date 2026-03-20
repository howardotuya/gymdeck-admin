"use client";

import Image from "next/image";
import { MapPin2LineIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { ClassBookingConfirmedModalPayload } from "@/stores/useModalStore";

type ClassBookingConfirmedModalProps = {
  payload: ClassBookingConfirmedModalPayload;
  onClose: () => void;
};

export function ClassBookingConfirmedModal({
  onClose,
  payload,
}: ClassBookingConfirmedModalProps) {
  const handleReserveAnotherSpot = () => {
    onClose();
  };

  const handleManageReservation = () => {
    onClose();
  };

  return (
    <Modal
      title="Booking Confirmed!"
      onClose={onClose}
      panelClassName="max-w-[358px] !p-6 md:max-w-[671px] md:!p-8"
      bodyClassName="mt-6 space-y-6 md:mt-8 md:space-y-8"
    >
      <section className="relative h-[293px] overflow-hidden rounded-[16px]">
        <Image
          src="/assets/temp-gym-classes.jpg"
          alt={`${payload.classTitle} class`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-bg-overlay-soft" />

        <div className="absolute inset-x-0 bottom-0 h-[72%] rounded-[16px] mask-[linear-gradient(to_top,black_0%,transparent_100%)] backdrop-blur-[11.05px]" />

        <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay-deep to-bg-overlay-clear" />

        <div className="absolute right-[15px] top-6 rounded-full bg-bg-surface/95 px-2 py-1 backdrop-blur-[7.8px] md:hidden">
          <span className="text-[12px] leading-[1.4] font-bold text-text-brand">
            {payload.pricePerSeatLabel}
          </span>
        </div>

        <div className="absolute bottom-[19px] left-4 w-[263px] space-y-5 text-text-inverse md:inset-x-6 md:bottom-6 md:w-auto">
          <div className="space-y-2">
            <h3 className="text-[20px] leading-[1.4] font-semibold md:text-[24px]">
              {payload.classTitle}
            </h3>
            <p className="text-[14px] leading-[1.4] md:text-[16px]">{payload.schedule}</p>
          </div>

          <p className="inline-flex items-center gap-1 text-[14px] leading-[1.4]">
            <MapPin2LineIcon className="size-[18px] text-text-inverse" />
            <span>Location: {payload.location}</span>
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-[18px] leading-[1.4] font-semibold text-text-primary">
          About Class
        </h3>
        <p className="text-[14px] leading-[1.5] text-text-support md:text-[16px]">
          {payload.about}
        </p>
      </section>

      <div className="h-px bg-border-soft" />

      <div className="space-y-3">
        <button
          type="button"
          data-autofocus="true"
          onClick={handleReserveAnotherSpot}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Reserve Another Spot
        </button>
        <button
          type="button"
          onClick={handleManageReservation}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Manage Reservation
        </button>
      </div>
    </Modal>
  );
}
