"use client";

import { branches } from "@/components/branches/data";
import { create } from "zustand";

export type BranchScopeId = "all" | string;

export type BranchScopeOption = {
  id: BranchScopeId;
  name: string;
  detail: string;
};

export const branchScopeOptions: BranchScopeOption[] = [
  {
    id: "all",
    name: "All branches",
    detail: `Show every branch across web and modules`,
  },
  ...branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    detail: `${branch.status} branch scope`,
  })),
];

export function getBranchScopeOption(branchScopeId: BranchScopeId) {
  return (
    branchScopeOptions.find((option) => option.id === branchScopeId) ??
    branchScopeOptions[0]
  );
}

export function matchesBranchScope(branchId: string, branchScopeId: BranchScopeId) {
  return branchScopeId === "all" || branchId === branchScopeId;
}

export function getBranchScopeIdByName(branchName: string) {
  return branches.find((branch) => branch.name === branchName)?.id;
}

export function matchesBranchScopeName(
  branchName: string | null | undefined,
  branchScopeId: BranchScopeId,
) {
  if (!branchName) {
    return branchScopeId === "all";
  }

  const branchId = getBranchScopeIdByName(branchName);

  if (branchId) {
    return matchesBranchScope(branchId, branchScopeId);
  }

  return branchScopeId === "all" || getBranchScopeOption(branchScopeId).name === branchName;
}

type BranchScopeStore = {
  selectedBranchId: BranchScopeId;
  setSelectedBranchId: (selectedBranchId: BranchScopeId) => void;
  resetBranchScope: () => void;
};

export const useBranchScopeStore = create<BranchScopeStore>((set) => ({
  selectedBranchId: "all",
  setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
  resetBranchScope: () => set({ selectedBranchId: "all" }),
}));
