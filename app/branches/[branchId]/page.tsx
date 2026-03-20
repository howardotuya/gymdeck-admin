import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BranchDetailPage, getBranchById } from "@/components/branches";

type BranchDetailRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchDetailRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? branch.name : "Branch Details",
  };
}

export default async function BranchDetailRoute({ params }: BranchDetailRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchDetailPage branch={branch} />;
}
