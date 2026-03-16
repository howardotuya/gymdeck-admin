"use client";

import { Modal } from "@/components/modals/modal";
import { useModalStore } from "@/stores/useModalStore";
import type { PlanConfirmationModalPayload } from "@/stores/useModalStore";

type PlanConfirmationModalProps = {
  payload: PlanConfirmationModalPayload;
  onClose: () => void;
};

type PlanReviewRow = {
  label: string;
  value: string;
};

export function PlanConfirmationModal({ onClose, payload }: PlanConfirmationModalProps) {
  const openModal = useModalStore((state) => state.openModal);

  const reviewRows: PlanReviewRow[] = [
    {
      label: "What’s Included",
      value: payload.reviewDetails.included,
    },
    {
      label: "Cancellation Policy",
      value: payload.reviewDetails.cancellationPolicy,
    },
    {
      label: "Refund Terms",
      value: payload.reviewDetails.refundTerms,
    },
    {
      label: "Session Validity Period",
      value: payload.reviewDetails.validityPeriod,
    },
  ];

  const handleContinueToPayment = () => {
    // Placeholder flow: this will route to Paystack once payment integration is added.
    openModal("bookingPass", {
      bookingId: "abc123xyz",
      gymName: payload.gymName,
    });
    onClose();
  };

  return (
    <Modal
      title="Review your plan"
      onClose={onClose}
      panelClassName="max-w-[495px] !p-6 md:!p-8"
      bodyClassName="mt-6 space-y-10"
    >
      <p className="w-full text-[14px] leading-normal font-medium text-text-support">
        <span>{`You selected: ${payload.planName} - `}</span>
        <span className="font-bold">{payload.planPriceLabel}</span>
      </p>

      <div className="space-y-5">
        <div className="space-y-10">
          <dl className="space-y-5 text-text-support">
            {reviewRows.map((row) => (
              <div key={row.label} className="space-y-2">
                <dt className="text-[14px] leading-normal font-semibold">{row.label}</dt>
                <dd className="text-[13px] leading-[1.5]">{row.value}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-3">
            <button
              type="button"
              data-autofocus="true"
              onClick={handleContinueToPayment}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Continue to Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-[#f2f4f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Go Back
            </button>
          </div>
        </div>

        <p className="w-full text-center text-[12px] leading-[1.45] text-text-secondary md:mx-auto md:max-w-[330px]">
          By proceeding, you agree to {payload.gymName}&apos;s Terms of Service
        </p>
      </div>
    </Modal>
  );
}
