import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRoleById, RoleFormPage } from "@/components/staff-roles";

type EditRoleRouteProps = {
  params: Promise<{
    roleId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditRoleRouteProps): Promise<Metadata> {
  const { roleId } = await params;
  const role = getRoleById(roleId);

  return {
    title: role ? `Edit Role | ${role.name}` : "Edit Role",
  };
}

export default async function EditRoleRoute({
  params,
}: EditRoleRouteProps) {
  const { roleId } = await params;
  const role = getRoleById(roleId);

  if (!role) {
    notFound();
  }

  return <RoleFormPage mode="edit" role={role} />;
}
