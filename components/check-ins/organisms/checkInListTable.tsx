"use client";

import { useMemo } from "react";
import {
  CustomTable,
  StatusBadge,
  type CustomTableAction,
  type CustomTableColumn,
  type CustomTableFilterField,
} from "@/components/ui";
import type { CheckInRecord } from "../data";
import { CheckInMobileCard } from "../molecules/checkInMobileCard";

type CheckInListTableProps = {
  records: CheckInRecord[];
  onViewRecord: (record: CheckInRecord) => void;
  onScanQrCode: () => void;
  title?: string;
  searchPlaceholder?: string;
  className?: string;
};

function getRecordSortDate(record: CheckInRecord) {
  return new Date(`${record.date} ${record.time}`);
}

export function CheckInListTable({
  records,
  onViewRecord,
  onScanQrCode,
  title = "Check-ins",
  searchPlaceholder = "Search check-ins",
  className,
}: CheckInListTableProps) {
  const columns = useMemo<CustomTableColumn<CheckInRecord>[]>(
    () => [
      {
        id: "member",
        header: "Member",
        isRowHeader: true,
        sortable: true,
        sortAccessor: (record) => record.member,
        exportAccessor: (record) => record.member,
        accessorKey: "member",
        className: "font-semibold text-text-primary",
      },
      {
        id: "type",
        header: "Type",
        sortable: true,
        sortAccessor: (record) => record.typeLabel,
        accessorKey: "typeLabel",
      },
      {
        id: "branch",
        header: "Branch",
        sortable: true,
        accessorKey: "branch",
        className: "text-text-secondary",
      },
      {
        id: "date",
        header: "Date",
        sortable: true,
        sortAccessor: (record) => getRecordSortDate(record),
        cell: (record) => (
          <p className="font-medium text-text-primary">
            {record.date}{" "}
            <span className="text-[13px] text-text-secondary">
              {record.time}
            </span>
          </p>
        ),
      },
      {
        id: "status",
        header: "Status",
        sortable: true,
        sortAccessor: (record) => record.status,
        cell: (record) => (
          <StatusBadge label={record.status} tone={record.statusTone} />
        ),
      },
    ],
    [],
  );

  const filterFields = useMemo<CustomTableFilterField<CheckInRecord>[]>(
    () => [
      {
        id: "typeLabel",
        type: "select",
        label: "Type",
        options: Array.from(
          new Set(records.map((record) => record.typeLabel)),
        ).map((value) => ({
          label: value,
          value,
        })),
        placeholder: "Select check-in type",
      },
      {
        id: "branch",
        type: "select",
        label: "Branch",
        options: Array.from(
          new Set(records.map((record) => record.branch)),
        ).map((value) => ({
          label: value,
          value,
        })),
        placeholder: "Select branch",
      },
    ],
    [records],
  );

  const rowActions = useMemo<CustomTableAction<CheckInRecord>[]>(
    () => [
      {
        label: "View details",
        onSelect: (record) => onViewRecord(record),
      },
    ],
    [onViewRecord],
  );

  return (
    <CustomTable
      title={title}
      data={records}
      columns={columns}
      rowActions={rowActions}
      rowActionsColumnLabel="Action"
      getRowId={(record) => record.id}
      getRowLabel={(record) => record.id}
      getSearchText={(record) =>
        [
          record.id,
          record.member,
          record.memberId,
          record.typeLabel,
          record.branch,
          record.date,
          record.time,
          record.status,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={`${title}. Front desk queue for members, booking type, branch, date, and operator actions.`}
      headerAction={
        <button
          type="button"
          onClick={onScanQrCode}
          className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
        >
          Scan QR code
        </button>
      }
      filterFields={filterFields}
      exportDataBtn
      exportFileName="check-ins-queue"
      queryParamPrefix="check-ins"
      renderMobileCard={(record, { actionsMenu }) => (
        <CheckInMobileCard record={record} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No check-ins found"
      emptyStateDescription="Adjust your search or filters to repopulate the queue."
      itemLabel="check-ins"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
