import type { ReactNode } from "react";

type MembershipStatProps = {
  label: string;
  value: ReactNode;
};

export function MembershipStat({ label, value }: MembershipStatProps) {
  return (
    <div className="space-y-[9px]">
      <p className="text-[14px] leading-normal text-text-inverse/72">{label}</p>
      <p className="text-[16px] leading-normal font-medium text-text-inverse">{value}</p>
    </div>
  );
}
