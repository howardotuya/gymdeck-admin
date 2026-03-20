import type { StatusTone } from "@/components/ui";

export type BookingTone = StatusTone;
export type BookingStatus = "Confirmed" | "Used" | "No-show" | "Cancelled" | "Pending";
export type BookingQrState = "Ready" | "Validated" | "Unused" | "Voided" | "Generating";

export type BookingRow = {
  id: string;
  member: string;
  initials: string;
  type: "Gym Access" | "Class Booking";
  target: string;
  branch: string;
  date: string;
  time: string;
  status: BookingStatus;
  statusTone: BookingTone;
  qrState: BookingQrState;
  qrTone: BookingTone;
  passType: string;
};

export const bookings: BookingRow[] = [
  {
    id: "BK-219",
    member: "Howard Otuya",
    initials: "HO",
    type: "Class Booking",
    target: "HIIT Burn",
    branch: "Victoria Island",
    date: "Mar 20, 2026",
    time: "6:00 PM",
    status: "Confirmed",
    statusTone: "success",
    qrState: "Ready",
    qrTone: "brand",
    passType: "Monthly Premium",
  },
  {
    id: "BK-218",
    member: "Amaka Nnaji",
    initials: "AN",
    type: "Gym Access",
    target: "Victoria Island",
    branch: "Victoria Island",
    date: "Mar 20, 2026",
    time: "5:30 PM",
    status: "Used",
    statusTone: "success",
    qrState: "Validated",
    qrTone: "success",
    passType: "6 Session Pack",
  },
  {
    id: "BK-216",
    member: "Tobi Adebayo",
    initials: "TA",
    type: "Class Booking",
    target: "Power Yoga",
    branch: "Ikeja Central",
    date: "Mar 20, 2026",
    time: "7:30 AM",
    status: "No-show",
    statusTone: "warning",
    qrState: "Unused",
    qrTone: "neutral",
    passType: "Monthly Standard",
  },
  {
    id: "BK-214",
    member: "Lara Kingsley",
    initials: "LK",
    type: "Gym Access",
    target: "Lekki Phase 1",
    branch: "Lekki Phase 1",
    date: "Mar 19, 2026",
    time: "8:15 AM",
    status: "Cancelled",
    statusTone: "danger",
    qrState: "Voided",
    qrTone: "danger",
    passType: "Single Visit",
  },
  {
    id: "BK-211",
    member: "Chidi Nkem",
    initials: "CN",
    type: "Class Booking",
    target: "Strength Basics",
    branch: "Yaba Studio",
    date: "Mar 20, 2026",
    time: "6:30 PM",
    status: "Pending",
    statusTone: "brand",
    qrState: "Generating",
    qrTone: "warning",
    passType: "Monthly Premium",
  },
  {
    id: "BK-208",
    member: "Kemi Obasi",
    initials: "KO",
    type: "Gym Access",
    target: "Yaba Studio",
    branch: "Yaba Studio",
    date: "Mar 20, 2026",
    time: "7:15 AM",
    status: "Confirmed",
    statusTone: "brand",
    qrState: "Ready",
    qrTone: "brand",
    passType: "Monthly Standard",
  },
];

export function getBookingOverview(rows: BookingRow[]) {
  const gymAccessCount = rows.filter((booking) => booking.type === "Gym Access").length;
  const classBookingCount = rows.length - gymAccessCount;
  const confirmedCount = rows.filter((booking) => booking.status === "Confirmed").length;
  const usedCount = rows.filter((booking) => booking.status === "Used").length;
  const noShowCount = rows.filter((booking) => booking.status === "No-show").length;
  const pendingCount = rows.filter((booking) => booking.status === "Pending").length;
  const cancelledCount = rows.filter((booking) => booking.status === "Cancelled").length;
  const attentionCount = rows.filter((booking) =>
    booking.status === "Pending" ||
    booking.status === "Cancelled" ||
    booking.status === "No-show"
  ).length;

  return [
    {
      label: "Bookings in roster",
      value: rows.length.toString(),
      detail: `${gymAccessCount} gym access and ${classBookingCount} class bookings`,
    },
    {
      label: "Confirmed or used",
      value: (confirmedCount + usedCount).toString(),
      detail: `${usedCount} already marked used across the current booking list`,
    },
    {
      label: "No-shows",
      value: noShowCount.toString(),
      detail:
        noShowCount > 0
          ? "Sessions that closed without a recorded check-in"
          : "No no-shows recorded in the current roster",
    },
    {
      label: "Needs attention",
      value: attentionCount.toString(),
      detail: `${pendingCount} pending and ${cancelledCount} cancelled bookings need follow-up`,
    },
  ];
}
