"use client";

import { useState } from "react";
import { Modal } from "@/components/ui";

type DeactivateBranchModalProps = {
  open: boolean;
  branchName: string;
  onClose: () => void;
  onConfirm: () => void;
};

const impactPoints = [
  "The branch is removed from active day-to-day operations and branch switching workflows.",
  "New bookings, plan assignments, and front desk escalations should stop routing to this location.",
  "Staff coverage and launch tasks need reassignment before the branch can safely reopen.",
];

export function DeactivateBranchModal({
  open,
  branchName,
  onClose,
  onConfirm,
}: DeactivateBranchModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handleConfirm = () => {
    setConfirmed(false);
    onConfirm();
  };

  return (
    <Modal
      open={open}
      title={`Deactivate ${branchName}?`}
      description="Use this when the branch should stop appearing as a live operational location but still remain in your internal records."
      onClose={handleClose}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-border-soft px-4 text-[14px] font-semibold text-text-primary transition-colors hover:border-border-strong"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!confirmed}
            onClick={handleConfirm}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-[#b42318] px-4 text-[14px] font-semibold text-text-inverse transition-colors hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Deactivate branch
          </button>
        </div>
      }
    >
      <div className="rounded-[20px] border border-[#fecdca] bg-bg-danger-soft px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-[#f04438]" />
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
          I understand that deactivating {branchName} removes it from active operations until it is
          explicitly re-enabled.
        </span>
      </label>
    </Modal>
  );
}
