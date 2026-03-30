"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/modals/modal";
import type { DeactivatePlanModalPayload } from "@/stores/useModalStore";
import { extractLeadingNumber } from "../data";

type DeactivatePlanModalProps = {
  payload: DeactivatePlanModalPayload;
  onClose: () => void;
};

export function DeactivatePlanModal({
  payload,
  onClose,
}: DeactivatePlanModalProps) {
  const { onConfirm, plan } = payload;
  const [confirmed, setConfirmed] = useState(false);
  const subscriberCount = plan ? extractLeadingNumber(plan.subscribers) : 0;

  const impactPoints = useMemo(() => {
    const activeSubscribersLabel =
      subscriberCount > 0
        ? `${subscriberCount.toLocaleString()} current member${
            subscriberCount === 1 ? "" : "s"
          } keep their existing terms until expiry, cancellation, or manual migration.`
        : "No active members are attached, so the plan can be retired cleanly.";

    return [
      "New purchases and manual plan assignments stop immediately after deactivation.",
      activeSubscribersLabel,
      "Historical reporting and payment records stay intact. If pricing needs to change, launch a new plan instead of overwriting the legacy one.",
    ];
  }, [subscriberCount]);

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
      title={`Deactivate ${plan?.name ?? "plan"}?`}
      onClose={handleClose}
      bodyClassName="mt-6 space-y-5"
    >
      <p className="text-[14px] leading-[1.65] text-text-secondary">
        Use this when a plan should stop being sold or assigned to new members,
        while remaining available in historical records and on current member
        accounts.
      </p>

      <div className="ui-danger-panel rounded-[20px] border px-4 py-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-text-danger">
          Impact review
        </p>
        <div className="mt-3 space-y-3">
          {impactPoints.map((point) => (
            <div key={point} className="flex gap-3">
              <span className="ui-danger-dot mt-1 shrink-0 inline-flex h-2 w-2 rounded-full" />
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
          I understand that deactivating {plan?.name ?? "this plan"} blocks new
          sales and new assignments, but does not remove the plan from members
          who are already attached to it.
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
          Deactivate plan
        </button>
      </div>
    </Modal>
  );
}
