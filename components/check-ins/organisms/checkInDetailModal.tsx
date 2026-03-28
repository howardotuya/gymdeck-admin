"use client";

import { Modal } from "@/components/modals/modal";
import { StatusBadge } from "@/components/ui";
import type { CheckInRecord } from "../data";

type CheckInDetailModalProps = {
  record: CheckInRecord;
  onClose: () => void;
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[14px] font-medium text-text-primary">{value}</p>
    </div>
  );
}

export function CheckInDetailModal({ record, onClose }: CheckInDetailModalProps) {
  return (
    <Modal
      title={record.member}
      onClose={onClose}
      panelClassName="max-w-[720px]"
      bodyClassName="mt-6 space-y-6"
    >
      <div className="flex flex-col gap-3 rounded-[20px] border border-border-soft bg-bg-muted px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[18px] font-semibold text-text-primary">{record.itemName}</p>
          <p className="mt-1 text-[14px] text-text-secondary">
            {record.typeLabel} at {record.branch}
          </p>
        </div>
        <StatusBadge label={record.status} tone={record.statusTone} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailItem label="Booking ID" value={record.id} />
        <DetailItem label="Member ID" value={record.memberId} />
        <DetailItem label="Date" value={`${record.date} ${record.time}`} />
        <DetailItem label="Status" value={record.status} />
        <DetailItem label="Payment status" value={record.paymentStatus} />
        <DetailItem label="QR state" value={record.qrState} />
        <DetailItem label="Email" value={record.memberEmail} />
        <DetailItem label="Phone" value={record.memberPhone} />
        <DetailItem label="Plan" value={record.accessPlan} />
        <DetailItem label="Operator note" value={record.operatorNote} />
      </div>
    </Modal>
  );
}
