import type { Metadata } from "next";
import { BranchFormPage } from "@/components/branches";

export const metadata: Metadata = {
  title: "Add Branch",
};

export default function AddBranchRoute() {
  return <BranchFormPage mode="create" />;
}
