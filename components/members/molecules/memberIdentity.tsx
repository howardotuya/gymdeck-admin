import type { MemberRow } from "../data";

type MemberIdentityProps = {
  member: MemberRow;
};

export function MemberIdentity({ member }: MemberIdentityProps) {
  return (
    <p className="font-semibold text-text-primary">{member.name}</p>
  );
}
