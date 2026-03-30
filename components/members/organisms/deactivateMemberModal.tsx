"use client";

import { useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { MemberRow } from "../data";

type DeactivateMemberModalProps = {
  member: MemberRow;
  onClose: () => void;
  onConfirm: () => void;
};

const impactPoints = [
  "The member moves out of active roster and renewal follow-up workflows.",
  "Front desk staff should stop check-ins and new bookings until the member is reactivated.",
  "Payment history, visit history, and profile records remain available for internal review.",
];

export function DeactivateMemberModal({
  member,
  onClose,
  onConfirm,
}: DeactivateMemberModalProps) {
  const [confirmed, setConfirmed] = useState(false);

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
      title={`Deactivate ${member.name}?`}
      onClose={handleClose}
      bodyClassName="mt-6 space-y-5"
    >
      <p className="text-[14px] leading-[1.65] text-text-secondary">
        Use this when a member should stop appearing in active operations while
        still remaining available in your history and reporting records.
      </p>

      <div className="ui-danger-panel rounded-[20px] border px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="ui-danger-dot mt-1 inline-flex h-2 w-2 rounded-full" />
              <p className="text-[14px] leading-[1.65] text-text-secondary">{point}</p>
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
          I understand that deactivating {member.name} removes the member from
          active workflows until the account is manually restored.
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
          className="ui-danger-button inline-flex h-11 items-center justify-center rounded-xl px-4 text-[14px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          Deactivate member
        </button>
      </div>
    </Modal>
  );
}
