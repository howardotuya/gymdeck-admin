"use client";

import { InformationLineIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { GymAccessRequiredModalPayload } from "@/stores/useModalStore";

type GymAccessRequiredModalProps = {
  payload: GymAccessRequiredModalPayload;
  onClose: () => void;
};

export function GymAccessRequiredModal({ onClose }: GymAccessRequiredModalProps) {
  return (
    <Modal
      title="Gym Access Required"
      onClose={onClose}
      panelClassName="max-w-[358px] !p-6 md:max-w-[495px] md:!p-8"
      bodyClassName="mt-8 space-y-8"
    >
      <section className="rounded-[16px] border border-[rgba(100,117,233,0.18)] bg-[rgba(100,117,233,0.06)] p-4">
        <div className="flex items-start gap-2">
          <InformationLineIcon className="mt-0.5 size-6 shrink-0 text-text-brand" />
          <p className="text-[14px] leading-[1.5] text-text-support">
            To reserve a spot in this class, you&apos;ll need to purchase gym access first. Your
            class reservation will be automatically included.
          </p>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          data-autofocus="true"
          onClick={onClose}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Get Gym Access
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Maybe Later
        </button>
      </div>
    </Modal>
  );
}
