import type { Metadata } from "next";
import { ClassFormPage } from "@/components/classes";

export const metadata: Metadata = {
  title: "Create Class",
};

export default function CreateClassRoute() {
  return <ClassFormPage mode="create" />;
}
