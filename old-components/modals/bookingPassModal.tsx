"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";
import { Modal } from "@/components/modals/modal";
import type { BookingPassModalPayload } from "@/stores/useModalStore";
import BOOKING_PASS_BACKGROUND_IMAGE from "@/public/assets/booking-pass-bg.jpg";

type BookingPassModalProps = {
  payload: BookingPassModalPayload;
  onClose: () => void;
};

type QRCodeStylingInstance = InstanceType<typeof QRCodeStyling>;

const QR_SIDE = 231;

const BASE_QR_OPTIONS: Omit<Options, "data" | "dotsOptions" | "backgroundOptions"> = {
  type: "canvas",
  width: QR_SIDE,
  height: QR_SIDE,
  margin: 12,
  qrOptions: {
    errorCorrectionLevel: "Q",
  },
};

function readCssColor(variableName: string, fallback: string) {
  const resolved = window.getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return resolved || fallback;
}

export function BookingPassModal({ onClose, payload }: BookingPassModalProps) {
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
        data: payload.bookingId,
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
  }, [payload.bookingId]);

  const handleDownloadPass = () => {
    if (!qrCodeRef.current) {
      return;
    }

    void qrCodeRef.current.download({
      extension: "png",
      name: `gym-access-pass-${payload.bookingId}`,
    });
  };

  const handleAddToCalendar = () => {
    // Placeholder: calendar integration will be wired once booking metadata is available.
  };

  return (
    <Modal
      title="You’re booked!"
      onClose={onClose}
      panelClassName="max-w-[495px] !p-6 md:!p-8"
      bodyClassName="mt-8 space-y-8"
    >
      <section className="rounded-[16px] bg-bg-muted p-5">
        <header className="space-y-2 text-center">
          <h3 className="text-[16px] leading-[1.4] font-semibold text-text-primary">
            Gym Access Pass
          </h3>
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Show QR code below at entry to access venue
          </p>
        </header>

        <div className="relative mt-4 h-[308px] overflow-hidden rounded-[16px]">
          <Image
            src={BOOKING_PASS_BACKGROUND_IMAGE}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute overflow-hidden rounded-[16px] left-0 top-px h-[307px] w-full bg-gradient-to-t from-bg-overlay-strong to-bg-overlay-clear backdrop-blur-[0.1105px]" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-[231px] overflow-hidden rounded-[16px] bg-bg-surface">
              <div
                ref={qrCodeContainerRef}
                className="size-full bg-bg-surface"
                aria-label={`QR code for booking ${payload.bookingId}`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          data-autofocus="true"
          onClick={handleDownloadPass}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-brand-primary px-[10px] text-[14px] leading-normal font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Download Pass
        </button>
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="inline-flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] text-[14px] leading-normal font-medium text-text-support transition-colors hover:bg-bg-action-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-brand/30"
        >
          Add to Calendar
        </button>
      </div>
    </Modal>
  );
}
