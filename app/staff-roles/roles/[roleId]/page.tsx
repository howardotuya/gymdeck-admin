import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getRoleById,
  getRoleDetailById,
  RoleDetailPage,
} from "@/components/staff-roles";

type RoleDetailRouteProps = {
  params: Promise<{
    roleId: string;
  }>;
};

export async function generateMetadata({
  params,
}: RoleDetailRouteProps): Promise<Metadata> {
  const { roleId } = await params;
  const role = getRoleById(roleId);

  return {
    title: role ? role.name : "Role Details",
  };
}

export default async function RoleDetailRoute({
  params,
}: RoleDetailRouteProps) {
  const { roleId } = await params;
  const detail = getRoleDetailById(roleId);

  if (!detail) {
    notFound();
  }

  return <RoleDetailPage detail={detail} />;
}
