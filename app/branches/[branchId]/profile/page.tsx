import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchPublicProfilePage,
  getBranchById,
} from "@/components/branches";

type BranchProfileRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchProfileRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Public Profile` : "Branch Public Profile",
  };
}

export default async function BranchProfileRoute({ params }: BranchProfileRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchPublicProfilePage branch={branch} />;
}
