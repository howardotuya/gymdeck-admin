"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import {
  CustomTable,
  FormSectionCard,
  SegmentedTabs,
  SetupTopbar,
  StatusBadge,
  type CustomTableColumn,
} from "@/components/ui";
import {
  defaultClassImageUrl,
  type ClassDetailRecord,
  type ClassMemberAttendance,
  type ClassSessionOccurrence,
} from "./data";

type ClassDetailPageProps = {
  detail: ClassDetailRecord;
};

type DetailTab = "details" | "members";

const summaryLabelClassName =
  "text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle";
const summaryValueClassName = "mt-2 text-[15px] font-medium text-text-primary";

const memberColumns: CustomTableColumn<ClassMemberAttendance>[] = [
  {
    id: "member",
    header: "Member",
    isRowHeader: true,
    sortable: true,
    sortAccessor: (member) => member.name,
    cell: (member) => (
      <div>
        <p className="font-semibold text-text-primary">{member.name}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{member.plan}</p>
      </div>
    ),
  },
  {
    id: "bookingSource",
    header: "Booking source",
    accessorKey: "bookingSource",
    sortable: true,
    className: "text-text-secondary",
  },
  {
    id: "status",
    header: "Attendance",
    sortable: true,
    sortAccessor: (member) => member.status,
    cell: (member) => <StatusBadge label={member.status} tone={member.tone} />,
  },
  {
    id: "checkedInAt",
    header: "Check-in note",
    accessorKey: "checkedInAt",
    className: "text-text-secondary",
  },
];

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className={summaryLabelClassName}>{label}</p>
      <p className={summaryValueClassName}>{value}</p>
    </div>
  );
}

function SessionFilter({
  occurrences,
  selectedOccurrenceId,
  onChange,
}: {
  occurrences: ClassSessionOccurrence[];
  selectedOccurrenceId: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block min-w-[280px]">
      <select
        value={selectedOccurrenceId}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 rounded-xl border border-border-soft bg-bg-surface px-4 text-[14px] text-text-primary outline-none"
      >
        {occurrences.map((occurrence) => (
          <option key={occurrence.id} value={occurrence.id}>
            {occurrence.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function buildTabHref(
  pathname: string,
  searchParams: URLSearchParams,
  tab: DetailTab,
) {
  const params = new URLSearchParams(searchParams.toString());
  params.set("tab", tab);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function ClassDetailPage({ detail }: ClassDetailPageProps) {
  const { classItem, occurrences, members } = detail;
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: DetailTab = rawTab === "members" ? "members" : "details";
  const requestedOccurrenceId = searchParams.get("session");
  const selectedOccurrence =
    occurrences.find((occurrence) => occurrence.id === requestedOccurrenceId) ??
    occurrences[0];

  const filteredMembers = useMemo(
    () =>
      members.filter((member) => member.sessionId === selectedOccurrence?.id),
    [members, selectedOccurrence?.id],
  );

  const handleOccurrenceChange = (occurrenceId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("session", occurrenceId);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleTabChange = (tab: DetailTab) => {
    router.push(
      buildTabHref(pathname, new URLSearchParams(searchParams.toString()), tab),
      {
        scroll: false,
      },
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="w-full">
        <SetupTopbar
          onBack={() => router.push("/classes")}
          backLabel="Back to classes"
          showCancel={false}
          showProceed={false}
        />
      </div>

      <section className="space-y-4">
        <SessionFilter
          occurrences={occurrences}
          selectedOccurrenceId={selectedOccurrence?.id ?? ""}
          onChange={handleOccurrenceChange}
        />

        <SegmentedTabs
          ariaLabel="Class detail sections"
          items={[
            {
              label: "Details",
              active: activeTab === "details",
              onClick: () => handleTabChange("details"),
            },
            {
              label: "Members",
              active: activeTab === "members",
              onClick: () => handleTabChange("members"),
            },
          ]}
        />
      </section>

      {activeTab === "details" ? (
        <FormSectionCard
          title="Class details"
          description="This follows the class setup summary pattern, but reflects the currently selected held session."
          bodyClassName="space-y-6"
        >
          <div className="overflow-hidden rounded-[24px] border border-border-soft bg-bg-muted">
            <div className="relative h-[293px] bg-bg-subtle">
              <Image
                src={defaultClassImageUrl}
                alt={`${classItem.name} cover`}
                fill
                unoptimized
                sizes="(max-width: 768px) 100vw, 720px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SummaryItem label="Class name" value={classItem.name} />
            <SummaryItem label="Lead instructor" value={classItem.instructor} />
            <SummaryItem label="Format" value={classItem.format} />
            <SummaryItem label="Branch" value={classItem.branch} />
            <SummaryItem label="Duration" value={classItem.duration} />
            <SummaryItem
              label="Capacity"
              value={`${classItem.capacity} members`}
            />
            <SummaryItem
              label="Weekly slots"
              value={`${classItem.activeSchedules} active slots`}
            />
            <SummaryItem
              label="Selected session"
              value={selectedOccurrence?.dateLabel ?? "Not set"}
            />
          </div>

          <div className="h-px bg-border-soft" />

          <div className="grid gap-6 md:grid-cols-2">
            <SummaryItem
              label="Week"
              value={selectedOccurrence?.weekLabel ?? "Not set"}
            />
            <SummaryItem
              label="Time"
              value={selectedOccurrence?.label.split(" • ")[1] ?? "Not set"}
            />
            <SummaryItem
              label="Booked seats"
              value={selectedOccurrence?.bookedSeats ?? classItem.bookedSeats}
            />
            <SummaryItem
              label="Attendance recorded"
              value={
                selectedOccurrence
                  ? `${selectedOccurrence.attendedCount} members`
                  : `${filteredMembers.length} members`
              }
            />
          </div>

          <div className="h-px bg-border-soft" />

          <div>
            <p className={summaryLabelClassName}>Description</p>
            <p className="mt-2 max-w-[760px] text-[14px] leading-[1.7] text-text-secondary">
              {classItem.description}
            </p>
          </div>
        </FormSectionCard>
      ) : (
        <CustomTable
          data={filteredMembers}
          columns={memberColumns}
          getRowId={(member) => member.id}
          getRowLabel={(member) => member.name}
          getSearchText={(member) =>
            [
              member.name,
              member.plan,
              member.bookingSource,
              member.status,
              member.checkedInAt,
            ].join(" ")
          }
          searchPlaceholder="Search members in this class session"
          caption="Member roster for the selected class occurrence, including booking source and attendance state."
          emptyStateTitle="No members recorded"
          emptyStateDescription="Switch the held-session filter or add bookings to populate this roster."
          itemLabel="members"
          initialPageSize={4}
          pageSizeOptions={[4, 8, 12]}
        />
      )}
    </div>
  );
}
