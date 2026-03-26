"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { OverviewCard, Panel, StatusBadge } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./branch-form-steps/shared";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type {
  BranchClassAssignment,
  BranchDetail,
  BranchScheduledSession,
} from "./types";

type BranchSchedulePageProps = {
  branch: BranchDetail;
};

function cloneClassTypes(items: BranchClassAssignment[]) {
  return items.map((item) => ({ ...item }));
}

function cloneSessions(items: BranchScheduledSession[]) {
  return items.map((item) => ({ ...item }));
}

function sortClassTypes(items: BranchClassAssignment[]) {
  return [...items].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export function BranchSchedulePage({ branch }: BranchSchedulePageProps) {
  const [scheduleSource, setScheduleSource] = useState(branch.programming.scheduleSource);
  const [classTypes, setClassTypes] = useState<BranchClassAssignment[]>(() =>
    sortClassTypes(cloneClassTypes(branch.programming.classTypes)),
  );
  const [sessions, setSessions] = useState<BranchScheduledSession[]>(() =>
    cloneSessions(branch.programming.sessions),
  );

  const isDirty = useMemo(
    () =>
      scheduleSource !== branch.programming.scheduleSource ||
      JSON.stringify(classTypes) !== JSON.stringify(sortClassTypes(branch.programming.classTypes)) ||
      JSON.stringify(sessions) !== JSON.stringify(branch.programming.sessions),
    [branch.programming.classTypes, branch.programming.scheduleSource, branch.programming.sessions, classTypes, scheduleSource, sessions],
  );

  const visibleClasses = classTypes.filter((gymClass) => gymClass.visible !== false);
  const openSessions = sessions.filter((session) => session.bookingState === "open").length;

  const resetChanges = () => {
    setScheduleSource(branch.programming.scheduleSource);
    setClassTypes(sortClassTypes(cloneClassTypes(branch.programming.classTypes)));
    setSessions(cloneSessions(branch.programming.sessions));
  };

  const handleSave = () => {
    toast.success(`${branch.name} schedule changes are staged for review.`);
  };

  const updateClassType = (classId: string, patch: Partial<BranchClassAssignment>) => {
    setClassTypes((currentTypes) =>
      currentTypes.map((gymClass) =>
        gymClass.id === classId ? { ...gymClass, ...patch } : gymClass,
      ),
    );
  };

  const moveClassType = (classId: string, direction: "up" | "down") => {
    setClassTypes((currentTypes) => {
      const currentIndex = currentTypes.findIndex((gymClass) => gymClass.id === classId);

      if (currentIndex < 0) {
        return currentTypes;
      }

      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= currentTypes.length) {
        return currentTypes;
      }

      const nextTypes = [...currentTypes];
      const [movedClass] = nextTypes.splice(currentIndex, 1);
      nextTypes.splice(targetIndex, 0, movedClass);

      return nextTypes.map((gymClass, index) => ({
        ...gymClass,
        displayOrder: index + 1,
      }));
    });
  };

  const updateSession = (sessionId: string, patch: Partial<BranchScheduledSession>) => {
    setSessions((currentSessions) =>
      currentSessions.map((session) =>
        session.id === sessionId ? { ...session, ...patch } : session,
      ),
    );
  };

  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection="schedule"
      pageLabel="Schedule"
      description="Manage public class visibility, timetable sessions, and how the branch schedule is presented to members."
      action={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <StatusBadge
            label={scheduleSource === "local" ? "Local schedule" : "Central schedule"}
            tone={scheduleSource === "local" ? "brand" : "neutral"}
          />
          <button
            type="button"
            onClick={resetChanges}
            disabled={!isDirty}
            className={clsx(secondaryActionClassName, !isDirty && "opacity-60")}
          >
            Reset changes
          </button>
          <button type="button" onClick={handleSave} className={primaryActionClassName}>
            Save schedule
          </button>
        </div>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          label="Visible classes"
          value={visibleClasses.length.toString()}
          detail="Class types currently public-facing"
        />
        <OverviewCard
          label="Weekly sessions"
          value={sessions.length.toString()}
          detail="Mock timetable sessions attached to the branch"
        />
        <OverviewCard
          label="Open sessions"
          value={openSessions.toString()}
          detail="Sessions currently marked bookable"
        />
        <OverviewCard
          label="Schedule source"
          value={scheduleSource === "local" ? "Local" : "Central"}
          detail="How the branch timetable is currently managed"
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <div className="space-y-4">
          <Panel
            eyebrow="Schedule source"
            title="Timetable ownership"
            description="Choose whether this branch manages its own schedule or inherits from a centralized source."
          >
            <div className="flex flex-wrap gap-3">
              {[
                ["local", "Local branch schedule"],
                ["central", "Centralized schedule"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScheduleSource(value as "local" | "central")}
                  className={clsx(
                    secondaryActionClassName,
                    scheduleSource === value && "border-border-brand text-text-brand",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Class types"
            title="Public class visibility"
            description="Order class categories the way members should see them and hide formats that should not appear publicly."
          >
            <div className="space-y-4">
              {classTypes.map((gymClass) => (
                <div
                  key={gymClass.id}
                  className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge
                      label={gymClass.visible === false ? "Hidden" : "Visible"}
                      tone={gymClass.visible === false ? "warning" : "success"}
                    />
                    <StatusBadge label={gymClass.category} tone="neutral" />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
                    <Field id={`class-name-${gymClass.id}`} label="Class name">
                      <input
                        id={`class-name-${gymClass.id}`}
                        value={gymClass.name}
                        onChange={(event) =>
                          updateClassType(gymClass.id, { name: event.target.value })
                        }
                        className={inputClassName}
                      />
                    </Field>

                    <Field id={`class-category-${gymClass.id}`} label="Category">
                      <input
                        id={`class-category-${gymClass.id}`}
                        value={gymClass.category}
                        onChange={(event) =>
                          updateClassType(gymClass.id, { category: event.target.value })
                        }
                        className={inputClassName}
                      />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <Field id={`class-coach-${gymClass.id}`} label="Coach highlight">
                      <input
                        id={`class-coach-${gymClass.id}`}
                        value={gymClass.coachHighlight ?? ""}
                        onChange={(event) =>
                          updateClassType(gymClass.id, { coachHighlight: event.target.value })
                        }
                        className={inputClassName}
                        placeholder="What members should expect from this coached format"
                      />
                    </Field>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        updateClassType(gymClass.id, { visible: gymClass.visible === false })
                      }
                      className={secondaryActionClassName}
                    >
                      {gymClass.visible === false ? "Show class" : "Hide class"}
                    </button>
                    <button
                      type="button"
                      onClick={() => moveClassType(gymClass.id, "up")}
                      className={secondaryActionClassName}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveClassType(gymClass.id, "down")}
                      className={secondaryActionClassName}
                    >
                      Move down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            eyebrow="Sessions"
            title="Public timetable"
            description="Edit the branch’s renderable session list so the schedule tab has real session data to show."
          >
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-[24px] border border-border-soft bg-bg-muted p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge label={session.weekday} tone="neutral" />
                    <StatusBadge label={session.bookingState} tone={session.bookingState === "open" ? "success" : session.bookingState === "waitlist" ? "warning" : "neutral"} />
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Field id={`session-title-${session.id}`} label="Session title">
                      <input
                        id={`session-title-${session.id}`}
                        value={session.title}
                        onChange={(event) => updateSession(session.id, { title: event.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field id={`session-start-${session.id}`} label="Start">
                      <input
                        id={`session-start-${session.id}`}
                        value={session.startTime}
                        onChange={(event) => updateSession(session.id, { startTime: event.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field id={`session-end-${session.id}`} label="End">
                      <input
                        id={`session-end-${session.id}`}
                        value={session.endTime}
                        onChange={(event) => updateSession(session.id, { endTime: event.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field id={`session-state-${session.id}`} label="Booking state">
                      <select
                        id={`session-state-${session.id}`}
                        value={session.bookingState}
                        onChange={(event) =>
                          updateSession(session.id, {
                            bookingState: event.target.value as BranchScheduledSession["bookingState"],
                          })
                        }
                        className={inputClassName}
                      >
                        <option value="open">Open</option>
                        <option value="waitlist">Waitlist</option>
                        <option value="closed">Closed</option>
                      </select>
                    </Field>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <Field id={`session-coach-${session.id}`} label="Coach">
                      <input
                        id={`session-coach-${session.id}`}
                        value={session.coach}
                        onChange={(event) => updateSession(session.id, { coach: event.target.value })}
                        className={inputClassName}
                      />
                    </Field>
                    <Field id={`session-capacity-${session.id}`} label="Capacity">
                      <input
                        id={`session-capacity-${session.id}`}
                        value={String(session.capacity)}
                        onChange={(event) =>
                          updateSession(session.id, {
                            capacity: Number.parseInt(event.target.value || "0", 10) || 0,
                          })
                        }
                        className={inputClassName}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel
            eyebrow="Preview"
            title="This week"
            description="Approximate how the public schedule tab will summarize the branch timetable."
          >
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-[18px] border border-border-soft bg-bg-muted px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[14px] font-semibold text-text-primary">{session.title}</p>
                    <StatusBadge label={session.bookingState} tone={session.bookingState === "open" ? "success" : session.bookingState === "waitlist" ? "warning" : "neutral"} />
                  </div>
                  <p className="mt-2 text-[13px] leading-[1.65] text-text-secondary">
                    {session.weekday} • {session.startTime} - {session.endTime}
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.65] text-text-secondary">
                    {session.coach} • Capacity {session.capacity}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </BranchWorkspaceLayout>
  );
}
