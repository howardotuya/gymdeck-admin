"use client";

import Image from "next/image";
import { useState } from "react";
import { CircleLineIcon, MapPinFillIcon, SelectBoxCircleFillIcon } from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import type { RenewMembershipModalPayload } from "@/stores/useModalStore";

type RenewMembershipModalProps = {
  payload: RenewMembershipModalPayload;
  onClose: () => void;
};

type FlexibleSessionOption = {
  id: string;
  label: string;
  priceLabel: string;
  sessionDetails: string;
  perSessionLabel?: string;
  validityLabel: string;
};

const FLEXIBLE_SESSION_OPTIONS: FlexibleSessionOption[] = [
  {
    id: "session-pack-a",
    label: "6-Session Pack",
    priceLabel: "NGN 30,000",
    sessionDetails: "6 individual gym sessions",
    perSessionLabel: "NGN 10,000 per session",
    validityLabel: "Valid for 3 months",
  },
  {
    id: "session-pack-b",
    label: "6-Session Pack",
    priceLabel: "NGN 30,000",
    sessionDetails: "6 individual gym sessions",
    perSessionLabel: "NGN 10,000 per session",
    validityLabel: "Valid for 3 months",
  },
  {
    id: "single-session-pass",
    label: "Single Session Pass",
    priceLabel: "NGN 12,000",
    sessionDetails: "6 individual gym sessions",
    validityLabel: "Valid for 1 month",
  },
];

export function RenewMembershipModal({
  onClose,
  payload,
}: RenewMembershipModalProps) {
  const [view, setView] = useState<"renew" | "flexibleSessions">("renew");
  const [selectedOptionId, setSelectedOptionId] = useState(
    FLEXIBLE_SESSION_OPTIONS[0]?.id ?? "",
  );

  const handlePayNow = () => {
    // Placeholder flow: payment wiring will be added with gateway integration.
    onClose();
  };

  const handleBuySession = () => {
    // Placeholder flow: session-pack purchase wiring will be added with payment integration.
    onClose();
  };

  const handleChooseFlexibleSessions = () => {
    setView("flexibleSessions");
  };

  const bodyClassName =
    view === "renew" ? "mt-8 space-y-8" : "mt-6 space-y-8 md:mt-8";

  return (
    <Modal
      title={view === "renew" ? "Renew Membership" : "Choose Flexible Sessions"}
      onClose={onClose}
      panelClassName="max-w-[358px] !p-6 md:max-w-[579px] md:!p-8"
      bodyClassName={bodyClassName}
    >
      {view === "renew" ? (
        <>
          <section className="relative h-[189px] overflow-hidden rounded-[16px]">
            <Image
              src={payload.imageSrc}
              alt={`${payload.membershipTitle} cover`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 515px"
            />
            <div className="absolute inset-0 bg-bg-overlay-soft" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay-deep to-bg-overlay-tint" />

            <div className="absolute left-6 top-[33px] w-[205px] space-y-[29px] text-text-inverse">
              <div className="space-y-2">
                <h3 className="text-[20px] leading-[1.4] font-semibold">
                  {payload.membershipTitle}
                </h3>
                <p className="inline-flex items-center gap-2 text-[14px] leading-normal font-medium">
                  <MapPinFillIcon className="size-5 text-text-inverse" />
                  {payload.gymName}
                </p>
              </div>

              <p className="inline-flex items-center gap-2">
                <span className="text-[32px] leading-none font-semibold tracking-[-0.04em]">
                  {payload.renewalPriceLabel}
                </span>
                <span className="text-[14px] leading-normal font-medium">
                  {payload.renewalPriceSuffix}
                </span>
              </p>
            </div>
          </section>

          <dl className="space-y-5">
            <div className="flex items-center justify-between gap-6">
              <dt className="text-[16px] leading-[1.4] text-text-secondary">
                Current expiry
              </dt>
              <dd className="text-right text-[16px] leading-[1.4] font-medium text-text-emphasis">
                {payload.currentExpiry}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-6">
              <dt className="text-[16px] leading-[1.4] text-text-secondary">
                New expiry
              </dt>
              <dd className="text-right text-[16px] leading-[1.4] font-medium text-text-emphasis">
                {payload.newExpiry}
              </dd>
            </div>
          </dl>

          <div className="space-y-3">
            <button
              type="button"
              data-autofocus="true"
              onClick={handlePayNow}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Pay Now
            </button>

            <button
              type="button"
              onClick={handleChooseFlexibleSessions}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Or choose flexible sessions
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-[24px] border-2 border-border-plan-shell bg-bg-surface p-1">
            <div
              role="radiogroup"
              aria-label="Flexible session packs"
              className="space-y-1 rounded-[20px]"
            >
              {FLEXIBLE_SESSION_OPTIONS.map((option) => {
                const isSelected = option.id === selectedOptionId;

                return (
                  <button
                    key={option.id}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`w-full rounded-[16px] p-1 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30 ${
                      isSelected
                        ? "border border-border-brand-soft bg-bg-brand-soft"
                        : "bg-bg-muted hover:bg-bg-action-soft"
                    }`}
                  >
                    <div className="flex items-start gap-3 p-3 md:px-5 md:py-4">
                      {isSelected ? (
                        <SelectBoxCircleFillIcon className="size-6 shrink-0 text-text-brand" />
                      ) : (
                        <CircleLineIcon className="size-6 shrink-0 text-border-divider" />
                      )}
                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="space-y-[10px]">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-[14px] leading-normal font-medium tracking-[-0.02em] text-text-pricing md:text-[16px]">
                              {option.label}
                            </p>
                            <p className="text-[14px] leading-normal font-semibold tracking-[-0.02em] text-text-pricing md:text-[16px]">
                              {option.priceLabel}
                            </p>
                          </div>
                          <div className="flex items-start justify-between gap-4 text-[14px] leading-normal tracking-[-0.02em] text-text-secondary">
                            <p>{option.sessionDetails}</p>
                            {option.perSessionLabel ? (
                              <p className="hidden whitespace-nowrap md:block">
                                {option.perSessionLabel}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-[12px] leading-normal tracking-[-0.24px] text-text-secondary md:text-[14px] md:tracking-[-0.02em]">
                          {option.validityLabel}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              data-autofocus="true"
              onClick={handleBuySession}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Buy Session
            </button>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
