"use client";

import Image from "next/image";
import { MapPin2LineIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import { useModalStore } from "@/stores/useModalStore";
import type { JoinClassModalPayload } from "@/stores/useModalStore";

type JoinClassModalProps = {
  payload: JoinClassModalPayload;
  onClose: () => void;
};

export function JoinClassModal({ onClose, payload }: JoinClassModalProps) {
  const openModal = useModalStore((state) => state.openModal);

  const handleBookNow = () => {
    openModal("bookingPass", {
      bookingId: `class-${payload.sessionId}`,
      gymName: payload.location,
    });
    onClose();
  };

  return (
    <Modal
      title="Join Class"
      onClose={onClose}
      panelClassName="max-w-[358px] !p-6 md:max-w-[671px] md:!p-8"
      bodyClassName="mt-6 space-y-6 md:mt-8"
    >
      <section className="relative h-[293px] overflow-hidden  rounded-2xl">
        <Image
          src="/assets/temp-gym-classes.jpg"
          alt={`${payload.classTitle} class`}
          fill
          className="object-cover"
        />
        {/* Subtle 20% dark tint across the whole image — no blur here */}
        <div className="absolute inset-0 bg-black/20" />

        <div className="absolute rounded-2xl inset-x-0 bottom-0 h-[64%] mask-[linear-gradient(to_top,black_0%,transparent_100%)] backdrop-blur-[21px]" />

        <div className="absolute inset-x-0 bottom-0 h-[64%] bg-linear-to-t from-black/64 to-transparent" />

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
        onClick={handleBookNow}
        className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
      >
        Book now
      </button>
    </Modal>
  );
}
