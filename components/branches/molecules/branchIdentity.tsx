import Link from "next/link";
import type { Branch } from "../types";

type BranchIdentityProps = {
  branch: Branch;
};

export function BranchIdentity({ branch }: BranchIdentityProps) {
  return (
    <Link href={`/branches/${branch.id}`} className="group inline-block">
      <p className="text-[15px] font-semibold text-text-primary transition-colors group-hover:text-text-brand">
        {branch.name}
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">{branch.phone}</p>
    </Link>
  );
}
