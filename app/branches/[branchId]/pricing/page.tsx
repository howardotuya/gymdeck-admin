import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchPricingPage,
  getBranchById,
} from "@/components/branches";

type BranchPricingRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchPricingRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Pricing` : "Branch Pricing",
  };
}

export default async function BranchPricingRoute({ params }: BranchPricingRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchPricingPage branch={branch} />;
}
