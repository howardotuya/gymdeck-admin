import { Suspense } from "react";
import { ClassesPage } from "@/components/classes";

export default function ClassesRoute() {
  return (
    <Suspense fallback={null}>
      <ClassesPage />
    </Suspense>
  );
}
