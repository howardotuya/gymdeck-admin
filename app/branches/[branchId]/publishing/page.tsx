import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchPublishingPage,
  getBranchById,
} from "@/components/branches";

type BranchPublishingRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchPublishingRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Publishing` : "Branch Publishing",
  };
}

export default async function BranchPublishingRoute({ params }: BranchPublishingRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchPublishingPage branch={branch} />;
}
