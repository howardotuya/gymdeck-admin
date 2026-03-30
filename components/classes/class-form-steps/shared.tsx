import clsx from "clsx";
import type { ReactNode } from "react";
import {
  formFieldClassName,
  formTextAreaClassName,
} from "@/components/ui/fieldStyles";
import { defaultClassImageUrl, type ClassRecord } from "../data";

export const inputClassName = formFieldClassName;
export const textAreaClassName = formTextAreaClassName;

export const weekdayOptions = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;
export const categoryOptions = [
  "Yoga",
  "HIIT",
  "Cycling",
  "Dance",
  "Pilates",
  "CrossFit",
] as const;
export const formatOptions = [
  "Studio class",
  "Small group training",
  "Cycle studio",
  "Mind-body studio",
  "Recovery block",
] as const;
export const levelOptions = [
  "All levels",
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;
export const visibilityOptions = [
  "Members and staff",
  "Members only",
  "Staff only until publish",
] as const;
export const waitlistModeOptions = [
  "Auto-promote",
  "Claim to join",
  "Manual only",
] as const;
export const reminderOptions = [
  "24 hours and 2 hours before",
  "24 hours before",
  "2 hours before",
  "No reminders",
] as const;
export const noShowPolicyOptions = [
  "Warn only",
  "Deduct session",
  "Apply strike after no-show",
] as const;
export const partnerOptions = [
  "No partner sync",
  "Sync to Wellhub / Gympass",
] as const;

export const planOptions = [
  {
    id: "unlimited-access",
    label: "Unlimited access",
    detail:
      "Best for flagship classes with high repeat attendance and full schedule visibility.",
  },
  {
    id: "studio-pack",
    label: "Studio pack",
    detail:
      "Session-pack access that behaves like a typical class credit product in most gym systems.",
  },
  {
    id: "corporate-plus",
    label: "Corporate Plus",
    detail:
      "Useful when classes are distributed through employer wellness plans or branch partnerships.",
  },
  {
    id: "intro-trial",
    label: "Intro trial",
    detail:
      "Limited access product for first visits, usually with tighter booking limits and no recurring holds.",
  },
] as const;

export type ClassFormState = {
  name: string;
  category: (typeof categoryOptions)[number];
  format: (typeof formatOptions)[number];
  branch: string;
  instructor: string;
  room: string;
  durationMinutes: string;
  level: (typeof levelOptions)[number];
  description: string;
  imageFile: File | null;
  imagePreviewUrl: string;
  imageName: string;
  selectedDays: string[];
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  visibility: (typeof visibilityOptions)[number];
  bookingOpenDays: string;
  bookingCloseMinutes: string;
  cancellationCutoffMinutes: string;
  capacity: string;
  heldSeats: string;
  partnerInventory: string;
  waitlistEnabled: boolean;
  waitlistMode: (typeof waitlistModeOptions)[number];
  waitlistCutoffMinutes: string;
  waitlistClaimMinutes: string;
  waitlistMax: string;
  allowGuests: boolean;
  allowRecurringReservations: boolean;
  partnerSync: (typeof partnerOptions)[number];
  eligiblePlans: string[];
  reminderSchedule: (typeof reminderOptions)[number];
  noShowPolicy: (typeof noShowPolicyOptions)[number];
  notes: string;
};

export type ClassFormUpdateField = <TKey extends keyof ClassFormState>(
  key: TKey,
  value: ClassFormState[TKey],
) => void;

function getClassCategory(classItem: ClassRecord): (typeof categoryOptions)[number] {
  const normalizedName = classItem.name.toLowerCase();

  if (normalizedName.includes("yoga")) {
    return "Yoga";
  }

  if (normalizedName.includes("hiit")) {
    return "HIIT";
  }

  if (
    normalizedName.includes("spin") ||
    normalizedName.includes("cycle") ||
    classItem.format === "Cycle studio"
  ) {
    return "Cycling";
  }

  if (normalizedName.includes("dance")) {
    return "Dance";
  }

  if (
    normalizedName.includes("pilates") ||
    normalizedName.includes("mobility") ||
    classItem.format === "Recovery block"
  ) {
    return "Pilates";
  }

  if (normalizedName.includes("strength") || normalizedName.includes("crossfit")) {
    return "CrossFit";
  }

  return "HIIT";
}

function getClassRoom(format: ClassRecord["format"]) {
  if (format === "Cycle studio") {
    return "Cycle Studio";
  }

  if (format === "Mind-body studio") {
    return "Mind-Body Studio";
  }

  if (format === "Recovery block") {
    return "Recovery Suite";
  }

  if (format === "Small group training") {
    return "Strength Floor";
  }

  return "Studio A";
}

function getDurationMinutes(duration: string) {
  return duration.match(/\d+/)?.[0] ?? "45";
}

function convertTimeToInputValue(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

  if (!match) {
    return "18:00";
  }

  const [, hourToken, minute, meridiemToken] = match;
  const meridiem = meridiemToken.toUpperCase();
  let hour = Number.parseInt(hourToken, 10);

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  } else if (meridiem === "PM" && hour < 12) {
    hour += 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

function getScheduleTimes(scheduleSlots: ClassRecord["scheduleSlots"]) {
  const [firstSlot] = scheduleSlots;

  if (!firstSlot) {
    return {
      startTime: "18:00",
      endTime: "18:45",
    };
  }

  const [startLabel = "6:00 PM", endLabel = "6:45 PM"] = firstSlot.time.split(" - ");

  return {
    startTime: convertTimeToInputValue(startLabel),
    endTime: convertTimeToInputValue(endLabel),
  };
}

function getWaitlistEnabled(classItem: ClassRecord) {
  return !classItem.waitlistRules.some((rule) => rule.toLowerCase().includes("disabled"));
}

function getWaitlistMode(classItem: ClassRecord): (typeof waitlistModeOptions)[number] {
  const normalizedRules = classItem.waitlistRules.map((rule) => rule.toLowerCase());

  if (normalizedRules.some((rule) => rule.includes("manual"))) {
    return "Manual only";
  }

  if (normalizedRules.some((rule) => rule.includes("auto-promote"))) {
    return "Auto-promote";
  }

  return "Claim to join";
}

export function createClassFormState(
  branchOptions: string[],
  instructorOptions: string[],
  classItem?: ClassRecord,
): ClassFormState {
  if (classItem) {
    const scheduleTimes = getScheduleTimes(classItem.scheduleSlots);
    const selectedDays = Array.from(new Set(classItem.scheduleSlots.map((slot) => slot.day)));

    return {
      name: classItem.name,
      category: getClassCategory(classItem),
      format: classItem.format as (typeof formatOptions)[number],
      branch: classItem.branch,
      instructor: classItem.instructor,
      room: getClassRoom(classItem.format),
      durationMinutes: getDurationMinutes(classItem.duration),
      level: "All levels",
      description: classItem.description,
      imageFile: null,
      imagePreviewUrl: defaultClassImageUrl,
      imageName: `${classItem.name} cover`,
      selectedDays: selectedDays.length ? selectedDays : ["Mon", "Thu"],
      startTime: scheduleTimes.startTime,
      endTime: scheduleTimes.endTime,
      startDate: "2026-03-30",
      endDate: "",
      visibility:
        classItem.status === "Draft" ? "Staff only until publish" : "Members and staff",
      bookingOpenDays: "14",
      bookingCloseMinutes: "60",
      cancellationCutoffMinutes: "120",
      capacity: String(classItem.capacity),
      heldSeats: classItem.status === "Waitlist" ? "4" : "2",
      partnerInventory: classItem.status === "Waitlist" ? "4" : "2",
      waitlistEnabled: getWaitlistEnabled(classItem),
      waitlistMode: getWaitlistMode(classItem),
      waitlistCutoffMinutes: "45",
      waitlistClaimMinutes: "15",
      waitlistMax: "10",
      allowGuests: !classItem.waitlistRules.some((rule) =>
        rule.toLowerCase().includes("guests are not allowed"),
      ),
      allowRecurringReservations: classItem.capacityRules.some((rule) =>
        rule.toLowerCase().includes("recurring"),
      ),
      partnerSync: "Sync to Wellhub / Gympass",
      eligiblePlans:
        classItem.format === "Cycle studio"
          ? ["Unlimited access", "Corporate Plus"]
          : ["Unlimited access", "Studio pack"],
      reminderSchedule: "24 hours and 2 hours before",
      noShowPolicy:
        classItem.status === "Draft" ? "Warn only" : "Apply strike after no-show",
      notes: classItem.watchlist.join(" "),
    };
  }

  return {
    name: "",
    category: "HIIT",
    format: "Studio class",
    branch: branchOptions[0] ?? "Victoria Island",
    instructor: instructorOptions[0] ?? "Coach Timi",
    room: "Studio A",
    durationMinutes: "45",
    level: "All levels",
    description: "",
    imageFile: null,
    imagePreviewUrl: "",
    imageName: "",
    selectedDays: ["Mon", "Thu"],
    startTime: "18:00",
    endTime: "18:45",
    startDate: "2026-03-30",
    endDate: "",
    visibility: "Members and staff",
    bookingOpenDays: "14",
    bookingCloseMinutes: "60",
    cancellationCutoffMinutes: "120",
    capacity: "18",
    heldSeats: "2",
    partnerInventory: "4",
    waitlistEnabled: true,
    waitlistMode: "Claim to join",
    waitlistCutoffMinutes: "45",
    waitlistClaimMinutes: "15",
    waitlistMax: "10",
    allowGuests: false,
    allowRecurringReservations: true,
    partnerSync: "Sync to Wellhub / Gympass",
    eligiblePlans: ["Unlimited access", "Studio pack"],
    reminderSchedule: "24 hours and 2 hours before",
    noShowPolicy: "Apply strike after no-show",
    notes: "",
  };
}

export function Field({
  id,
  label,
  required = false,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
        {required ? <span className="ml-1 text-text-danger">*</span> : null}
      </span>
      {children}
    </label>
  );
}

export function SelectionCard({
  checked,
  label,
  detail,
  onChange,
}: {
  checked: boolean;
  label: string;
  detail: string;
  onChange: () => void;
}) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer gap-3 rounded-[20px] border px-4 py-4 transition-colors",
        checked
          ? "border-border-brand bg-bg-brand-soft/45"
          : "border-border-soft bg-bg-muted hover:border-border-strong",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border border-border-strong"
      />
      <div>
        <p className="text-[14px] font-semibold text-text-primary">{label}</p>
        <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">{detail}</p>
      </div>
    </label>
  );
}

export function ToggleCard({
  checked,
  title,
  detail,
  onChange,
}: {
  checked: boolean;
  title: string;
  detail: string;
  onChange: () => void;
}) {
  return (
    <label
      className={clsx(
        "flex cursor-pointer items-start gap-3 rounded-[20px] border px-4 py-4 transition-colors",
        checked
          ? "border-border-brand bg-bg-brand-soft/45"
          : "border-border-soft bg-bg-muted hover:border-border-strong",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="mt-1 h-4 w-4 rounded border border-border-strong"
      />
      <div>
        <p className="text-[14px] font-semibold text-text-primary">{title}</p>
        <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">{detail}</p>
      </div>
    </label>
  );
}
