import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmployeeFormPage, getEmployeeById } from "@/components/staff-roles";

type EditEmployeeRouteProps = {
  params: Promise<{
    employeeId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditEmployeeRouteProps): Promise<Metadata> {
  const { employeeId } = await params;
  const employee = getEmployeeById(employeeId);

  return {
    title: employee ? `Edit Staff | ${employee.name}` : "Edit Staff",
  };
}

export default async function EditEmployeeRoute({
  params,
}: EditEmployeeRouteProps) {
  const { employeeId } = await params;
  const employee = getEmployeeById(employeeId);

  if (!employee) {
    notFound();
  }

  return <EmployeeFormPage mode="edit" employee={employee} />;
}
