import type { Metadata } from "next";
import { Suspense } from "react";
import { ClassFormPage } from "@/components/classes";

export const metadata: Metadata = {
  title: "Create Class",
};

export default function CreateClassRoute() {
  return (
    <Suspense fallback={null}>
      <ClassFormPage mode="create" />
    </Suspense>
  );
}
