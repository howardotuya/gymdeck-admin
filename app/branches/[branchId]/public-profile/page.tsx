import { redirect } from "next/navigation";

type BranchPublicProfileLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchPublicProfileLegacyRoute({
  params,
}: BranchPublicProfileLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}?tab=public-profile`);
}
