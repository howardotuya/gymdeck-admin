import { PlaceholderPage } from "@/components/placeholder/placeholderPage";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchDetail } from "./types";
import { type BranchWorkspaceSection } from "./branchWorkspaceTabs";

type BranchWorkspacePlaceholderPageProps = {
  branch: BranchDetail;
  activeSection: BranchWorkspaceSection;
  eyebrow: string;
  title: string;
  description: string;
};

export function BranchWorkspacePlaceholderPage({
  branch,
  activeSection,
  eyebrow,
  title,
  description,
}: BranchWorkspacePlaceholderPageProps) {
  return (
    <BranchWorkspaceLayout
      branch={branch}
      activeSection={activeSection}
      pageLabel={title}
      description="Manage this branch across operations, public profile content, conversion surfaces, and publishing controls from one workspace."
    >
      <PlaceholderPage
        eyebrow={eyebrow}
        title={title}
        description={description}
      />
    </BranchWorkspaceLayout>
  );
}
