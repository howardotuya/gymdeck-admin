import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchGalleryPage,
  getBranchById,
} from "@/components/branches";

type BranchGalleryRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchGalleryRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Gallery` : "Branch Gallery",
  };
}

export default async function BranchGalleryRoute({ params }: BranchGalleryRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchGalleryPage branch={branch} />;
}
