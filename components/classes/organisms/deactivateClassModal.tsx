"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { DeactivateClassModalPayload } from "@/stores/useModalStore";

type DeactivateClassModalProps = {
  payload: DeactivateClassModalPayload;
  onClose: () => void;
};

export function DeactivateClassModal({
  payload,
  onClose,
}: DeactivateClassModalProps) {
  const { classItem, onConfirm } = payload;
  const [confirmed, setConfirmed] = useState(false);
  const bookedSeatCount =
    Number.parseInt(classItem?.bookedSeats ?? "0", 10) || 0;

  const impactPoints = useMemo(() => {
    const activeBookingsLabel =
      bookedSeatCount > 0
        ? `${bookedSeatCount.toLocaleString()} current booking${
            bookedSeatCount === 1 ? "" : "s"
          } stay on their existing sessions until check-in, cancellation, or manual reassignment.`
        : "No active bookings are attached, so the class can be retired cleanly.";

    return [
      "New bookings and manual class assignments stop immediately after deactivation.",
      activeBookingsLabel,
      "Historical attendance and session reporting stay intact. If the class format needs to change, launch a new class instead of overwriting the legacy one.",
    ];
  }, [bookedSeatCount]);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    setConfirmed(false);
    onConfirm();
    onClose();
  };

  return (
    <Modal
      title={`Deactivate ${classItem?.name ?? "class"}?`}
      onClose={handleClose}
      bodyClassName="mt-6 space-y-5"
    >
      <div className="rounded-[20px] border border-[#fecdca] bg-bg-danger-soft px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full shrink-0 bg-[#f04438]" />
              <p className="text-[14px] leading-[1.65] text-text-secondary">
                {point}
              </p>
            </div>
          ))}
        </div>
      </div>

      <label className="mt-5 flex items-start gap-3 rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(event) => setConfirmed(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border border-border-strong"
        />
        <span className="text-[14px] leading-[1.65] text-text-secondary">
          I understand that deactivating {classItem?.name ?? "this class"}{" "}
          blocks new bookings and new assignments, but does not remove the class
          from members who are already attached to it.
        </span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-border-soft pt-5 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong"
        >
          Cancel
        </button>
        <button
          type="button"
          data-autofocus="true"
          disabled={!confirmed}
          onClick={handleConfirm}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#b42318] px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Deactivate class
        </button>
      </div>
    </Modal>
  );
}
