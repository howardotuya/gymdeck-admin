import { MembershipHistoryTableRow } from "@/components/dashboard/molecules";
import type { MembershipHistoryRecord } from "@/components/dashboard/types";

type MembershipHistorySectionProps = {
  memberships: MembershipHistoryRecord[];
};

const TABLE_HEADERS = ["Gym", "Plan", "Period", "Cost", "Plan"];

export function MembershipHistorySection({
  memberships,
}: MembershipHistorySectionProps) {
  return (
    <section className="flex w-full flex-col gap-5">
      <h1 className="text-[18px] leading-[1.4] font-semibold text-text-primary">
        Membership History
      </h1>

      <div className="overflow-hidden rounded-[12px] border border-border-input bg-bg-surface">
        <div className="overflow-x-auto md:overflow-visible">
          <table className="w-full min-w-[884px] border-collapse md:min-w-0">
            <thead className="bg-bg-muted">
              <tr className="border-b border-border-input">
                {TABLE_HEADERS.map((header, index) => (
                  <th
                    key={`${header}-${index}`}
                    className="px-6 py-3 text-left text-[12px] leading-[1.5] font-normal text-[#71797f] whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {memberships.map((membership) => (
                <MembershipHistoryTableRow
                  key={membership.id}
                  membership={membership}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
