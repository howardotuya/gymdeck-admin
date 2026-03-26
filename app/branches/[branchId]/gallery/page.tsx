import { redirect } from "next/navigation";

type BranchGalleryLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchGalleryLegacyRoute({
  params,
}: BranchGalleryLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}?tab=gallery`);
}
