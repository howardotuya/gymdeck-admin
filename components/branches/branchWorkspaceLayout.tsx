import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui";
import { BranchWorkspaceTabs, type BranchWorkspaceSection } from "./branchWorkspaceTabs";
import type { BranchDetail } from "./types";

type BranchWorkspaceLayoutProps = {
  branch: BranchDetail;
  activeSection: BranchWorkspaceSection;
  pageLabel?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function BranchWorkspaceLayout({
  branch,
  activeSection,
  pageLabel,
  description,
  action,
  children,
}: BranchWorkspaceLayoutProps) {
  const shouldRenderHeader = Boolean(description);
  const breadcrumbs = pageLabel
    ? [
        { label: "Branches", href: "/branches" },
        { label: branch.name, href: `/branches/${branch.id}` },
        { label: pageLabel },
      ]
    : [{ label: "Branches", href: "/branches" }, { label: branch.name }];

  return (
    <div className="space-y-6 lg:space-y-8">
      {shouldRenderHeader ? (
        <PageHeader
          eyebrow="Branch workspace"
          title={branch.name}
          description={description}
          breadcrumbs={breadcrumbs}
          action={action}
        />
      ) : null}

      <BranchWorkspaceTabs branchId={branch.id} activeSection={activeSection} />

      {children}
    </div>
  );
}
