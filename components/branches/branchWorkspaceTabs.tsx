import { NavTabs } from "@/components/ui";

export type BranchWorkspaceSection =
  | "branch-profile"
  | "plans-and-classes"
  | "gallery"
  | "reviews"
  | "public-profile";

const defaultBranchWorkspaceSection: BranchWorkspaceSection = "branch-profile";
const branchWorkspaceSectionIds: BranchWorkspaceSection[] = [
  "branch-profile",
  "plans-and-classes",
  "gallery",
  "public-profile",
  "reviews",
];

export function getBranchWorkspaceSection(tabParam?: string | null): BranchWorkspaceSection {
  if (tabParam && branchWorkspaceSectionIds.includes(tabParam as BranchWorkspaceSection)) {
    return tabParam as BranchWorkspaceSection;
  }

  return defaultBranchWorkspaceSection;
}

export function getBranchWorkspaceHref(
  branchId: string,
  section: BranchWorkspaceSection,
) {
  const branchBaseHref = `/branches/${branchId}`;

  if (section === defaultBranchWorkspaceSection) {
    return branchBaseHref;
  }

  return `${branchBaseHref}?tab=${section}`;
}

const branchWorkspaceTabDefinitions: Array<{
  id: BranchWorkspaceSection;
  label: string;
  hrefBuilder: (branchId: string) => string;
}> = [
  {
    id: "branch-profile",
    label: "Branch profile",
    hrefBuilder: (branchId) => getBranchWorkspaceHref(branchId, "branch-profile"),
  },
  {
    id: "plans-and-classes",
    label: "Plans and classes",
    hrefBuilder: (branchId) => getBranchWorkspaceHref(branchId, "plans-and-classes"),
  },
  {
    id: "gallery",
    label: "Gallery",
    hrefBuilder: (branchId) => getBranchWorkspaceHref(branchId, "gallery"),
  },
  {
    id: "public-profile",
    label: "Public profile",
    hrefBuilder: (branchId) => getBranchWorkspaceHref(branchId, "public-profile"),
  },
  {
    id: "reviews",
    label: "Reviews",
    hrefBuilder: (branchId) => getBranchWorkspaceHref(branchId, "reviews"),
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
