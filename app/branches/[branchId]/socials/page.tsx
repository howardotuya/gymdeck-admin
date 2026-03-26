import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  BranchSocialLinksPage,
  getBranchById,
} from "@/components/branches";

type BranchSocialsRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: BranchSocialsRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `${branch.name} Social Links` : "Branch Social Links",
  };
}

export default async function BranchSocialsRoute({ params }: BranchSocialsRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchSocialLinksPage branch={branch} />;
}
