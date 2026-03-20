"use client";

import { useMemo } from "react";
import { ChevronDownIcon } from "@/components/icons";
import {
  CustomTable,
  StatusBadge,
  TableControlButton,
  type CustomTableAction,
  type CustomTableColumn,
} from "@/components/ui";
import type { BookingRow } from "../data";
import { BookingMobileCard } from "../molecules/bookingMobileCard";

type BookingListTableProps = {
  bookings: BookingRow[];
  onMarkAsUsed?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  title?: string;
  description?: string;
  searchPlaceholder?: string;
  tableCaption?: string;
  className?: string;
};

const monthIndexByLabel: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function getBookingScheduleSortValue(booking: BookingRow) {
  const [monthLabel, dayLabel, yearLabel] = booking.date.split(" ");
  const [timeLabel, meridiem] = booking.time.split(" ");
  const [hoursLabel, minutesLabel] = timeLabel.split(":");
  const day = Number(dayLabel.replace(",", ""));
  const year = Number(yearLabel);
  const minutes = Number(minutesLabel);
  let hours = Number(hoursLabel) % 12;

  if (meridiem === "PM") {
    hours += 12;
  }

  return new Date(year, monthIndexByLabel[monthLabel], day, hours, minutes);
}

const bookingColumns: CustomTableColumn<BookingRow>[] = [
  {
    id: "bookingId",
    header: "Booking ID",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (booking) => booking.id,
    cell: (booking) => (
      <div>
        <p className="font-semibold text-text-primary">{booking.id}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{booking.branch}</p>
      </div>
    ),
  },
  {
    id: "member",
    header: "Member",
    sortable: true,
    sortAccessor: (booking) => booking.member,
    cell: (booking) => (
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-bg-muted text-[13px] font-semibold text-text-secondary">
          {booking.initials}
        </div>
        <div>
          <p className="font-medium text-text-primary">{booking.member}</p>
          <p className="mt-1 text-[13px] text-text-secondary">{booking.passType}</p>
        </div>
      </div>
    ),
  },
  {
    id: "type",
    header: "Type",
    accessorKey: "type",
    sortable: true,
    className: "text-text-secondary",
  },
  {
    id: "target",
    header: "Class / Gym access",
    sortable: true,
    sortAccessor: (booking) => booking.target,
    cell: (booking) => (
      <div>
        <p className="font-medium text-text-primary">{booking.target}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{booking.branch}</p>
      </div>
    ),
  },
  {
    id: "schedule",
    header: "Schedule",
    sortable: true,
    sortAccessor: (booking) => getBookingScheduleSortValue(booking),
    cell: (booking) => (
      <div>
        <p className="font-medium text-text-primary">{booking.date}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{booking.time}</p>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    align: "right",
    sortable: true,
    sortAccessor: (booking) => booking.status,
    cell: (booking) => <StatusBadge label={booking.status} tone={booking.statusTone} />,
  },
  {
    id: "qrState",
    header: "QR state",
    align: "right",
    sortable: true,
    sortAccessor: (booking) => booking.qrState,
    cell: (booking) => <StatusBadge label={booking.qrState} tone={booking.qrTone} />,
  },
];

function BookingToolbarActions() {
  return (
    <>
      <TableControlButton>Export Data</TableControlButton>
      <TableControlButton>
        Filter By
        <ChevronDownIcon size={16} />
      </TableControlButton>
    </>
  );
}

export function BookingListTable({
  bookings,
  onMarkAsUsed,
  onCancel,
  title = "Booking list",
  description = "This is a directory of current bookings across the platform. Use it to scan member reservations, class demand, branch traffic, and check-in readiness quickly.",
  searchPlaceholder = "Search bookings",
  tableCaption,
  className,
}: BookingListTableProps) {
  const bookingActions = useMemo<CustomTableAction<BookingRow>[]>(
    () => [
      {
        label: "Mark as used",
        hidden: (booking) =>
          booking.status === "Used" ||
          booking.status === "Cancelled" ||
          booking.status === "No-show",
        onSelect: (booking) => onMarkAsUsed?.(booking.id),
      },
      {
        label: "Cancel booking",
        tone: "danger",
        hidden: (booking) =>
          booking.status === "Cancelled" ||
          booking.status === "Used" ||
          booking.status === "No-show",
        onSelect: (booking) => onCancel?.(booking.id),
      },
    ],
    [onCancel, onMarkAsUsed],
  );

  return (
    <CustomTable
      title={title}
      description={description}
      data={bookings}
      columns={bookingColumns}
      rowActions={bookingActions}
      getRowId={(booking) => booking.id}
      getRowLabel={(booking) => booking.id}
      getSearchText={(booking) =>
        [
          booking.id,
          booking.member,
          booking.type,
          booking.target,
          booking.branch,
          booking.date,
          booking.time,
          booking.status,
          booking.qrState,
          booking.passType,
        ].join(" ")
      }
      searchPlaceholder={searchPlaceholder}
      caption={
        tableCaption ??
        `${title}. Directory of member bookings, booking types, destinations, schedules, statuses, and QR readiness.`
      }
      toolbarActions={<BookingToolbarActions />}
      renderMobileCard={(booking, { actionsMenu }) => (
        <BookingMobileCard booking={booking} actionsMenu={actionsMenu} />
      )}
      emptyStateTitle="No bookings found"
      emptyStateDescription="Adjust your search or booking filters to populate this roster."
      itemLabel="bookings"
      initialPageSize={4}
      pageSizeOptions={[4, 8, 12]}
      className={className}
    />
  );
}
