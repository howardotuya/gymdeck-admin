import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ClassDetailPage, getClassById, getClassDetailById } from "@/components/classes";

type ClassDetailRouteProps = {
  params: Promise<{
    classId: string;
  }>;
};

export async function generateMetadata({
  params,
}: ClassDetailRouteProps): Promise<Metadata> {
  const { classId } = await params;
  const classItem = getClassById(classId);

  return {
    title: classItem ? classItem.name : "Class Details",
  };
}

export default async function ClassDetailRoute({ params }: ClassDetailRouteProps) {
  const { classId } = await params;
  const detail = getClassDetailById(classId);

  if (!detail) {
    notFound();
  }

  return (
    <Suspense fallback={null}>
      <ClassDetailPage detail={detail} />
    </Suspense>
  );
}
