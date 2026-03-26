import { redirect } from "next/navigation";

type BranchReviewsLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchReviewsLegacyRoute({
  params,
}: BranchReviewsLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}?tab=reviews`);
}
