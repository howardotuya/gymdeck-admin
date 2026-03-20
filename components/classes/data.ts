import type { StatusTone } from "@/components/ui";

export type ClassTone = StatusTone;

export type ClassItem = {
  id: string;
  name: string;
  instructor: string;
  duration: string;
  capacity: number;
  activeSchedules: number;
  bookedSeats: string;
  status: string;
  tone: ClassTone;
  branch: string;
};

export type ScheduleSlot = {
  id: string;
  className: string;
  instructor: string;
  day: string;
  start: string;
  end: string;
  booked: string;
  tone: ClassTone;
  colStart: number;
  rowStart: number;
  rowSpan: number;
};

export const classOverview = [
  {
    label: "Active classes",
    value: "18",
    detail: "Across four branches and 96 weekly sessions",
  },
  {
    label: "Weekly sessions",
    value: "96",
    detail: "Morning and evening peaks are fully scheduled",
  },
  {
    label: "Waitlist pressure",
    value: "12",
    detail: "Mostly concentrated in HIIT and spin blocks",
  },
  {
    label: "Classes at risk",
    value: "3",
    detail: "Low fill or instructor coverage issues",
  },
];

export const classFilters = {
  instructor: ["All instructors", "Coach Timi", "Maya Alade", "Dare Okon", "Kemi Obasi"],
  status: ["All status", "Active", "Near full", "Waitlist", "Draft"],
  branch: ["All branches", "Victoria Island", "Lekki Phase 1", "Ikeja Central", "Yaba Studio"],
};

export const classViewModes = ["Table", "Calendar", "Cards"] as const;

export const classes: ClassItem[] = [
  {
    id: "CL-101",
    name: "HIIT Burn",
    instructor: "Coach Timi",
    duration: "45 mins",
    capacity: 18,
    activeSchedules: 6,
    bookedSeats: "14 / 18",
    status: "Near full",
    tone: "warning",
    branch: "Victoria Island",
  },
  {
    id: "CL-102",
    name: "Power Yoga",
    instructor: "Maya Alade",
    duration: "60 mins",
    capacity: 12,
    activeSchedules: 5,
    bookedSeats: "9 / 12",
    status: "Active",
    tone: "brand",
    branch: "Victoria Island",
  },
  {
    id: "CL-103",
    name: "Strength Basics",
    instructor: "Dare Okon",
    duration: "50 mins",
    capacity: 20,
    activeSchedules: 4,
    bookedSeats: "18 / 20",
    status: "Near full",
    tone: "warning",
    branch: "Yaba Studio",
  },
  {
    id: "CL-104",
    name: "Mobility Flow",
    instructor: "Kemi Obasi",
    duration: "40 mins",
    capacity: 16,
    activeSchedules: 3,
    bookedSeats: "7 / 16",
    status: "Active",
    tone: "success",
    branch: "Lekki Phase 1",
  },
  {
    id: "CL-105",
    name: "Spin Express",
    instructor: "Musa Ibrahim",
    duration: "45 mins",
    capacity: 18,
    activeSchedules: 4,
    bookedSeats: "18 / 18",
    status: "Waitlist",
    tone: "danger",
    branch: "Victoria Island",
  },
  {
    id: "CL-106",
    name: "Dance Cardio",
    instructor: "Lara Kingsley",
    duration: "55 mins",
    capacity: 20,
    activeSchedules: 2,
    bookedSeats: "6 / 20",
    status: "Draft",
    tone: "neutral",
    branch: "Ikeja Central",
  },
];

export const scheduleDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const scheduleTimes = ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"] as const;

export const weeklySlots: ScheduleSlot[] = [
  {
    id: "slot-1",
    className: "Power Yoga",
    instructor: "Maya Alade",
    day: "Mon",
    start: "6:00 AM",
    end: "7:00 AM",
    booked: "9 / 12",
    tone: "brand",
    colStart: 1,
    rowStart: 1,
    rowSpan: 2,
  },
  {
    id: "slot-2",
    className: "HIIT Burn",
    instructor: "Coach Timi",
    day: "Mon",
    start: "6:00 PM",
    end: "6:45 PM",
    booked: "14 / 18",
    tone: "warning",
    colStart: 1,
    rowStart: 7,
    rowSpan: 1,
  },
  {
    id: "slot-3",
    className: "Spin Express",
    instructor: "Musa Ibrahim",
    day: "Tue",
    start: "6:00 PM",
    end: "6:45 PM",
    booked: "18 / 18",
    tone: "danger",
    colStart: 2,
    rowStart: 7,
    rowSpan: 1,
  },
  {
    id: "slot-4",
    className: "Mobility Flow",
    instructor: "Kemi Obasi",
    day: "Wed",
    start: "8:00 AM",
    end: "8:40 AM",
    booked: "7 / 16",
    tone: "success",
    colStart: 3,
    rowStart: 2,
    rowSpan: 1,
  },
  {
    id: "slot-5",
    className: "Strength Basics",
    instructor: "Dare Okon",
    day: "Thu",
    start: "6:30 PM",
    end: "7:20 PM",
    booked: "18 / 20",
    tone: "warning",
    colStart: 4,
    rowStart: 7,
    rowSpan: 1,
  },
  {
    id: "slot-6",
    className: "Power Yoga",
    instructor: "Maya Alade",
    day: "Fri",
    start: "7:30 AM",
    end: "8:30 AM",
    booked: "10 / 12",
    tone: "brand",
    colStart: 5,
    rowStart: 2,
    rowSpan: 2,
  },
  {
    id: "slot-7",
    className: "HIIT Burn",
    instructor: "Coach Timi",
    day: "Sat",
    start: "9:00 AM",
    end: "9:45 AM",
    booked: "16 / 18",
    tone: "warning",
    colStart: 6,
    rowStart: 3,
    rowSpan: 1,
  },
  {
    id: "slot-8",
    className: "Dance Cardio",
    instructor: "Lara Kingsley",
    day: "Sun",
    start: "4:00 PM",
    end: "4:55 PM",
    booked: "6 / 20",
    tone: "neutral",
    colStart: 7,
    rowStart: 6,
    rowSpan: 1,
  },
];

export const mobileScheduleDays = [
  {
    day: "Today",
    slots: [
      { className: "Power Yoga", instructor: "Maya Alade", time: "7:30 AM - 8:30 AM", booked: "10 / 12", tone: "brand" as const },
      { className: "HIIT Burn", instructor: "Coach Timi", time: "6:00 PM - 6:45 PM", booked: "14 / 18", tone: "warning" as const },
    ],
  },
  {
    day: "Tomorrow",
    slots: [
      { className: "Spin Express", instructor: "Musa Ibrahim", time: "6:00 PM - 6:45 PM", booked: "18 / 18", tone: "danger" as const },
      { className: "Mobility Flow", instructor: "Kemi Obasi", time: "8:00 AM - 8:40 AM", booked: "7 / 16", tone: "success" as const },
    ],
  },
];

export const selectedClass = {
  ...classes[0],
  description:
    "High-intensity conditioning class that drives strong repeat attendance and some of the highest booking pressure on the platform.",
  overview: [
    { label: "Branch", value: "Victoria Island" },
    { label: "Format", value: "Studio class" },
    { label: "Weekly slots", value: "6 active slots" },
    { label: "Average fill", value: "82%" },
  ],
  scheduleSlots: [
    { day: "Mon", time: "6:00 PM - 6:45 PM", seats: "14 / 18", status: "Near full" },
    { day: "Tue", time: "6:00 PM - 6:45 PM", seats: "16 / 18", status: "Near full" },
    { day: "Thu", time: "6:00 PM - 6:45 PM", seats: "12 / 18", status: "Active" },
    { day: "Sat", time: "9:00 AM - 9:45 AM", seats: "16 / 18", status: "Near full" },
  ],
  capacityRules: [
    "Base capacity is 18 seats, with 2 operator-only manual hold seats.",
    "Walk-ins can be added until 10 minutes before class start if no waitlist exists.",
  ],
  waitlistRules: [
    "Waitlist opens automatically at full capacity.",
    "Front desk can promote from waitlist up to 15 minutes before start time.",
  ],
  attendees: [
    { title: "Howard Otuya", meta: "Monthly Premium • Confirmed" },
    { title: "Amaka Nnaji", meta: "6 Session Pack • Confirmed" },
    { title: "Kemi Obasi", meta: "Monthly Standard • Confirmed" },
  ],
  recentSessions: [
    { title: "Wed Mar 18", meta: "16 / 18 attended • 1 late cancellation" },
    { title: "Mon Mar 16", meta: "18 / 18 attended • waitlist promoted 2" },
    { title: "Sat Mar 14", meta: "15 / 18 attended • no incidents" },
  ],
  watchlist: [
    "This class creates the highest evening booking pressure at Victoria Island.",
    "Waitlist conversions are strong, so keeping notifications reliable matters here.",
    "Coach Timi is away next Friday, so schedule coverage should be confirmed early.",
  ],
};
