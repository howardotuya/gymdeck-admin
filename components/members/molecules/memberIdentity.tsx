import type { MemberRow } from "../data";

type MemberIdentityProps = {
  member: MemberRow;
};

export function MemberIdentity({ member }: MemberIdentityProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-bg-muted text-[13px] font-semibold text-text-secondary">
        {member.initials}
      </span>
      <div>
        <p className="text-[15px] font-semibold text-text-primary">{member.name}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{member.id}</p>
      </div>
    </div>
  );
}
