"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OverviewCard, Panel, SegmentedTabs, Select, type SelectOption } from "@/components/ui";
import type { ClassRecord } from "./data";
import {
  classes,
  classFilters,
  defaultSelectedClassId,
  mobileScheduleDays,
  scheduleDays,
  scheduleTimes,
  weeklySlots,
} from "./data";
import { ClassListTable } from "./organisms/classListTable";

const SCHEDULE_ROW_HEIGHT = 92;

type DayGridItem =
  | {
      type: "empty";
      key: string;
      rowSpan: number;
    }
  | {
      type: "slot";
      key: string;
      slot: (typeof weeklySlots)[number];
    };

function buildDayGridItems(day: (typeof scheduleDays)[number]): DayGridItem[] {
  const slots = weeklySlots
    .filter((slot) => slot.day === day)
    .sort((left, right) => left.rowStart - right.rowStart);
  const items: DayGridItem[] = [];
  let rowCursor = 1;

  slots.forEach((slot) => {
    if (slot.rowStart > rowCursor) {
      items.push({
        type: "empty",
        key: `${day}-empty-${rowCursor}`,
        rowSpan: slot.rowStart - rowCursor,
      });
    }

    items.push({
      type: "slot",
      key: slot.id,
      slot,
    });

    rowCursor = slot.rowStart + slot.rowSpan;
  });

  if (rowCursor <= scheduleTimes.length) {
    items.push({
      type: "empty",
      key: `${day}-empty-${rowCursor}`,
      rowSpan: scheduleTimes.length - rowCursor + 1,
    });
  }

  return items;
}

type ActionButtonProps = {
  children: ReactNode;
  primary?: boolean;
  active?: boolean;
  onClick?: () => void;
};

function ActionButton({
  children,
  primary = false,
  active = false,
  onClick,
}: ActionButtonProps) {
  const className = clsx(
    "inline-flex items-center rounded-xl border font-semibold transition-colors",
    "h-11 px-4 text-[13px]",
    primary
      ? "border-transparent bg-bg-brand-strong text-text-inverse"
      : active
        ? "border-border-brand bg-bg-brand-soft/45 text-text-brand"
        : "border-border-soft bg-bg-surface text-text-primary hover:border-border-strong",
  );

  return (
    <button type="button" className={className} onClick={onClick}>
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  options,
}: {
  label: string;
  options: readonly string[];
}) {
  const selectOptions: SelectOption[] = options.map((option) => ({
    value: option,
    label: option,
  }));

  return (
    <label className="flex min-w-[160px] flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
        {label}
      </span>
      <Select
        id={`classes-filter-${label.toLowerCase().replace(/\s+/g, "-")}`}
        options={selectOptions}
        value={options[0] ?? ""}
        onChange={() => {}}
      />
    </label>
  );
}

function DesktopScheduleGrid({
  activeClassName,
  onViewClass,
}: {
  activeClassName: string;
  onViewClass: (className: string) => void;
}) {
  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-[72px_repeat(7,minmax(0,1fr))] gap-2">
        <div />
        {scheduleDays.map((day) => (
          <div
            key={day}
            className="rounded-xl border border-border-subtle bg-bg-muted px-3 py-2 text-center text-[12px] font-semibold uppercase tracking-[0.08em] text-text-subtle"
          >
            {day}
          </div>
        ))}

        <div className="space-y-2">
          {scheduleTimes.map((time) => (
            <div
              key={time}
              className="flex items-start justify-end pr-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-subtle"
              style={{ height: `${SCHEDULE_ROW_HEIGHT}px` }}
            >
              {time}
            </div>
          ))}
        </div>

        <div className="col-span-7 grid grid-cols-7 gap-2">
          {scheduleDays.map((day) => {
            const items = buildDayGridItems(day);

            return (
              <div
                key={day}
                className="grid gap-2"
                style={{ gridTemplateRows: `repeat(${scheduleTimes.length}, minmax(0, ${SCHEDULE_ROW_HEIGHT}px))` }}
              >
                {items.map((item) => {
                  if (item.type === "empty") {
                    return (
                      <div
                        key={item.key}
                        className="rounded-2xl border border-border-subtle bg-bg-muted/65"
                        style={{ gridRow: `span ${item.rowSpan}` }}
                      />
                    );
                  }

                  const { slot } = item;
                  const active = slot.className === activeClassName;

                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => onViewClass(slot.className)}
                      className={clsx(
                        "rounded-2xl border px-3 py-3 text-left shadow-[var(--shadow-card)] transition-transform hover:scale-[1.01]",
                        slot.tone === "danger" &&
                          "border-transparent bg-bg-danger-soft text-text-danger",
                        slot.tone === "warning" &&
                          "border-transparent bg-bg-warning-soft text-text-warning",
                        slot.tone === "success" &&
                          "border-transparent bg-bg-success-soft text-text-success",
                        slot.tone === "brand" &&
                          "border-transparent bg-bg-brand-soft text-text-brand",
                        slot.tone === "neutral" &&
                          "border border-border-soft bg-bg-surface text-text-secondary",
                        active && "border-border-brand shadow-[var(--shadow-card)]",
                      )}
                      style={{ gridRow: `span ${slot.rowSpan}` }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold">
                            {slot.className}
                          </p>
                          <p className="mt-1 truncate text-[11px] leading-[1.4] opacity-90">
                            {slot.instructor}
                          </p>
                          <p className="mt-2 truncate text-[11px] font-medium opacity-90">
                            {slot.start} - {slot.end}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileScheduleList({
  activeClassName,
  onViewClass,
}: {
  activeClassName: string;
  onViewClass: (className: string) => void;
}) {
  return (
    <div className="space-y-4 lg:hidden">
      <div className="flex flex-wrap gap-2 rounded-full bg-bg-muted p-1 text-[12px] font-medium text-text-secondary">
        {mobileScheduleDays.map((day, index) => (
          <span
            key={day.day}
            className={clsx(
              "rounded-full px-4 py-2",
              index === 0 && "bg-bg-surface text-text-primary shadow-[var(--shadow-card)]",
            )}
          >
            {day.day}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        {mobileScheduleDays[0].slots.map((slot) => {
          const active = slot.className === activeClassName;

          return (
            <button
              key={`${slot.className}-${slot.time}`}
              type="button"
              onClick={() => onViewClass(slot.className)}
              className={clsx(
                "w-full rounded-2xl border px-4 py-4 text-left",
                active
                  ? "border-border-brand bg-bg-brand-soft/30"
                  : "border-border-subtle bg-bg-muted",
              )}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-text-primary">
                  {slot.className}
                </p>
                <p className="mt-1 truncate text-[13px] text-text-secondary">
                  {slot.instructor}
                </p>
                <p className="mt-3 truncate text-[13px] text-text-secondary">
                  {slot.time}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

type ClassesTab = "all-classes" | "weekly-schedule";

function getClassesTab(value: string | null): ClassesTab {
  return value === "weekly-schedule" ? "weekly-schedule" : "all-classes";
}

function getLifecycleLabel(classItem: ClassRecord) {
  return classItem.status === "Inactive" || classItem.status === "Draft"
    ? "Inactive"
    : "Active";
}

export function ClassesPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = getClassesTab(searchParams.get("tab"));
  const [activeClassId, setActiveClassId] = useState(defaultSelectedClassId);
  const [classRows, setClassRows] = useState<ClassRecord[]>(classes);
  const lifecycleOverview = [
    {
      label: "Active",
      value: String(
        classRows.filter((classItem) => getLifecycleLabel(classItem) === "Active").length,
      ),
    },
    {
      label: "Inactive",
      value: String(
        classRows.filter((classItem) => getLifecycleLabel(classItem) === "Inactive").length,
      ),
    },
  ];

  const selectedClass =
    classRows.find((item) => item.id === activeClassId) ?? classRows[0] ?? classes[0];

  const handleTabChange = (tab: ClassesTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openClassByName = (className: string) => {
    const matchedClass = classRows.find((item) => item.name === className);

    if (matchedClass) {
      setActiveClassId(matchedClass.id);
      router.push(`/classes/${matchedClass.id}`);
    }
  };

  const handleDeactivateClass = (classItem: ClassRecord) => {
    setClassRows((currentRows) =>
      currentRows.map((row) =>
        row.id === classItem.id
          ? {
              ...row,
              status: "Inactive",
              tone: "neutral",
            }
          : row,
      ),
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-4 md:grid-cols-2">
        {lifecycleOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <section className="space-y-4">
        <SegmentedTabs
          ariaLabel="Class sections"
          items={[
            {
              label: "All classes",
              active: activeTab === "all-classes",
              onClick: () => handleTabChange("all-classes"),
            },
            {
              label: "Weekly schedule",
              active: activeTab === "weekly-schedule",
              onClick: () => handleTabChange("weekly-schedule"),
            },
          ]}
        />

        {activeTab === "all-classes" ? (
          <ClassListTable
            classes={classRows}
            onViewDetails={(classItem) => router.push(`/classes/${classItem.id}`)}
            onEditClass={(classItem) => router.push(`/classes/${classItem.id}/edit`)}
            onDeactivateClass={handleDeactivateClass}
          />
        ) : (
          <Panel
            eyebrow="Weekly schedule"
            title="Calendar view"
            description="Use the schedule to scan class timing across the week without overloading the list view."
            action={
              <Link
                href="/classes/new"
                className="inline-flex h-[49px] items-center rounded-full bg-brand-primary px-5 text-[14px] font-medium text-text-inverse transition-colors hover:bg-brand-primary-hover"
              >
                Create class
              </Link>
            }
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-end xl:justify-between">
                <div className="flex flex-wrap gap-2">
                  <ActionButton>Today</ActionButton>
                  <ActionButton>Mar 16 - Mar 22</ActionButton>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <FilterSelect label="Instructor" options={classFilters.instructor} />
                  <FilterSelect label="Branch" options={classFilters.branch} />
                </div>
              </div>

              <DesktopScheduleGrid
                activeClassName={selectedClass.name}
                onViewClass={openClassByName}
              />
              <MobileScheduleList
                activeClassName={selectedClass.name}
                onViewClass={openClassByName}
              />
            </div>
          </Panel>
        )}
      </section>
    </div>
  );
}
