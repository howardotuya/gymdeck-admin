import { redirect } from "next/navigation";

type BranchPlansAndClassesLegacyRouteProps = {
  params: Promise<{
    branchId: string;
  }>;
};

export default async function BranchPlansAndClassesLegacyRoute({
  params,
}: BranchPlansAndClassesLegacyRouteProps) {
  const { branchId } = await params;
  redirect(`/branches/${branchId}?tab=plans-and-classes`);
}
