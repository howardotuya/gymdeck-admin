"use client";

import { create } from "zustand";

export type TimelineScopePreset =
  | "today"
  | "this-week"
  | "this-month"
  | "this-year"
  | "all-time"
  | "custom";

export type TimelineCustomRange = {
  startDate: string;
  endDate: string;
};

export type TimelineScopeState = {
  preset: TimelineScopePreset;
  customRange: TimelineCustomRange;
};

type TimelineScopeStore = {
  timelineScope: TimelineScopeState;
  setTimelinePreset: (preset: Exclude<TimelineScopePreset, "custom">) => void;
  setCustomRange: (customRange: TimelineCustomRange) => void;
  resetTimelineScope: () => void;
};

export const defaultTimelineScope: TimelineScopeState = {
  preset: "this-month",
  customRange: {
    startDate: "",
    endDate: "",
  },
};

export const timelinePresetOptions: Array<{
  id: Exclude<TimelineScopePreset, "custom">;
  label: string;
}> = [
  { id: "today", label: "Today" },
  { id: "this-week", label: "This week" },
  { id: "this-month", label: "This month" },
  { id: "this-year", label: "This year" },
  { id: "all-time", label: "All time" },
];

const presetLabelMap: Record<Exclude<TimelineScopePreset, "custom">, string> = {
  today: "Today",
  "this-week": "This week",
  "this-month": "This month",
  "this-year": "This year",
  "all-time": "All time",
};

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

const longDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function parseIsoDateInput(value: string, endBoundary = false) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(
    year,
    month - 1,
    day,
    endBoundary ? 23 : 0,
    endBoundary ? 59 : 0,
    endBoundary ? 59 : 0,
    endBoundary ? 999 : 0,
  );
}

function getWeekStart(referenceDate: Date) {
  const normalizedDate = startOfDay(referenceDate);
  const day = normalizedDate.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  normalizedDate.setDate(normalizedDate.getDate() + difference);

  return normalizedDate;
}

function getMonthStart(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
}

function getMonthEnd(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0, 23, 59, 59, 999);
}

function getYearStart(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), 0, 1);
}

function getYearEnd(referenceDate: Date) {
  return new Date(referenceDate.getFullYear(), 11, 31, 23, 59, 59, 999);
}

function formatDateRange(startDate: Date | null, endDate: Date | null) {
  if (!startDate && !endDate) {
    return "All recorded dates";
  }

  if (startDate && !endDate) {
    return `${longDateFormatter.format(startDate)} onward`;
  }

  if (!startDate && endDate) {
    return `Up to ${longDateFormatter.format(endDate)}`;
  }

  if (!startDate || !endDate) {
    return "Custom range";
  }

  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    return longDateFormatter.format(startDate);
  }

  return `${shortDateFormatter.format(startDate)} - ${longDateFormatter.format(endDate)}`;
}

export function parseTimelineDateInput(value: Date | string | null | undefined) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

export function isTimelineCustomRangeValid(customRange: TimelineCustomRange) {
  if (!customRange.startDate || !customRange.endDate) {
    return false;
  }

  return customRange.startDate <= customRange.endDate;
}

export function resolveTimelineDateRange(
  timelineScope: TimelineScopeState,
  referenceDate = new Date(),
) {
  const normalizedReferenceDate = new Date(referenceDate);

  switch (timelineScope.preset) {
    case "today":
      return {
        startDate: startOfDay(normalizedReferenceDate),
        endDate: endOfDay(normalizedReferenceDate),
      };
    case "this-week": {
      const startDate = getWeekStart(normalizedReferenceDate);
      const endDate = endOfDay(new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 6));

      return { startDate, endDate };
    }
    case "this-month":
      return {
        startDate: getMonthStart(normalizedReferenceDate),
        endDate: getMonthEnd(normalizedReferenceDate),
      };
    case "this-year":
      return {
        startDate: getYearStart(normalizedReferenceDate),
        endDate: getYearEnd(normalizedReferenceDate),
      };
    case "custom":
      return {
        startDate: parseIsoDateInput(timelineScope.customRange.startDate),
        endDate: parseIsoDateInput(timelineScope.customRange.endDate, true),
      };
    case "all-time":
    default:
      return {
        startDate: null,
        endDate: null,
      };
  }
}

export function getTimelineScopeLabel(
  timelineScope: TimelineScopeState,
  referenceDate = new Date(),
) {
  if (timelineScope.preset !== "custom") {
    return presetLabelMap[timelineScope.preset];
  }

  const { startDate, endDate } = resolveTimelineDateRange(timelineScope, referenceDate);

  return formatDateRange(startDate, endDate);
}

export function getTimelineScopeDescription(
  timelineScope: TimelineScopeState,
  referenceDate = new Date(),
) {
  const { startDate, endDate } = resolveTimelineDateRange(timelineScope, referenceDate);

  return formatDateRange(startDate, endDate);
}

export function matchesTimelineDate(
  value: Date | string | null | undefined,
  timelineScope: TimelineScopeState,
  referenceDate = new Date(),
) {
  const parsedDate = parseTimelineDateInput(value);

  if (!parsedDate) {
    return false;
  }

  const { startDate, endDate } = resolveTimelineDateRange(timelineScope, referenceDate);

  if (startDate && parsedDate < startDate) {
    return false;
  }

  if (endDate && parsedDate > endDate) {
    return false;
  }

  return true;
}

export const useTimelineScopeStore = create<TimelineScopeStore>((set) => ({
  timelineScope: defaultTimelineScope,
  setTimelinePreset: (preset) =>
    set((state) => ({
      timelineScope: {
        ...state.timelineScope,
        preset,
      },
    })),
  setCustomRange: (customRange) =>
    set({
      timelineScope: {
        preset: "custom",
        customRange,
      },
    }),
  resetTimelineScope: () =>
    set({
      timelineScope: defaultTimelineScope,
    }),
}));
