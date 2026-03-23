import type { StatusTone } from "@/components/ui";

export type ClassTone = StatusTone;

export type ClassRecord = {
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
  format: string;
  description: string;
  overview: {
    label: string;
    value: string;
  }[];
  scheduleSlots: {
    day: string;
    time: string;
    seats: string;
    status: string;
  }[];
  capacityRules: string[];
  waitlistRules: string[];
  attendees: {
    title: string;
    meta: string;
  }[];
  recentSessions: {
    title: string;
    meta: string;
  }[];
  watchlist: string[];
};

export type ClassSessionOccurrence = {
  id: string;
  sessionKey: string;
  label: string;
  scheduleLabel: string;
  dateLabel: string;
  weekLabel: string;
  status: string;
  tone: ClassTone;
  bookedSeats: string;
  attendedCount: number;
};

export type ClassMemberAttendance = {
  id: string;
  sessionId: string;
  name: string;
  initials: string;
  plan: string;
  bookingSource: string;
  status: string;
  tone: ClassTone;
  checkedInAt: string;
};

export type ClassTransactionRecord = {
  id: string;
  sessionId: string;
  member: string;
  initials: string;
  plan: string;
  amount: string;
  method: string;
  status: string;
  statusTone: ClassTone;
  date: string;
  time: string;
  invoiceState: string;
  invoiceTone: ClassTone;
};

export type ClassDetailRecord = {
  classItem: ClassRecord;
  occurrences: ClassSessionOccurrence[];
  members: ClassMemberAttendance[];
  transactions: ClassTransactionRecord[];
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

export const defaultClassImageUrl = "/assets/temp-gym-classes.jpg";

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
  instructor: [
    "All instructors",
    "Coach Timi",
    "Maya Alade",
    "Dare Okon",
    "Kemi Obasi",
    "Musa Ibrahim",
    "Lara Kingsley",
  ],
  status: ["All status", "Active", "Near full", "Waitlist", "Draft"],
  branch: ["All branches", "Victoria Island", "Lekki Phase 1", "Ikeja Central", "Yaba Studio"],
};

export const classViewModes = ["Table", "Calendar", "Cards"] as const;

export const classes: ClassRecord[] = [
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
    format: "Studio class",
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
      { title: "Howard Otuya", meta: "Monthly Premium • Direct booking" },
      { title: "Amaka Nnaji", meta: "6 Session Pack • Staff added" },
      { title: "Seyi Bamidele", meta: "Gympass Flex • Partner booking" },
    ],
    recentSessions: [
      { title: "Wed Mar 18", meta: "16 / 18 attended • 1 late cancellation" },
      { title: "Mon Mar 16", meta: "18 / 18 attended • waitlist promoted 2" },
      { title: "Sat Mar 14", meta: "15 / 18 attended • no incidents" },
    ],
    watchlist: [
      "Highest evening booking pressure at Victoria Island.",
      "Waitlist conversion is strong, so promotion rules should stay visible.",
      "Coach Timi is away next Friday, so schedule coverage needs confirmation.",
    ],
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
    format: "Mind-body studio",
    description:
      "A high-retention yoga block that performs well in early mornings and after-work recovery slots.",
    overview: [
      { label: "Branch", value: "Victoria Island" },
      { label: "Format", value: "Mind-body studio" },
      { label: "Weekly slots", value: "5 active slots" },
      { label: "Average fill", value: "74%" },
    ],
    scheduleSlots: [
      { day: "Mon", time: "6:00 AM - 7:00 AM", seats: "9 / 12", status: "Active" },
      { day: "Wed", time: "7:30 AM - 8:30 AM", seats: "10 / 12", status: "Active" },
      { day: "Fri", time: "7:30 AM - 8:30 AM", seats: "10 / 12", status: "Near full" },
      { day: "Sun", time: "5:00 PM - 6:00 PM", seats: "8 / 12", status: "Active" },
    ],
    capacityRules: [
      "Capacity stays capped at 12 because mats and props are pre-assigned.",
      "Members can reserve recurring slots up to 14 days in advance.",
    ],
    waitlistRules: [
      "Waitlist stays manual after the 30-minute pre-class cutoff.",
      "Guests are not allowed onto the waitlist without staff confirmation.",
    ],
    attendees: [
      { title: "Ini Dada", meta: "Unlimited Yoga • Direct booking" },
      { title: "Tomiwa Cole", meta: "10 Session Pack • App booking" },
      { title: "Uche Okpara", meta: "Wellhub Gold • Partner booking" },
    ],
    recentSessions: [
      { title: "Fri Mar 20", meta: "10 / 12 attended • no incidents" },
      { title: "Wed Mar 18", meta: "9 / 12 attended • 1 no-show" },
      { title: "Mon Mar 16", meta: "8 / 12 attended • 1 walk-in added" },
    ],
    watchlist: [
      "Recurring reservations account for most of the morning fill.",
      "Partner inventory should stay capped to preserve member access.",
    ],
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
    format: "Small group training",
    description:
      "Entry-level strength programming with stable demand and a heavier reliance on first-time visitors.",
    overview: [
      { label: "Branch", value: "Yaba Studio" },
      { label: "Format", value: "Small group training" },
      { label: "Weekly slots", value: "4 active slots" },
      { label: "Average fill", value: "79%" },
    ],
    scheduleSlots: [
      { day: "Tue", time: "6:30 PM - 7:20 PM", seats: "17 / 20", status: "Near full" },
      { day: "Thu", time: "6:30 PM - 7:20 PM", seats: "18 / 20", status: "Near full" },
      { day: "Sat", time: "11:00 AM - 11:50 AM", seats: "14 / 20", status: "Active" },
    ],
    capacityRules: [
      "Capacity is fixed at 20 because equipment blocks are shared across pairs.",
      "Intro packs can only book one future session at a time.",
    ],
    waitlistRules: [
      "Waitlist claims expire after 20 minutes once a seat opens.",
      "Staff can overbook by one when a visitor has already checked in on site.",
    ],
    attendees: [
      { title: "Victor Olanrewaju", meta: "Intro Pack • App booking" },
      { title: "Mariam Ishola", meta: "Standard Monthly • Direct booking" },
      { title: "Chibuike Obi", meta: "Corporate Plan • Staff added" },
    ],
    recentSessions: [
      { title: "Thu Mar 19", meta: "18 / 20 attended • 2 no-shows" },
      { title: "Tue Mar 17", meta: "16 / 20 attended • no incidents" },
      { title: "Sat Mar 14", meta: "13 / 20 attended • 1 late cancellation" },
    ],
    watchlist: [
      "New-member conversion is strongest after Saturday sessions.",
      "No-show spikes usually come from intro-pack users.",
    ],
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
    format: "Recovery block",
    description:
      "A lower-intensity recovery class that pairs well with premium plans and corporate wellness access.",
    overview: [
      { label: "Branch", value: "Lekki Phase 1" },
      { label: "Format", value: "Recovery block" },
      { label: "Weekly slots", value: "3 active slots" },
      { label: "Average fill", value: "51%" },
    ],
    scheduleSlots: [
      { day: "Wed", time: "8:00 AM - 8:40 AM", seats: "7 / 16", status: "Active" },
      { day: "Fri", time: "1:00 PM - 1:40 PM", seats: "6 / 16", status: "Active" },
      { day: "Sun", time: "4:00 PM - 4:40 PM", seats: "9 / 16", status: "Active" },
    ],
    capacityRules: [
      "Corporate members can book up to 21 days out for this class type.",
      "Capacity stays flexible because props do not constrain the room.",
    ],
    waitlistRules: [
      "Waitlist only opens once 12 seats are booked to avoid unnecessary queueing.",
      "Promotions are manual because the class rarely fills.",
    ],
    attendees: [
      { title: "Damilola George", meta: "Corporate Plus • Direct booking" },
      { title: "Rahmat Bello", meta: "Monthly Standard • App booking" },
      { title: "Wale Odutola", meta: "Gympass Flex • Partner booking" },
    ],
    recentSessions: [
      { title: "Wed Mar 18", meta: "7 / 16 attended • no incidents" },
      { title: "Sun Mar 15", meta: "9 / 16 attended • 1 walk-in added" },
      { title: "Fri Mar 13", meta: "6 / 16 attended • no incidents" },
    ],
    watchlist: [
      "This class under-indexes in bookings but increases retention for premium plans.",
      "Keep the format visible in filters so recovery programming is easy to find.",
    ],
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
    format: "Cycle studio",
    description:
      "A consistently sold-out cycling block with the highest waitlist pressure across all city-center branches.",
    overview: [
      { label: "Branch", value: "Victoria Island" },
      { label: "Format", value: "Cycle studio" },
      { label: "Weekly slots", value: "4 active slots" },
      { label: "Average fill", value: "100%" },
    ],
    scheduleSlots: [
      { day: "Tue", time: "6:00 PM - 6:45 PM", seats: "18 / 18", status: "Waitlist" },
      { day: "Thu", time: "6:00 PM - 6:45 PM", seats: "18 / 18", status: "Waitlist" },
      { day: "Sat", time: "8:00 AM - 8:45 AM", seats: "18 / 18", status: "Waitlist" },
    ],
    capacityRules: [
      "Bike allocation fixes capacity at 18 and prevents manual overbooking.",
      "Partner channels are capped at 4 bikes per session.",
    ],
    waitlistRules: [
      "Waitlist auto-promotes until 45 minutes before start time.",
      "Claim window is 15 minutes before the next person is notified.",
    ],
    attendees: [
      { title: "Jumoke Aina", meta: "Unlimited Spin • Direct booking" },
      { title: "Kelvin Nwosu", meta: "8 Ride Pack • App booking" },
      { title: "Maryam Sani", meta: "Wellhub Plus • Partner booking" },
    ],
    recentSessions: [
      { title: "Tue Mar 17", meta: "18 / 18 attended • waitlist promoted 3" },
      { title: "Sat Mar 14", meta: "18 / 18 attended • 1 no-show" },
      { title: "Thu Mar 12", meta: "18 / 18 attended • waitlist promoted 2" },
    ],
    watchlist: [
      "Partner spots need tighter control to avoid member complaints.",
      "The delete action should remain secondary because this is a flagship class.",
    ],
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
    format: "Studio class",
    description:
      "A newer social cardio format still in rollout, so it needs prominent edit and delete controls while the schedule is refined.",
    overview: [
      { label: "Branch", value: "Ikeja Central" },
      { label: "Format", value: "Studio class" },
      { label: "Weekly slots", value: "2 active slots" },
      { label: "Average fill", value: "30%" },
    ],
    scheduleSlots: [
      { day: "Sun", time: "4:00 PM - 4:55 PM", seats: "6 / 20", status: "Draft" },
      { day: "Tue", time: "5:30 PM - 6:25 PM", seats: "5 / 20", status: "Draft" },
    ],
    capacityRules: [
      "Draft classes stay hidden from partner feeds until the first two sessions are confirmed.",
      "Capacity can be lowered after trial demand is measured.",
    ],
    waitlistRules: [
      "Waitlist is disabled while the class remains in draft mode.",
      "Delete should be available because slots are still experimental.",
    ],
    attendees: [
      { title: "Nene Agho", meta: "Trial Guest • Staff added" },
      { title: "Femi Ayeni", meta: "Monthly Standard • Direct booking" },
      { title: "Adaeze Nkem", meta: "Weekend Pack • App booking" },
    ],
    recentSessions: [
      { title: "Sun Mar 15", meta: "6 / 20 attended • pilot session" },
      { title: "Tue Mar 10", meta: "4 / 20 attended • schedule under review" },
    ],
    watchlist: [
      "The class is still in rollout, so admins need fast edit access.",
      "Delete remains a valid option until the branch locks the format in.",
    ],
  },
];

export const defaultSelectedClassId = classes[0].id;

const classHistoryReferenceDate = new Date("2026-03-29T18:00:00");
const dayIndexMap: Record<string, number> = {
  Mon: 0,
  Tue: 1,
  Wed: 2,
  Thu: 3,
  Fri: 4,
  Sat: 5,
  Sun: 6,
};

function getWeekStart(date: Date) {
  const normalized = new Date(date);
  const day = normalized.getDay();
  const mondayOffset = (day + 6) % 7;
  normalized.setHours(0, 0, 0, 0);
  normalized.setDate(normalized.getDate() - mondayOffset);
  return normalized;
}

function formatOccurrenceDate(value: Date) {
  return value.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function buildInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function splitAttendeeMeta(meta: string) {
  const [plan = "Member plan", bookingSource = "Direct booking"] = meta.split(" • ");
  return { plan, bookingSource };
}

function getOccurrenceDate(day: string, weeksAgo: number) {
  const weekStart = getWeekStart(classHistoryReferenceDate);
  const dayOffset = dayIndexMap[day] ?? 0;
  const date = new Date(weekStart);
  date.setDate(weekStart.getDate() - weeksAgo * 7 + dayOffset);
  return date;
}

function getMemberAttendanceState(weeksAgo: number, index: number) {
  if (weeksAgo === 0) {
    if (index === 0) {
      return { label: "Attended", tone: "success" as const, checkedInAt: "Checked in 8 mins early" };
    }

    if (index === 1) {
      return { label: "Attended", tone: "success" as const, checkedInAt: "Checked in on arrival" };
    }

    return { label: "Late cancel", tone: "warning" as const, checkedInAt: "Cancelled 22 mins before" };
  }

  if (index === 2) {
    return { label: "No-show", tone: "danger" as const, checkedInAt: "No check-in recorded" };
  }

  return { label: "Attended", tone: "success" as const, checkedInAt: "Attendance submitted" };
}

function getTransactionState(weeksAgo: number, index: number) {
  if (weeksAgo === 0 && index === 2) {
    return {
      status: "Pending",
      statusTone: "brand" as const,
      invoiceState: "Awaiting capture",
      invoiceTone: "brand" as const,
      method: "Transfer",
    };
  }

  if (weeksAgo === 1 && index === 2) {
    return {
      status: "Refunded",
      statusTone: "danger" as const,
      invoiceState: "Refund processed",
      invoiceTone: "danger" as const,
      method: "Card",
    };
  }

  return {
    status: "Successful",
    statusTone: "success" as const,
    invoiceState: "Receipt ready",
    invoiceTone: "brand" as const,
    method: index === 1 ? "Transfer" : "Card",
  };
}

function buildClassDetailRecord(classItem: ClassRecord): ClassDetailRecord {
  const occurrences = classItem.scheduleSlots.flatMap((slot) => {
    const [startTime] = slot.time.split(" - ");

    return [0, 1].map((weeksAgo) => {
      const occurrenceDate = getOccurrenceDate(slot.day, weeksAgo);
      const dateLabel = formatOccurrenceDate(occurrenceDate);

      return {
        id: `${classItem.id}-${slot.day}-${startTime.replace(/[^0-9APM]/gi, "").toLowerCase()}-${weeksAgo}`,
        sessionKey: `${slot.day}-${slot.time}`,
        label: `${dateLabel} • ${slot.time}`,
        scheduleLabel: `${slot.day} • ${slot.time}`,
        dateLabel,
        weekLabel: weeksAgo === 0 ? "This week" : "Last week",
        status: slot.status,
        tone: classItem.tone,
        bookedSeats: slot.seats,
        attendedCount: Math.max(classItem.attendees.length - (weeksAgo === 0 ? 1 : 0), 1),
      } satisfies ClassSessionOccurrence;
    });
  });

  const members = occurrences.flatMap((occurrence, occurrenceIndex) =>
    classItem.attendees.map((attendee, attendeeIndex) => {
      const { plan, bookingSource } = splitAttendeeMeta(attendee.meta);
      const attendanceState = getMemberAttendanceState(
        occurrence.weekLabel === "This week" ? 0 : 1,
        attendeeIndex,
      );

      return {
        id: `${occurrence.id}-member-${attendeeIndex + 1}`,
        sessionId: occurrence.id,
        name: attendee.title,
        initials: buildInitials(attendee.title),
        plan,
        bookingSource,
        status: attendanceState.label,
        tone: attendanceState.tone,
        checkedInAt:
          occurrenceIndex % 2 === 0
            ? attendanceState.checkedInAt
            : attendanceState.label === "Attended"
              ? "Attendance confirmed by coach"
              : attendanceState.checkedInAt,
      } satisfies ClassMemberAttendance;
    }),
  );

  const transactions = occurrences.flatMap((occurrence, occurrenceIndex) =>
    classItem.attendees.map((attendee, attendeeIndex) => {
      const { plan } = splitAttendeeMeta(attendee.meta);
      const transactionState = getTransactionState(
        occurrence.weekLabel === "This week" ? 0 : 1,
        attendeeIndex,
      );
      const amount = `NGN ${(classItem.capacity * 1800 + attendeeIndex * 2500).toLocaleString()}`;

      return {
        id: `TX-${classItem.id.slice(3)}${occurrenceIndex + 1}${attendeeIndex + 1}`,
        sessionId: occurrence.id,
        member: attendee.title,
        initials: buildInitials(attendee.title),
        plan,
        amount,
        method: transactionState.method,
        status: transactionState.status,
        statusTone: transactionState.statusTone,
        date: occurrence.dateLabel,
        time: attendeeIndex === 0 ? "5:48 AM" : attendeeIndex === 1 ? "6:02 AM" : "6:16 AM",
        invoiceState: transactionState.invoiceState,
        invoiceTone: transactionState.invoiceTone,
      } satisfies ClassTransactionRecord;
    }),
  );

  return {
    classItem,
    occurrences: occurrences.sort(
      (left, right) => new Date(right.dateLabel).getTime() - new Date(left.dateLabel).getTime(),
    ),
    members,
    transactions,
  };
}

const classDetails = classes.map(buildClassDetailRecord);

export function getClassById(classId: string) {
  return classes.find((classItem) => classItem.id === classId);
}

export function getClassDetailById(classId: string) {
  return classDetails.find((detail) => detail.classItem.id === classId);
}

export const scheduleDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const scheduleTimes = [
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
] as const;

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
    rowStart: 13,
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
    rowStart: 13,
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
    rowStart: 3,
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
    rowStart: 13,
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
    rowStart: 4,
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
    rowStart: 11,
    rowSpan: 1,
  },
];

export const mobileScheduleDays = [
  {
    day: "Today",
    slots: [
      {
        className: "Power Yoga",
        instructor: "Maya Alade",
        time: "7:30 AM - 8:30 AM",
        booked: "10 / 12",
        tone: "brand" as const,
      },
      {
        className: "HIIT Burn",
        instructor: "Coach Timi",
        time: "6:00 PM - 6:45 PM",
        booked: "14 / 18",
        tone: "warning" as const,
      },
    ],
  },
  {
    day: "Tomorrow",
    slots: [
      {
        className: "Spin Express",
        instructor: "Musa Ibrahim",
        time: "6:00 PM - 6:45 PM",
        booked: "18 / 18",
        tone: "danger" as const,
      },
      {
        className: "Mobility Flow",
        instructor: "Kemi Obasi",
        time: "8:00 AM - 8:40 AM",
        booked: "7 / 16",
        tone: "success" as const,
      },
    ],
  },
];
