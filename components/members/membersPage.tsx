"use client";

import { useState } from "react";
import { OverviewCard } from "@/components/ui";
import { getMemberOverview, members } from "./data";
import { DeactivateMemberModal } from "./organisms/deactivateMemberModal";
import { MemberDetailModal } from "./organisms/memberDetailModal";
import { MemberListTable } from "./organisms/memberListTable";

export function MembersPage() {
  const [memberRows, setMemberRows] = useState(members);
  const [detailMemberId, setDetailMemberId] = useState<string | null>(null);
  const [deactivateMemberId, setDeactivateMemberId] = useState<string | null>(null);
  const memberOverview = getMemberOverview(memberRows);
  const detailMember = memberRows.find((member) => member.id === detailMemberId) ?? null;
  const deactivateMember = memberRows.find((member) => member.id === deactivateMemberId) ?? null;

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-3">
        {memberOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <MemberListTable
        members={memberRows}
        onViewMember={(member) => setDetailMemberId(member.id)}
        onDeactivateMember={(member) => setDeactivateMemberId(member.id)}
      />

      {detailMember ? (
        <MemberDetailModal
          member={detailMember}
          onClose={() => setDetailMemberId(null)}
          onDeactivate={() => {
            setDetailMemberId(null);
            setDeactivateMemberId(detailMember.id);
          }}
        />
      ) : null}

      {deactivateMember ? (
        <DeactivateMemberModal
          member={deactivateMember}
          onClose={() => setDeactivateMemberId(null)}
          onConfirm={() => {
            setMemberRows((currentRows) =>
              currentRows.map((member) =>
                member.id === deactivateMember.id
                  ? {
                      ...member,
                      status: "Inactive",
                      tone: "neutral",
                    }
                  : member,
              ),
            );
          }}
        />
      ) : null}
    </div>
  );
}
