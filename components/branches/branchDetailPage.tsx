"use client";

import { useState } from "react";
import { Panel } from "@/components/ui";
import { PreviewTabPanel, type PreviewTabId } from "./branch-form-steps/previewStep";
import { createBranchFormState } from "./data";
import { BranchReviewsContent } from "./branchReviewsPage";
import { BranchWorkspaceLayout } from "./branchWorkspaceLayout";
import type { BranchWorkspaceSection } from "./branchWorkspaceTabs";
import type { BranchDetail, BranchFormState } from "./types";

type BranchDetailPageProps = {
  branch: BranchDetail;
  activeTab?: BranchWorkspaceSection;
};

function isPreviewTab(tab: BranchWorkspaceSection): tab is PreviewTabId {
  return tab !== "reviews";
}

export function BranchDetailPage({
  branch,
  activeTab = "branch-profile",
}: BranchDetailPageProps) {
  const [formState, setFormState] = useState<BranchFormState>(() => createBranchFormState(branch));

  const handleReorderGallery = (nextGalleryOrder: string[]) => {
    setFormState((currentState) => ({
      ...currentState,
      gallery: nextGalleryOrder,
    }));
  };

  return (
    <BranchWorkspaceLayout branch={branch} activeSection={activeTab}>
      {isPreviewTab(activeTab) ? (
        <Panel bodyClassName="space-y-6">
          <PreviewTabPanel
            formState={formState}
            activeTab={activeTab}
            mode="edit"
            onReorderGallery={handleReorderGallery}
            disableGalleryDrag
          />
        </Panel>
      ) : (
        <BranchReviewsContent branch={branch} />
      )}
    </BranchWorkspaceLayout>
  );
}
