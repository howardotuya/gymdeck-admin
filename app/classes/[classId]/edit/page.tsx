import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClassFormPage, getClassById } from "@/components/classes";

type EditClassRouteProps = {
  params: Promise<{
    classId: string;
  }>;
};

export async function generateMetadata({
  params,
}: EditClassRouteProps): Promise<Metadata> {
  const { classId } = await params;
  const classItem = getClassById(classId);

  return {
    title: classItem ? `Edit ${classItem.name}` : "Edit Class",
  };
}

export default async function EditClassRoute({ params }: EditClassRouteProps) {
  const { classId } = await params;
  const classItem = getClassById(classId);

  if (!classItem) {
    notFound();
  }

  return <ClassFormPage mode="edit" classItem={classItem} />;
}
