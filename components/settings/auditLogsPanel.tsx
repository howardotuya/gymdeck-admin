"use client";

import { useMemo, useState } from "react";
import { CustomTable, Modal, StatusBadge } from "@/components/ui";
import type {
  CustomTableAction,
  CustomTableColumn,
  CustomTableFilterField,
  StatusTone,
} from "@/components/ui";
import type { AuditLogEvent } from "./types";

type AuditLogsPanelProps = {
  events: AuditLogEvent[];
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

function getKeywordHaystack(event: AuditLogEvent) {
  return [
    event.actorName,
    event.actorEmail,
    event.action,
    event.targetLabel,
    event.summary,
    getBranchLabel(event),
  ]
    .filter(Boolean)
    .join(" ");
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
  const actorOptions = useMemo(() => {
    const actorMap = new Map<string, string | undefined>();

    events.forEach((event) => {
      if (!actorMap.has(event.actorName)) {
        actorMap.set(event.actorName, event.actorEmail);
      }
    });

    return Array.from(actorMap.entries())
      .map(([actorName, actorEmail]) => ({
        label: actorName,
        value: actorName,
        sublabel: actorEmail,
      }))
      .sort((left, right) => left.label.localeCompare(right.label));
  }, [events]);

  const actionOptions = useMemo(
    () =>
      Array.from(new Set(events.map((event) => event.action)))
        .sort((left, right) => left.localeCompare(right))
        .map((action) => ({
          label: action,
          value: action,
        })),
    [events],
  );

  const branchOptions = useMemo(
    () =>
      Array.from(new Set(events.map(getBranchLabel)))
        .sort((left, right) => left.localeCompare(right))
        .map((branch) => ({
          label: branch,
          value: branch,
        })),
    [events],
  );

  const filterFields = useMemo<CustomTableFilterField<AuditLogEvent>[]>(
    () => [
      {
        id: "actorName",
        label: "Actor",
        type: "select",
        options: actorOptions,
        placeholder: "All actors",
        getValue: (event) => event.actorName,
      },
      {
        id: "action",
        label: "Action",
        type: "select",
        options: actionOptions,
        placeholder: "All actions",
        getValue: (event) => event.action,
      },
      {
        id: "branch",
        label: "Branches",
        type: "select",
        options: branchOptions,
        placeholder: "All branches",
        getValue: getBranchLabel,
      },
      {
        id: "timestamp",
        label: "Timestamp",
        type: "date-range",
        startLabel: "From",
        endLabel: "To",
        getValue: (event) => event.timestamp,
      },
      {
        id: "outcome",
        label: "Outcome",
        type: "select",
        options: [
          {
            label: "Success",
            value: "success",
          },
          {
            label: "Warning",
            value: "warning",
          },
          {
            label: "Failed",
            value: "failed",
          },
        ],
        placeholder: "All outcomes",
        getValue: (event) => event.outcome,
      },
    ],
    [actionOptions, actorOptions, branchOptions],
  );

  const columns = useMemo<CustomTableColumn<AuditLogEvent>[]>(
    () => [
      {
        id: "timestamp",
        header: "Timestamp",
        accessorFn: (event) => formatAuditTimestamp(event.timestamp),
        sortAccessor: (event) => new Date(event.timestamp),
        exportAccessor: (event) => formatAuditTimestamp(event.timestamp),
        sortable: true,
        isRowHeader: true,
      },
      {
        id: "actor",
        header: "Actor",
        accessorFn: (event) => event.actorName,
        sortAccessor: (event) => event.actorName,
        exportAccessor: (event) =>
          event.actorEmail ? `${event.actorName} (${event.actorEmail})` : event.actorName,
        sortable: true,
        cell: (event) => (
          <div>
            <p className="text-[14px] font-medium text-text-primary">{event.actorName}</p>
            {event.actorEmail ? (
              <p className="mt-1 text-[12px] text-text-secondary">{event.actorEmail}</p>
            ) : null}
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        accessorKey: "action",
        sortable: true,
      },
      {
        id: "outcome",
        header: "Outcome",
        accessorKey: "outcome",
        sortAccessor: (event) => event.outcome,
        exportAccessor: (event) => event.outcome.toUpperCase(),
        sortable: true,
        cell: (event) => (
          <StatusBadge label={event.outcome} tone={getOutcomeTone(event.outcome)} />
        ),
      },
    ],
    [],
  );

  const [selectedEvent, setSelectedEvent] = useState<AuditLogEvent | null>(null);

  const rowActions = useMemo<CustomTableAction<AuditLogEvent>[]>(
    () => [
      {
        label: "View",
        onSelect: (event) => setSelectedEvent(event),
      },
    ],
    [],
  );

  return (
    <>
      <CustomTable
        title="Events"
        data={events}
        columns={columns}
        getRowId={(event) => event.id}
        getRowLabel={(event) => event.action}
        getSearchText={getKeywordHaystack}
        searchPlaceholder="Search logs"
        caption="Audit trail of settings activity, including actor, target, branch context, and event outcomes."
        filterFields={filterFields}
        exportDataBtn
        exportFileName="audit-log-events"
        queryParamPrefix="settings-audit-logs"
        rowActions={rowActions}
        rowActionsColumnLabel="Actions"
        itemLabel="events"
        emptyStateTitle="No events match these filters"
        emptyStateDescription="Adjust the audit sidebar filters to see matching activity."
        initialPageSize={5}
        pageSizeOptions={[5, 10, 20]}
        renderMobileCard={(event, { actionsMenu }) => (
          <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-[15px] font-semibold text-text-primary">{event.action}</p>
                <p className="text-[13px] text-text-secondary">
                  {formatAuditTimestamp(event.timestamp)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge label={event.outcome} tone={getOutcomeTone(event.outcome)} />
                {actionsMenu}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                  Actor
                </p>
                <p className="mt-1 text-[14px] text-text-primary">{event.actorName}</p>
                {event.actorEmail ? (
                  <p className="mt-1 text-[12px] text-text-secondary">{event.actorEmail}</p>
                ) : null}
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                  Target
                </p>
                <p className="mt-1 text-[14px] text-text-primary">{event.targetLabel}</p>
                <p className="mt-1 text-[12px] text-text-secondary">{getBranchLabel(event)}</p>
              </div>
            </div>
          </article>
        )}
      />

      {selectedEvent ? (
        <Modal
          title="Activity details"
          onClose={() => setSelectedEvent(null)}
          panelClassName="max-w-[840px]"
        >
          <div className="space-y-6">
            <div className="rounded-[20px] border border-border-soft bg-bg-muted/40 px-5 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[18px] font-semibold text-text-primary">
                    {selectedEvent.action}
                  </p>
                  <p className="mt-2 text-[14px] leading-[1.7] text-text-secondary">
                    {selectedEvent.summary}
                  </p>
                </div>
                <StatusBadge
                  label={selectedEvent.outcome}
                  tone={getOutcomeTone(selectedEvent.outcome)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <DetailItem label="ID" value={selectedEvent.id} />
              <DetailItem label="Timestamp" value={formatAuditTimestamp(selectedEvent.timestamp)} />
              <DetailItem
                label="Actor"
                value={
                  selectedEvent.actorEmail
                    ? `${selectedEvent.actorName} (${selectedEvent.actorEmail})`
                    : selectedEvent.actorName
                }
              />
              <DetailItem label="Action" value={selectedEvent.action} />
              <DetailItem label="Target" value={selectedEvent.targetLabel} />
              <DetailItem label="Branches" value={getBranchLabel(selectedEvent)} />
              <DetailItem label="Source" value={selectedEvent.source.toUpperCase()} />
              <DetailItem label="Auth" value={selectedEvent.authMethod ?? "Unknown"} />
              <DetailItem label="Country" value={selectedEvent.country ?? "Unknown"} />
              <DetailItem label="IP address" value={selectedEvent.ipAddress ?? "Unknown"} />
              <DetailItem
                label="Changed fields"
                value={selectedEvent.changedFields?.join(", ") ?? "None"}
              />
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
