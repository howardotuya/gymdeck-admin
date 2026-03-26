import { NavTabs } from "@/components/ui";

export type BranchWorkspaceSection =
  | "overview"
  | "profile"
  | "gallery"
  | "reviews"
  | "socials"
  | "pricing"
  | "schedule"
  | "publishing";

const branchWorkspaceTabDefinitions: Array<{
  id: BranchWorkspaceSection;
  label: string;
  hrefBuilder: (branchId: string) => string;
}> = [
  {
    id: "overview",
    label: "Overview",
    hrefBuilder: (branchId) => `/branches/${branchId}`,
  },
  {
    id: "profile",
    label: "Public profile",
    hrefBuilder: (branchId) => `/branches/${branchId}/profile`,
  },
  {
    id: "gallery",
    label: "Gallery",
    hrefBuilder: (branchId) => `/branches/${branchId}/gallery`,
  },
  {
    id: "reviews",
    label: "Reviews",
    hrefBuilder: (branchId) => `/branches/${branchId}/reviews`,
  },
  {
    id: "socials",
    label: "Social links",
    hrefBuilder: (branchId) => `/branches/${branchId}/socials`,
  },
  {
    id: "pricing",
    label: "Pricing",
    hrefBuilder: (branchId) => `/branches/${branchId}/pricing`,
  },
  {
    id: "schedule",
    label: "Schedule",
    hrefBuilder: (branchId) => `/branches/${branchId}/schedule`,
  },
  {
    id: "publishing",
    label: "Publishing",
    hrefBuilder: (branchId) => `/branches/${branchId}/publishing`,
  },
];

type BranchWorkspaceTabsProps = {
  branchId: string;
  activeSection: BranchWorkspaceSection;
};

export function BranchWorkspaceTabs({
  branchId,
  activeSection,
}: BranchWorkspaceTabsProps) {
  return (
    <NavTabs
      ariaLabel="Branch workspace tabs"
      tabs={branchWorkspaceTabDefinitions.map((tab) => ({
        href: tab.hrefBuilder(branchId),
        label: tab.label,
        active: tab.id === activeSection,
      }))}
    />
  );
}
