"use client";

import { useMemo, useState } from "react";
import {
  filterCollectionByPlatformScope,
  usePlatformScope,
} from "@/stores/usePlatformScope";
import { initialCheckInRecords, type CheckInRecord } from "./data";
import { CheckInDetailModal } from "./organisms/checkInDetailModal";
import { CheckInListTable } from "./organisms/checkInListTable";
import { ScanQrModal } from "./organisms/scanQrModal";

export function CheckInsPage() {
  const { selectedBranchId, timelineScope } = usePlatformScope();
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const filteredRecords = useMemo(
    () =>
      filterCollectionByPlatformScope({
        items: initialCheckInRecords,
        selectedBranchId,
        timelineScope,
        getBranchName: (record) => record.branch,
        getDate: (record) => `${record.date} ${record.time}`,
      }),
    [selectedBranchId, timelineScope],
  );

  const selectedRecord =
    filteredRecords.find((record) => record.id === selectedRecordId) ?? null;

  const handleViewRecord = (record: CheckInRecord) => {
    setSelectedRecordId(record.id);
  };

  return (
    <>
      <CheckInListTable
        records={filteredRecords}
        onViewRecord={handleViewRecord}
        onScanQrCode={() => setIsScanModalOpen(true)}
      />

      {selectedRecord ? (
        <CheckInDetailModal
          record={selectedRecord}
          onClose={() => setSelectedRecordId(null)}
        />
      ) : null}

      {isScanModalOpen ? <ScanQrModal onClose={() => setIsScanModalOpen(false)} /> : null}
    </>
  );
}
