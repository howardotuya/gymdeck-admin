"use client";

import { useState } from "react";
import { OverviewCard } from "@/components/ui";
import { getMemberOverview, getMemberTone, members } from "./data";
import { MemberListTable } from "./organisms/memberListTable";

export function MembersPage() {
  const [memberRows, setMemberRows] = useState(members);
  const memberOverview = getMemberOverview(memberRows);

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
        onUpdateStatus={(memberId, status) => {
          setMemberRows((currentRows) =>
            currentRows.map((member) =>
              member.id === memberId
                ? {
                    ...member,
                    status,
                    tone: getMemberTone(status),
                  }
                : member,
            ),
          );
        }}
      />
    </div>
  );
}
