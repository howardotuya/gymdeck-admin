"use client";

import { useState } from "react";
import { toast } from "sonner";
import { initialCheckInRecords, type CheckInRecord } from "./data";
import { CheckInDetailModal } from "./organisms/checkInDetailModal";
import { CheckInListTable } from "./organisms/checkInListTable";

export function CheckInsPage() {
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const selectedRecord =
    initialCheckInRecords.find((record) => record.id === selectedRecordId) ?? null;

  const handleViewRecord = (record: CheckInRecord) => {
    setSelectedRecordId(record.id);
  };

  const handleScanQrCode = () => {
    toast.success("QR scanning is staged for the next front desk flow iteration.");
  };

  return (
    <>
      <CheckInListTable
        records={initialCheckInRecords}
        onViewRecord={handleViewRecord}
        onScanQrCode={handleScanQrCode}
      />

      {selectedRecord ? (
        <CheckInDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecordId(null)}
        />
      ) : null}
    </>
  );
}
