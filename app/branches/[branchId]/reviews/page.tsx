import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchReviewsPage,
  getBranchById,
} from "@/components/branches";

type BranchReviewsRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchReviewsRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Reviews` : "Branch Reviews",
  };
}

export default async function BranchReviewsRoute({ params }: BranchReviewsRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchReviewsPage branch={branch} />;
}
