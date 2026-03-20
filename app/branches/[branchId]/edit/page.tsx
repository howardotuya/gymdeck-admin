import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BranchFormPage, getBranchById } from "@/components/branches";

type EditBranchRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditBranchRouteProps): Promise<Metadata> {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  return {
    title: branch ? `Edit ${branch.name}` : "Edit Branch",
  };
}

export default async function EditBranchRoute({ params }: EditBranchRouteProps) {
  const { branchId } = await params;
  const branch = getBranchById(branchId);

  if (!branch) {
    notFound();
  }

  return <BranchFormPage mode="edit" branch={branch} />;
}
