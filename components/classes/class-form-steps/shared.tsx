import clsx from "clsx";
import type { ReactNode } from "react";

export const inputClassName =
  "h-11 w-full rounded-xl border border-border-soft bg-bg-input px-4 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";
export const textAreaClassName =
  "min-h-[112px] w-full rounded-xl border border-border-soft bg-bg-input px-4 py-3 text-[14px] text-text-primary outline-none transition-shadow focus:border-border-strong focus:ring-2 focus:ring-[rgba(64,84,232,0.12)]";

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

export function createClassFormState(
  branchOptions: string[],
  instructorOptions: string[],
): ClassFormState {
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
