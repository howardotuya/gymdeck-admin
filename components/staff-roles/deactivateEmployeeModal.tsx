"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { DeactivateEmployeeModalPayload } from "@/stores/useModalStore";

type DeactivateEmployeeModalProps = {
  payload: DeactivateEmployeeModalPayload;
  onClose: () => void;
};

export function DeactivateEmployeeModal({
  payload,
  onClose,
}: DeactivateEmployeeModalProps) {
  const { employee, onConfirm } = payload;
  const [confirmed, setConfirmed] = useState(false);

  const impactPoints = useMemo(
    () => [
      `${employee.name} is removed from active staff operations and day-to-day assignment workflows.`,
      `Front desk and team leads should stop scheduling ${employee.name} for new ${employee.team.toLowerCase()} tasks until the account is reactivated.`,
      "Profile history, branch association, and staff records remain available for reporting and internal review.",
    ],
    [employee],
  );

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
      title={`Deactivate ${employee.name}?`}
      onClose={handleClose}
      bodyClassName="mt-6 space-y-5"
    >
      <p className="text-[14px] leading-[1.65] text-text-secondary">
        Use this when an employee should stop appearing in active staff
        operations while remaining available in your records and reporting.
      </p>

      <div className="rounded-[20px] border border-[#fecdca] bg-bg-danger-soft px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-[#f04438]" />
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
          I understand that deactivating {employee.name} removes the employee
          from active staff workflows until the account is manually restored.
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
          Deactivate employee
        </button>
      </div>
    </Modal>
  );
}
