import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  EmployeeDetailPage,
  getEmployeeById,
  getEmployeeDetailById,
} from "@/components/staff-roles";

type EmployeeDetailRouteProps = {
  params: Promise<{
    employeeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EmployeeDetailRouteProps): Promise<Metadata> {
  const { employeeId } = await params;
  const employee = getEmployeeById(employeeId);

  return {
    title: employee ? employee.name : "Employee Details",
  };
}

export default async function EmployeeDetailRoute({
  params,
}: EmployeeDetailRouteProps) {
  const { employeeId } = await params;
  const detail = getEmployeeDetailById(employeeId);

  if (!detail) {
    notFound();
  }

  return <EmployeeDetailPage detail={detail} />;
}
