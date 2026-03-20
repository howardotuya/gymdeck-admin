"use client";

import { useState } from "react";
import { OverviewCard } from "@/components/ui";
import { branches, getBranchOverview, getBranchTone } from "./data";
import { BranchListTable } from "./organisms/branchListTable";

export function BranchesPage() {
  const [branchRows, setBranchRows] = useState(branches);
  const branchOverview = getBranchOverview(branchRows);

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {branchOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <BranchListTable
        branches={branchRows}
        onDeactivate={(branchId) => {
          setBranchRows((currentRows) =>
            currentRows.map((branch) =>
              branch.id === branchId
                ? {
                    ...branch,
                    status: "Inactive",
                    tone: getBranchTone("Inactive"),
                  }
                : branch,
            ),
          );
        }}
      />
    </div>
  );
}
