import type { Metadata } from "next";
import { Suspense } from "react";
import { BranchFormPage } from "@/components/branches";

export const metadata: Metadata = {
  title: "Add Branch",
};

export default function AddBranchRoute() {
  return (
    <Suspense fallback={null}>
      <BranchFormPage mode="create" />
    </Suspense>
  );
}
