import { HistoryStatusPill } from "@/components/dashboard/atoms";
import type { MembershipHistoryRecord } from "@/components/dashboard/types";

type MembershipHistoryTableRowProps = {
  membership: MembershipHistoryRecord;
};

export function MembershipHistoryTableRow({
  membership,
}: MembershipHistoryTableRowProps) {
  return (
    <tr className="border-b border-border-input last:border-b-0">
      <td className="px-6 py-5 text-[12px] leading-[1.5] text-text-primary whitespace-nowrap">
        {membership.gym}
      </td>
      <td className="px-6 py-5 text-[12px] leading-[1.5] text-text-table whitespace-nowrap">
        {membership.plan}
      </td>
      <td className="px-6 py-5 text-[12px] leading-[1.5] text-text-table whitespace-nowrap">
        {membership.period}
      </td>
      <td className="px-6 py-5 text-[12px] leading-[1.5] text-text-table whitespace-nowrap">
        {membership.cost}
      </td>
      <td className="px-6 py-[17px]">
        <HistoryStatusPill status={membership.status} />
      </td>
    </tr>
  );
}
