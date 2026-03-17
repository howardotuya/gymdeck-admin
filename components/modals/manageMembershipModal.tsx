"use client";

import clsx from "clsx";
import Image from "next/image";
import { useId, useState, useEffect, useRef } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";
import {
  ArrowDownSLineIcon,
  DownloadLineIcon,
  MapPin2LineIcon,
  PhoneLineIcon,
  StarFillIcon,
  TimeLineIcon,
} from "@/components/icons";
import { Modal } from "@/components/modals/modal";
import { useModalStore } from "@/stores/useModalStore";
import type { ManageMembershipModalPayload } from "@/stores/useModalStore";
import BOOKING_PASS_BACKGROUND_IMAGE from "@/public/assets/booking-pass-bg.jpg";

type ManageMembershipModalProps = {
  payload: ManageMembershipModalPayload;
  onClose: () => void;
};

type QRCodeStylingInstance = InstanceType<typeof QRCodeStyling>;

const QR_SIDE = 231;

const BASE_QR_OPTIONS: Omit<
  Options,
  "data" | "dotsOptions" | "backgroundOptions"
> = {
  type: "canvas",
  width: QR_SIDE,
  height: QR_SIDE,
  margin: 12,
  qrOptions: {
    errorCorrectionLevel: "Q",
  },
};

function readCssColor(variableName: string, fallback: string) {
  const resolved = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  return resolved || fallback;
}

export function ManageMembershipModal({
  onClose,
  payload,
}: ManageMembershipModalProps) {
  const openModal = useModalStore((state) => state.openModal);
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const policyButtonId = useId();
  const policyPanelId = useId();
  const qrCodeRef = useRef<QRCodeStylingInstance | null>(null);
  const qrCodeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    const qrContainer = qrCodeContainerRef.current;

    const initializeQrCode = async () => {
      const { default: QRCodeStyling } = await import("qr-code-styling");

      if (!isMounted || !qrContainer) {
        return;
      }

      const qrCode = new QRCodeStyling({
        ...BASE_QR_OPTIONS,
        data: payload.membershipId,
        dotsOptions: {
          color: readCssColor("--qr-dot-color", "black"),
          type: "square",
        },
        backgroundOptions: {
          color: readCssColor("--qr-background-color", "white"),
        },
      });

      qrCodeRef.current = qrCode;
      qrContainer.innerHTML = "";
      qrCode.append(qrContainer);
    };

    void initializeQrCode();

    return () => {
      isMounted = false;
      qrCodeRef.current = null;
      qrContainer?.replaceChildren();
    };
  }, [payload.membershipId]);

  const handleDownloadPass = () => {
    if (!qrCodeRef.current) {
      return;
    }

    void qrCodeRef.current.download({
      extension: "png",
      name: `gym-access-pass-${payload.membershipId}`,
    });
  };

  const handleCancelMembership = () => {
    openModal("cancelMembership", {
      gymName: payload.gymName,
    });
  };

  return (
    <Modal
      title={payload.gymName}
      onClose={onClose}
      overlayClassName="items-start py-[19px] md:items-center md:py-8"
      panelClassName="max-w-[358px] md:max-w-[579px] !p-6 md:!p-8 md:max-h-[80vh]"
      bodyClassName="mt-4 space-y-4 md:mt-8"
    >
      <section className="relative h-[189px] overflow-hidden rounded-[16px]">
        <Image
          src={payload.imageSrc}
          alt={`${payload.facilityName} cover`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 515px"
        />
        <div className="absolute inset-0 bg-bg-overlay-soft" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay-deep to-bg-overlay-tint" />

        <div className="absolute inset-x-6 bottom-5 space-y-1 text-text-inverse">
          <h3 className="text-[20px] leading-[1.4] font-semibold">
            {payload.facilityName}
          </h3>

          <div className="flex items-center gap-2 text-[14px] leading-[1.4]">
            <span className="inline-flex items-center gap-1">
              <MapPin2LineIcon className="size-4 text-text-inverse" />
              {payload.distanceLabel}
            </span>
            <span className="size-1 rounded-full bg-text-inverse-soft" />
            <span className="inline-flex items-center gap-1">
              <StarFillIcon className="size-4 text-text-rating-active" />
              {payload.ratingLabel}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] bg-bg-muted p-5">
        <div className="space-y-1">
          <div className="flex items-center rounded-[12px] bg-bg-surface px-3 py-4">
            <span className="inline-flex items-center gap-2 text-[14px] leading-[1.4] text-text-secondary">
              <TimeLineIcon className="size-4 text-text-secondary" />
              {payload.scheduleLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-[12px] bg-bg-surface px-3 py-4">
            <span className="inline-flex min-w-0 items-center gap-2 text-[14px] leading-[1.4] text-text-secondary">
              <MapPin2LineIcon className="size-4 shrink-0 text-text-secondary" />
              <span className="truncate">{payload.addressLabel}</span>
            </span>
            <a
              href={payload.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 text-[14px] leading-[1.4] font-medium text-text-brand transition-colors hover:text-brand-primary"
            >
              Get Directions
            </a>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-[12px] bg-bg-surface px-3 py-4">
            <span className="inline-flex items-center gap-2 text-[14px] leading-[1.4] text-text-secondary">
              <PhoneLineIcon className="size-4 text-text-secondary" />
              {payload.phoneLabel}
            </span>
            <a
              href={`tel:${payload.phoneNumber}`}
              className="shrink-0 text-[14px] leading-[1.4] font-medium text-text-brand transition-colors hover:text-brand-primary"
            >
              Call
            </a>
          </div>
        </div>
      </section>

      <section className="rounded-[16px] bg-bg-muted p-5">
        <header className="space-y-2 text-center">
          <h3 className="text-[16px] leading-[1.4] font-semibold text-text-primary">
            Your Check-in Pass
          </h3>
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Show this QR code at the venue
          </p>
        </header>

        <div className="relative mt-4 h-[308px] overflow-hidden rounded-[16px]">
          <Image
            src={BOOKING_PASS_BACKGROUND_IMAGE}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute left-0 top-px h-[307px] w-full bg-gradient-to-t from-bg-overlay-strong to-bg-overlay-clear" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[231px] overflow-hidden rounded-[16px] bg-bg-surface">
              <div
                ref={qrCodeContainerRef}
                className="size-full bg-bg-surface"
                aria-label={`QR code for membership ${payload.membershipId}`}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadPass}
          className="mt-4 inline-flex h-[49px] w-full items-center justify-center gap-2 rounded-full bg-bg-surface px-[10px] text-[14px] leading-normal font-medium text-text-emphasis transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          <DownloadLineIcon className="size-5" />
          Download
        </button>
      </section>

      <section className="rounded-[16px] bg-bg-muted">
        <h3>
          <button
            type="button"
            id={policyButtonId}
            aria-expanded={isPolicyExpanded}
            aria-controls={policyPanelId}
            onClick={() => {
              setIsPolicyExpanded((expanded) => !expanded);
            }}
            className="flex w-full items-center justify-between gap-4 px-4 py-[17px] text-left text-[14px] leading-[1.5] font-medium text-text-support"
          >
            <span>Cancellation Policy</span>
            <ArrowDownSLineIcon
              className={clsx(
                "size-6 shrink-0 transition-transform duration-200",
                isPolicyExpanded && "rotate-180",
              )}
            />
          </button>
        </h3>

        {isPolicyExpanded ? (
          <div
            id={policyPanelId}
            role="region"
            aria-labelledby={policyButtonId}
            className="border-t border-border-subtle px-4 pb-4 pt-3"
          >
            <p className="text-[13px] leading-[1.5] text-text-support">
              {payload.cancellationPolicy}
            </p>
          </div>
        ) : null}
      </section>

      <button
        type="button"
        onClick={handleCancelMembership}
        className="inline-flex h-[49px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
      >
        Cancel Membership
      </button>
    </Modal>
  );
}
