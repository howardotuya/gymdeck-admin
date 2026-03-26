import { redirect } from "next/navigation";

type BranchPricingLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchPricingLegacyRoute({
  params,
}: BranchPricingLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}?tab=plans-and-classes`);
}
