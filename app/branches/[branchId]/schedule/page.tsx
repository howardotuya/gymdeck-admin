import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchSchedulePage,
  getBranchById,
} from "@/components/branches";

type BranchScheduleRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchScheduleRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Schedule` : "Branch Schedule",
  };
}

export default async function BranchScheduleRoute({ params }: BranchScheduleRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchSchedulePage branch={branch} />;
}
