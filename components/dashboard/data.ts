import type { StatusTone } from "@/components/ui";

export type DashboardTone = StatusTone;

export const dashboardFilters = ["Today", "7 days", "30 days"] as const;

export const kpiStats = [
  {
    label: "Active members",
    value: "1,248",
    delta: "+8.4%",
    footer: "96 new members joined this month",
    tone: "brand" as const,
    sparkline: [8, 10, 9, 11, 13, 12, 14, 15, 14, 16, 18, 17],
  },
  {
    label: "Today's check-ins",
    value: "186",
    delta: "+12%",
    footer: "Peak traffic is tracking to 6 PM",
    tone: "success" as const,
    sparkline: [5, 8, 10, 12, 14, 18, 15, 19, 21, 20, 18, 16],
  },
  {
    label: "Class bookings",
    value: "94",
    delta: "+6%",
    footer: "12 waitlist requests need action",
    tone: "warning" as const,
    sparkline: [4, 5, 6, 9, 7, 10, 12, 11, 13, 12, 14, 15],
  },
  {
    label: "Monthly revenue",
    value: "NGN 8.4M",
    delta: "+15%",
    footer: "Card payments converted at 96%",
    tone: "brand" as const,
    sparkline: [7, 8, 10, 11, 13, 14, 13, 15, 16, 18, 19, 21],
  },
  {
    label: "Expiring passes",
    value: "42",
    delta: "18 today",
    footer: "Reminder queue should go out before noon",
    tone: "warning" as const,
    sparkline: [2, 4, 3, 5, 6, 5, 7, 8, 7, 9, 10, 11],
  },
  {
    label: "Pending issues",
    value: "7",
    delta: "2 urgent",
    footer: "Payment failures and staff coverage lead",
    tone: "danger" as const,
    sparkline: [6, 5, 5, 4, 4, 5, 3, 4, 3, 3, 2, 2],
  },
];

export const overviewSeries = {
  labels: ["6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p"],
  checkIns: [28, 42, 55, 68, 74, 88, 104, 92],
  bookings: [12, 18, 22, 35, 40, 52, 63, 58],
};

export const upcomingClasses = [
  {
    time: "06:00 AM",
    name: "HIIT Burn",
    instructor: "Coach Timi",
    seats: "14 / 18 booked",
    tone: "success" as const,
  },
  {
    time: "07:30 AM",
    name: "Power Yoga",
    instructor: "Maya Alade",
    seats: "9 / 12 booked",
    tone: "brand" as const,
  },
  {
    time: "06:00 PM",
    name: "Strength Basics",
    instructor: "Dare Okon",
    seats: "18 / 20 booked",
    tone: "warning" as const,
  },
];

export const capacityWatch = [
  { name: "Spin Express", detail: "Full for 5:30 PM", label: "Full", tone: "danger" as const },
  {
    name: "Pilates Flow",
    detail: "2 seats left at 7:00 AM",
    label: "Near full",
    tone: "warning" as const,
  },
  {
    name: "Open Gym Intro",
    detail: "Low bookings for 1:00 PM",
    label: "Watch",
    tone: "neutral" as const,
  },
];

export const staffNotes = [
  "Front desk coverage is light between 1:00 PM and 3:00 PM.",
  "Two failed renewal payments need finance follow-up.",
  "Locker maintenance starts after the 8:00 PM close.",
];

export const recentPayments = [
  {
    id: "TX-1042",
    member: "Howard Otuya",
    plan: "Monthly Premium",
    amount: "NGN 15,000",
    method: "Card",
    status: "Success",
    date: "10:42 AM",
    tone: "success" as const,
  },
  {
    id: "TX-1041",
    member: "Amaka Nnaji",
    plan: "6 Session Pack",
    amount: "NGN 36,000",
    method: "Card",
    status: "Pending",
    date: "10:12 AM",
    tone: "warning" as const,
  },
  {
    id: "TX-1038",
    member: "David Kale",
    plan: "Single Visit",
    amount: "NGN 8,000",
    method: "Transfer",
    status: "Refunded",
    date: "09:18 AM",
    tone: "neutral" as const,
  },
  {
    id: "TX-1034",
    member: "Musa Ibrahim",
    plan: "Monthly Standard",
    amount: "NGN 12,000",
    method: "Card",
    status: "Failed",
    date: "08:44 AM",
    tone: "danger" as const,
  },
];

export const recentBookings = [
  {
    id: "BK-219",
    member: "Tobi Adebayo",
    type: "Class",
    slot: "HIIT Burn",
    time: "6:00 PM",
    status: "Confirmed",
    tone: "success" as const,
  },
  {
    id: "BK-218",
    member: "Lara Kingsley",
    type: "Gym Access",
    slot: "Victoria Island",
    time: "5:30 PM",
    status: "Used",
    tone: "brand" as const,
  },
  {
    id: "BK-216",
    member: "Chidi Nkem",
    type: "Class",
    slot: "Power Yoga",
    time: "7:30 AM",
    status: "No-show",
    tone: "danger" as const,
  },
  {
    id: "BK-214",
    member: "Amara Eze",
    type: "Gym Access",
    slot: "Lekki Branch",
    time: "8:15 AM",
    status: "Checked in",
    tone: "success" as const,
  },
];

export const quickActions = [
  {
    href: "/classes",
    label: "Add class",
    detail: "Create a new class and schedule slots",
    primary: true,
  },
  {
    href: "/plans",
    label: "Create plan",
    detail: "Add a new pass or subscription product",
  },
  {
    href: "/staff-roles",
    label: "Add staff",
    detail: "Invite a manager, trainer, or front desk user",
  },
  {
    href: "/gallery",
    label: "Upload photos",
    detail: "Refresh the public listing media",
  },
  {
    href: "/members",
    label: "Check in member",
    detail: "Search members and validate access quickly",
  },
];

export const reviewSummary = {
  average: "4.7",
  total: "128 reviews",
  distribution: [
    { label: "5 star", value: 80 },
    { label: "4 star", value: 30 },
    { label: "3 star", value: 10 },
    { label: "2 star", value: 5 },
    { label: "1 star", value: 3 },
  ],
};

export const expirySummary = [
  { label: "Expiring today", value: "18", detail: "8 members have auto-renew off" },
  { label: "This week", value: "42", detail: "Priority list for renewal reminders" },
  { label: "Overdue", value: "4", detail: "Front desk follow-up recommended" },
];

export const topPlans = [
  { name: "Monthly Premium", members: "412 members", revenue: "NGN 4.1M" },
  { name: "6 Session Pack", members: "188 members", revenue: "NGN 2.3M" },
  { name: "Single Visit", members: "96 purchases", revenue: "NGN 768K" },
];
