import { redirect } from "next/navigation";

type BranchPublishingLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchPublishingLegacyRoute({
  params,
}: BranchPublishingLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}`);
}
