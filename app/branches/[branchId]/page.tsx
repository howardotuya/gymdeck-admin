import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchDetailPage,
  getBranchById,
  getBranchWorkspaceSection,
} from "@/components/branches";

type BranchDetailRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getWorkspaceTitle(tab: ReturnType<typeof getBranchWorkspaceSection>) {
  if (tab === "plans-and-classes") {
    return "Plans and Classes";
  }

  if (tab === "public-profile") {
    return "Public Profile";
  }

  if (tab === "reviews") {
    return "Reviews";
  }

  if (tab === "gallery") {
    return "Gallery";
  }

  return "Branch Profile";
}

export async function generateMetadata({
  params,
  searchParams,
}: BranchDetailRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTabParam = resolvedSearchParams?.tab;
  const activeTab = getBranchWorkspaceSection(
    Array.isArray(activeTabParam) ? activeTabParam[0] : activeTabParam,
  );

  return {
    title: branch ? `${branch.name} ${getWorkspaceTitle(activeTab)}` : "Branch Workspace",
  };
}

export default async function BranchDetailRoute({
  params,
  searchParams,
}: BranchDetailRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTabParam = resolvedSearchParams?.tab;
  const activeTab = getBranchWorkspaceSection(
    Array.isArray(activeTabParam) ? activeTabParam[0] : activeTabParam,
  );

  if (!branch) {
    notFound();
  }

  return <BranchDetailPage branch={branch} activeTab={activeTab} />;
}
