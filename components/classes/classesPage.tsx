"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ClassesIcon, MembersIcon, SearchIcon } from "@/components/icons";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import {
  classes,
  classFilters,
  classOverview,
  classViewModes,
  defaultSelectedClassId,
  mobileScheduleDays,
  scheduleDays,
  scheduleTimes,
  weeklySlots,
} from "./data";

type ActionButtonProps = {
  children: ReactNode;
  primary?: boolean;
  danger?: boolean;
  active?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

function ActionButton({
  children,
  primary = false,
  danger = false,
  active = false,
  compact = false,
  onClick,
}: ActionButtonProps) {
  const className = clsx(
    "inline-flex items-center rounded-xl border font-semibold transition-colors",
    compact ? "h-9 px-3 text-[12px]" : "h-11 px-4 text-[13px]",
    primary
      ? "border-transparent bg-bg-brand-strong text-text-inverse"
      : danger
        ? "border-border-soft bg-bg-danger-soft text-text-danger"
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
  return (
    <label className="flex min-w-[160px] flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
        {label}
      </span>
      <select className="h-11 rounded-xl border border-border-soft bg-bg-surface px-4 text-[14px] text-text-primary outline-none">
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function ClassListCard({
  activeClassId,
  onViewDetails,
}: {
  activeClassId: string;
  onViewDetails: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {classes.map((item) => {
        const active = item.id === activeClassId;

        return (
          <div
            key={item.id}
            className={clsx(
              "rounded-2xl border px-4 py-4 transition-colors",
              active ? "border-border-brand bg-bg-brand-soft/35" : "border-border-subtle bg-bg-muted",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[15px] font-semibold text-text-primary">{item.name}</p>
                  <span className="rounded-full bg-bg-surface px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                    {item.id}
                  </span>
                  {active ? <StatusBadge label="Viewing" tone="brand" /> : null}
                </div>
                <p className="mt-1 text-[13px] text-text-secondary">
                  {item.instructor} • {item.branch}
                </p>
                <p className="mt-2 text-[12px] text-text-secondary">{item.format}</p>
              </div>
              <StatusBadge label={item.status} tone={item.tone} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] text-text-secondary">
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-subtle">Duration</p>
                <p className="mt-1 font-medium text-text-primary">{item.duration}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-subtle">Capacity</p>
                <p className="mt-1 font-medium text-text-primary">{item.capacity}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-subtle">Schedules</p>
                <p className="mt-1 font-medium text-text-primary">{item.activeSchedules} active</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.08em] text-text-subtle">Booked</p>
                <p className="mt-1 font-medium text-text-primary">{item.bookedSeats}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 border-t border-border-subtle pt-4">
              <ActionButton compact active={active} onClick={() => onViewDetails(item.id)}>
                {active ? "Viewing detail" : "View detail"}
              </ActionButton>
              <ActionButton compact>Edit</ActionButton>
              <ActionButton compact danger>Delete</ActionButton>
            </div>
          </div>
        );
      })}
    </div>
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
              className="flex h-[72px] items-start justify-end pr-2 pt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-text-subtle"
            >
              {time}
            </div>
          ))}
        </div>

        <div className="col-span-7 grid grid-cols-7 gap-2">
          {scheduleDays.map((day) => (
            <div key={day} className="relative grid grid-rows-8 gap-2">
              {scheduleTimes.map((time) => (
                <div
                  key={`${day}-${time}`}
                  className="h-[72px] rounded-2xl border border-border-subtle bg-bg-muted/65"
                />
              ))}

              {weeklySlots
                .filter((slot) => slot.day === day)
                .map((slot) => {
                  const active = slot.className === activeClassName;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => onViewClass(slot.className)}
                      className={clsx(
                        "absolute left-2 right-2 rounded-2xl border px-3 py-3 text-left shadow-[var(--shadow-card)] transition-transform hover:scale-[1.01]",
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
                      style={{
                        top: `${(slot.rowStart - 1) * 80 + 6}px`,
                        height: `${slot.rowSpan * 72 + (slot.rowSpan - 1) * 8 - 8}px`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[13px] font-semibold">{slot.className}</p>
                          <p className="mt-1 text-[11px] leading-[1.4] opacity-90">{slot.instructor}</p>
                        </div>
                        {active ? (
                          <span className="rounded-full bg-bg-surface/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-primary">
                            Open
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-[11px] font-medium opacity-90">
                        {slot.start} - {slot.end}
                      </p>
                      <p className="mt-1 text-[11px] opacity-90">{slot.booked}</p>
                    </button>
                  );
                })}
            </div>
          ))}
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
                active ? "border-border-brand bg-bg-brand-soft/30" : "border-border-subtle bg-bg-muted",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[14px] font-semibold text-text-primary">{slot.className}</p>
                  <p className="mt-1 text-[13px] text-text-secondary">{slot.instructor}</p>
                </div>
                <StatusBadge label={slot.booked} tone={slot.tone} />
              </div>
              <p className="mt-3 text-[13px] text-text-secondary">{slot.time}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DetailList({
  title,
  items,
  icon,
}: {
  title: string;
  items: { title: string; meta: string }[];
  icon: ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="text-text-secondary">{icon}</span>
        <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
          {title}
        </p>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={`${title}-${item.title}-${item.meta}`}
            className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-3"
          >
            <p className="text-[14px] font-semibold text-text-primary">{item.title}</p>
            <p className="mt-1 text-[13px] leading-[1.5] text-text-secondary">{item.meta}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ClassesPage() {
  const [activeClassId, setActiveClassId] = useState(defaultSelectedClassId);

  const selectedClass =
    classes.find((item) => item.id === activeClassId) ?? classes[0];

  const viewClassByName = (className: string) => {
    const matchedClass = classes.find((item) => item.name === className);

    if (matchedClass) {
      setActiveClassId(matchedClass.id);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {classOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[340px_minmax(0,1fr)_400px]">
        <Panel
          eyebrow="Class roster"
          title="All classes"
          description="Review each class and use the action row to view detail, edit the setup, or delete a draft."
          action={
            <Link
              href="/classes/new"
              className="inline-flex h-11 items-center rounded-xl border border-transparent bg-bg-brand-strong px-4 text-[13px] font-semibold text-text-inverse transition-colors"
            >
              Create class
            </Link>
          }
        >
          <div className="flex flex-col gap-4">
            <label className="flex h-11 w-full items-center gap-3 rounded-xl border border-border-soft bg-bg-surface px-4">
              <SearchIcon size={17} className="text-text-muted" />
              <input
                type="search"
                placeholder="Search class"
                className="w-full bg-transparent text-[14px] text-text-primary placeholder:text-text-subtle focus:outline-none"
              />
            </label>

            <div className="grid gap-3">
              <FilterSelect label="Instructor" options={classFilters.instructor} />
              <FilterSelect label="Status" options={classFilters.status} />
              <FilterSelect label="Branch" options={classFilters.branch} />
            </div>

            <div className="flex flex-wrap gap-2 rounded-full bg-bg-muted p-1 text-[12px] font-medium text-text-secondary">
              {classViewModes.map((mode, index) => (
                <span
                  key={mode}
                  className={clsx(
                    "rounded-full px-4 py-2",
                    index === 1 && "bg-bg-surface text-text-primary shadow-[var(--shadow-card)]",
                  )}
                >
                  {mode}
                </span>
              ))}
            </div>

            <ClassListCard activeClassId={activeClassId} onViewDetails={setActiveClassId} />
          </div>
        </Panel>

        <Panel
          eyebrow="Weekly schedule"
          title="Calendar view"
          description="Days run across the top, time runs vertically, and each class block can open the selected class detail."
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
              onViewClass={viewClassByName}
            />
            <MobileScheduleList
              activeClassName={selectedClass.name}
              onViewClass={viewClassByName}
            />
          </div>
        </Panel>

        <div className="space-y-4 xl:sticky xl:top-28 xl:self-start">
          <Panel
            eyebrow="Class detail"
            title={selectedClass.name}
            description={selectedClass.description}
            action={
              <div className="flex flex-col items-end gap-2">
                <StatusBadge label={selectedClass.status} tone={selectedClass.tone} />
                <span className="rounded-full bg-bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                  {selectedClass.id}
                </span>
              </div>
            }
          >
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <ActionButton compact active>
                  Viewing detail
                </ActionButton>
                <ActionButton compact>Edit class</ActionButton>
                <ActionButton compact danger>Delete class</ActionButton>
              </div>

              <div className="rounded-2xl border border-border-subtle bg-bg-muted p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-bg-brand-strong text-text-inverse">
                    <ClassesIcon size={18} />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-text-primary">{selectedClass.instructor}</p>
                    <p className="mt-1 text-[13px] text-text-secondary">
                      {selectedClass.branch} • {selectedClass.format}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {selectedClass.overview.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-border-subtle bg-bg-muted p-4"
                  >
                    <p className="text-[11px] uppercase tracking-[0.08em] text-text-subtle">
                      {item.label}
                    </p>
                    <p className="mt-3 text-[18px] font-semibold tracking-[-0.03em] text-text-primary">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <DetailList
                title="Schedule slots"
                icon={<ClassesIcon size={16} />}
                items={selectedClass.scheduleSlots.map((slot) => ({
                  title: `${slot.day} • ${slot.time}`,
                  meta: `${slot.seats} • ${slot.status}`,
                }))}
              />
              <DetailList
                title="Attendees"
                icon={<MembersIcon size={16} />}
                items={selectedClass.attendees}
              />
              <DetailList
                title="Recent sessions"
                icon={<ClassesIcon size={16} />}
                items={selectedClass.recentSessions}
              />

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Capacity rules
                </p>
                <div className="mt-3 space-y-2">
                  {selectedClass.capacityRules.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-3 text-[13px] leading-[1.5] text-text-secondary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Waitlist rules
                </p>
                <div className="mt-3 space-y-2">
                  {selectedClass.waitlistRules.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-3 text-[13px] leading-[1.5] text-text-secondary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Watchlist
                </p>
                <div className="mt-3 space-y-2">
                  {selectedClass.watchlist.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border-subtle bg-bg-muted px-4 py-3 text-[13px] leading-[1.5] text-text-secondary"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
