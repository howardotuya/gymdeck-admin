"use client";

import { useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { DeactivateBranchModalPayload } from "@/stores/useModalStore";

type DeactivateBranchModalProps = {
  payload: DeactivateBranchModalPayload;
  onClose: () => void;
};

const impactPoints = [
  "The branch is removed from active day-to-day operations and branch switching workflows.",
  "New bookings, plan assignments, and front desk escalations should stop routing to this location.",
  "Staff coverage and launch tasks need reassignment before the branch can safely reopen.",
];

export function DeactivateBranchModal({
  payload,
  onClose,
}: DeactivateBranchModalProps) {
  const { branchName, onConfirm } = payload;
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
      title={`Deactivate ${branchName}?`}
      onClose={handleClose}
      bodyClassName="mt-6 space-y-5"
    >
      <div className="ui-danger-panel rounded-[20px] border px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="ui-danger-dot mt-1 inline-flex h-2 w-2 rounded-full" />
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
          I understand that deactivating {branchName} removes it from active
          operations until it is explicitly re-enabled.
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
          Deactivate branch
        </button>
      </div>
    </Modal>
  );
}
