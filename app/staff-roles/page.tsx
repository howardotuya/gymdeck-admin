import { StaffRolesPage } from "@/components/staff-roles";

type StaffRolesRouteProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function StaffRolesRoute({ searchParams }: StaffRolesRouteProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const activeTabParam = resolvedSearchParams?.tab;

  return (
    <StaffRolesPage
      activeTabParam={Array.isArray(activeTabParam) ? activeTabParam[0] : activeTabParam}
    />
  );
}
