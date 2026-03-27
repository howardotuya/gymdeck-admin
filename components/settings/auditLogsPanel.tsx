"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { FormSectionCard, StatusBadge } from "@/components/ui";
import {
  Field,
  inputClassName,
  primaryActionClassName,
  secondaryActionClassName,
} from "./shared";
import type { AuditLogEvent } from "./types";
import type { StatusTone } from "@/components/ui";

type AuditLogsPanelProps = {
  events: AuditLogEvent[];
};

type AuditLogFilterState = {
  keyword: string;
  actorName: string;
  action: string;
  branch: string;
  outcome: "all" | AuditLogEvent["outcome"];
  dateFrom: string;
  dateTo: string;
};

const defaultFilters: AuditLogFilterState = {
  keyword: "",
  actorName: "all",
  action: "all",
  branch: "all",
  outcome: "all",
  dateFrom: "",
  dateTo: "",
};

const timestampFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Africa/Lagos",
});

function formatAuditTimestamp(timestamp: string) {
  const parsedDate = new Date(timestamp);

  if (Number.isNaN(parsedDate.getTime())) {
    return timestamp;
  }

  return `${timestampFormatter.format(parsedDate)} WAT`;
}

function getOutcomeTone(outcome: AuditLogEvent["outcome"]): StatusTone {
  if (outcome === "success") {
    return "success";
  }

  if (outcome === "warning") {
    return "warning";
  }

  return "danger";
}

function getBranchLabel(event: AuditLogEvent) {
  return event.branchLabel ?? "All branches";
}

function filterEvents(events: AuditLogEvent[], filters: AuditLogFilterState) {
  return events.filter((event) => {
    const normalizedKeyword = filters.keyword.trim().toLowerCase();
    const eventDate = event.timestamp.slice(0, 10);

    if (normalizedKeyword) {
      const searchableText = [
        event.actorName,
        event.actorEmail,
        event.action,
        event.targetLabel,
        event.summary,
        event.branchLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      if (!searchableText.includes(normalizedKeyword)) {
        return false;
      }
    }

    if (filters.actorName !== "all" && event.actorName !== filters.actorName) {
      return false;
    }

    if (filters.action !== "all" && event.action !== filters.action) {
      return false;
    }

    if (filters.branch !== "all" && getBranchLabel(event) !== filters.branch) {
      return false;
    }

    if (filters.outcome !== "all" && event.outcome !== filters.outcome) {
      return false;
    }

    if (filters.dateFrom && eventDate < filters.dateFrom) {
      return false;
    }

    if (filters.dateTo && eventDate > filters.dateTo) {
      return false;
    }

    return true;
  });
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-input px-4 py-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
        {label}
      </p>
      <p className="mt-2 text-[14px] text-text-primary">{value}</p>
    </div>
  );
}

export function AuditLogsPanel({ events }: AuditLogsPanelProps) {
  const actorOptions = Array.from(new Set(events.map((event) => event.actorName)));
  const actionOptions = Array.from(new Set(events.map((event) => event.action)));
  const branchOptions = Array.from(new Set(events.map(getBranchLabel)));
  const [draftFilters, setDraftFilters] = useState<AuditLogFilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<AuditLogFilterState>(defaultFilters);
  const initialFilteredEvents = filterEvents(events, defaultFilters);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    initialFilteredEvents[0]?.id ?? null,
  );

  const filteredEvents = filterEvents(events, appliedFilters);
  const selectedEvent =
    filteredEvents.find((event) => event.id === selectedEventId) ?? filteredEvents[0] ?? null;

  const updateDraftField = <TKey extends keyof AuditLogFilterState>(
    key: TKey,
    value: AuditLogFilterState[TKey],
  ) => {
    setDraftFilters((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleApplyFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEvents = filterEvents(events, draftFilters);
    setAppliedFilters(draftFilters);
    setSelectedEventId(nextEvents[0]?.id ?? null);
  };

  const handleResetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSelectedEventId(events[0]?.id ?? null);
  };

  const handleExport = () => {
    toast.success("Audit export queued.");
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleApplyFilters}>
        <FormSectionCard
          title="Filters"
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExport}
                className={secondaryActionClassName}
              >
                Export CSV
              </button>
              <button
                type="button"
                onClick={handleResetFilters}
                className={secondaryActionClassName}
              >
                Reset
              </button>
              <button type="submit" className={primaryActionClassName}>
                Apply
              </button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field id="settings-audit-keyword" label="Keyword">
              <input
                id="settings-audit-keyword"
                value={draftFilters.keyword}
                onChange={(event) => updateDraftField("keyword", event.target.value)}
                className={inputClassName}
                placeholder="Search logs"
              />
            </Field>

            <Field id="settings-audit-actor" label="Actor">
              <select
                id="settings-audit-actor"
                value={draftFilters.actorName}
                onChange={(event) => updateDraftField("actorName", event.target.value)}
                className={inputClassName}
              >
                <option value="all">All actors</option>
                {actorOptions.map((actorName) => (
                  <option key={actorName} value={actorName}>
                    {actorName}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="settings-audit-action" label="Action">
              <select
                id="settings-audit-action"
                value={draftFilters.action}
                onChange={(event) => updateDraftField("action", event.target.value)}
                className={inputClassName}
              >
                <option value="all">All actions</option>
                {actionOptions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="settings-audit-branch" label="Branches">
              <select
                id="settings-audit-branch"
                value={draftFilters.branch}
                onChange={(event) => updateDraftField("branch", event.target.value)}
                className={inputClassName}
              >
                <option value="all">All branches</option>
                {branchOptions.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="settings-audit-date-from" label="From">
              <input
                id="settings-audit-date-from"
                type="date"
                value={draftFilters.dateFrom}
                onChange={(event) => updateDraftField("dateFrom", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-audit-date-to" label="To">
              <input
                id="settings-audit-date-to"
                type="date"
                value={draftFilters.dateTo}
                onChange={(event) => updateDraftField("dateTo", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field id="settings-audit-outcome" label="Outcome">
              <select
                id="settings-audit-outcome"
                value={draftFilters.outcome}
                onChange={(event) =>
                  updateDraftField(
                    "outcome",
                    event.target.value as AuditLogFilterState["outcome"],
                  )
                }
                className={inputClassName}
              >
                <option value="all">All outcomes</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="failed">Failed</option>
              </select>
            </Field>
          </div>
        </FormSectionCard>
      </form>

      <FormSectionCard title="Events">
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full border-separate border-spacing-0 overflow-hidden rounded-[20px] border border-border-soft">
            <thead>
              <tr className="bg-bg-muted text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Actor
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Action
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Target
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  Outcome
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length ? (
                filteredEvents.map((event) => (
                  <tr key={event.id} className="border-t border-border-soft">
                    <td className="border-t border-border-soft px-4 py-4 text-[14px] text-text-secondary">
                      {formatAuditTimestamp(event.timestamp)}
                    </td>
                    <td className="border-t border-border-soft px-4 py-4">
                      <p className="text-[14px] font-medium text-text-primary">{event.actorName}</p>
                      {event.actorEmail ? (
                        <p className="mt-1 text-[12px] text-text-secondary">{event.actorEmail}</p>
                      ) : null}
                    </td>
                    <td className="border-t border-border-soft px-4 py-4 text-[14px] text-text-primary">
                      {event.action}
                    </td>
                    <td className="border-t border-border-soft px-4 py-4">
                      <p className="text-[14px] text-text-primary">{event.targetLabel}</p>
                      <p className="mt-1 text-[12px] text-text-secondary">
                        {getBranchLabel(event)}
                      </p>
                    </td>
                    <td className="border-t border-border-soft px-4 py-4">
                      <StatusBadge label={event.outcome} tone={getOutcomeTone(event.outcome)} />
                    </td>
                    <td className="border-t border-border-soft px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedEventId(event.id)}
                        className={secondaryActionClassName}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="border-t border-border-soft px-4 py-10 text-center text-[14px] text-text-secondary"
                  >
                    No events match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </FormSectionCard>

      {selectedEvent ? (
        <FormSectionCard title="Event">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <DetailItem label="ID" value={selectedEvent.id} />
            <DetailItem
              label="Timestamp"
              value={formatAuditTimestamp(selectedEvent.timestamp)}
            />
            <DetailItem label="Actor" value={selectedEvent.actorName} />
            <DetailItem label="Action" value={selectedEvent.action} />
            <DetailItem label="Target" value={selectedEvent.targetLabel} />
            <DetailItem label="Branches" value={getBranchLabel(selectedEvent)} />
            <DetailItem label="Source" value={selectedEvent.source.toUpperCase()} />
            <DetailItem
              label="Auth"
              value={selectedEvent.authMethod ?? "Unknown"}
            />
            <DetailItem
              label="Changed fields"
              value={selectedEvent.changedFields?.join(", ") ?? "None"}
            />
          </div>
        </FormSectionCard>
      ) : null}
    </div>
  );
}
