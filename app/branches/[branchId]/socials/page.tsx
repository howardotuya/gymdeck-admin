import { redirect } from "next/navigation";

type BranchSocialsLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchSocialsLegacyRoute({
  params,
}: BranchSocialsLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}`);
}
