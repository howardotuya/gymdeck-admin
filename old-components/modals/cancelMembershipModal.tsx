"use client";

import { useState } from "react";
import { FlashlightFillIcon, WalletFillIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { CancelMembershipModalPayload } from "@/stores/useModalStore";

type CancelMembershipModalProps = {
  payload: CancelMembershipModalPayload;
  onClose: () => void;
};

export function CancelMembershipModal({
  payload,
  onClose,
}: CancelMembershipModalProps) {
  const [feedback, setFeedback] = useState("");

  const handleKeepBooking = () => {
    onClose();
  };

  const handleConfirmCancellation = () => {
    onClose();
  };

  const handleRescheduleInstead = () => {
    onClose();
  };

  return (
    <Modal
      title="Cancel Membership?"
      onClose={onClose}
      overlayClassName="!items-start !py-[19px] md:!items-center md:!py-8"
      panelClassName="!max-h-[calc(100dvh-38px)] !max-w-full !p-6 md:!max-h-[80dvh] md:!max-w-[604px] md:!p-8"
      bodyClassName="mt-6"
      titleClassName="text-[20px] md:text-[24px]"
    >
      <p className="text-[14px] leading-normal text-text-support">
        You&apos;re still within the free cancellation window
      </p>

      <div className="mt-10 space-y-10">
        <section className="space-y-6">
          <div className="space-y-4">
            <div className="rounded-[16px] bg-bg-muted p-4">
              <p className="text-[14px] leading-[1.5] text-text-secondary">
                <span className="font-semibold">Cancellation Policy:</span>{" "}
                Cancellations made 4+ hours before your session are completely
                free. Your credit will be refunded immediately and available for
                rebooking.
              </p>
            </div>

            <div className="space-y-2 rounded-[16px] border border-border-brand-soft bg-bg-brand-soft p-4">
              <p className="inline-flex w-full items-center gap-2 text-[14px] leading-[1.5] text-text-support">
                <WalletFillIcon className="size-6 shrink-0 text-text-brand" />1
                credit will be refunded to your wallet
              </p>

              <p className="inline-flex w-full items-center gap-2 text-[14px] leading-[1.5] text-text-support">
                <FlashlightFillIcon className="size-6 shrink-0 text-text-brand" />
                Available for rebooking instantly
              </p>
            </div>
          </div>

          <div className="h-px bg-border-input" />

          <div className="space-y-2">
            <label
              htmlFor="cancel-membership-feedback"
              className="block text-[12px] leading-normal font-medium text-text-secondary"
            >
              Help us improve - why are you cancelling? (Optional)
            </label>
            <textarea
              id="cancel-membership-feedback"
              value={feedback}
              onChange={(event) => {
                setFeedback(event.target.value);
              }}
              placeholder="Any additional feedback?"
              className="h-[137px] w-full resize-none rounded-[16px] bg-bg-muted px-[10px] py-3 text-[12px] leading-[1.4] text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/35"
            />
          </div>
        </section>

        <div className="space-y-3">
          <button
            type="button"
            data-autofocus="true"
            onClick={handleKeepBooking}
            className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
          >
            Keep My Booking
          </button>

          <button
            type="button"
            onClick={handleConfirmCancellation}
            className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
          >
            Confirm Cancellation
          </button>

          <button
            type="button"
            onClick={handleRescheduleInstead}
            className="inline-flex h-[51px] w-full items-center justify-center rounded-full px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
          >
            Reschedule Instead
          </button>
        </div>
      </div>

      <p className="mt-5 text-center text-[12px] leading-[1.45] text-text-secondary md:mx-auto md:max-w-[330px]">
        By proceeding, you agree to {payload.gymName}&apos;s Terms of Service
      </p>
    </Modal>
  );
}
