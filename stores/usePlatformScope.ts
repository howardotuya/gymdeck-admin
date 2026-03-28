"use client";

import {
  getBranchScopeOption,
  matchesBranchScopeName,
  type BranchScopeId,
  useBranchScopeStore,
} from "./useBranchScopeStore";
import {
  getTimelineScopeDescription,
  getTimelineScopeLabel,
  matchesTimelineDate,
  type TimelineScopeState,
  useTimelineScopeStore,
} from "./useTimelineScopeStore";

type FilterCollectionByPlatformScopeOptions<TItem> = {
  items: TItem[];
  selectedBranchId: BranchScopeId;
  timelineScope: TimelineScopeState;
  getBranchName?: (item: TItem) => string | null | undefined;
  getDate?: (item: TItem) => Date | string | null | undefined;
  includeBranchlessItems?: boolean;
  referenceDate?: Date;
};

export function filterCollectionByPlatformScope<TItem>({
  items,
  selectedBranchId,
  timelineScope,
  getBranchName,
  getDate,
  includeBranchlessItems = false,
  referenceDate,
}: FilterCollectionByPlatformScopeOptions<TItem>) {
  return items.filter((item) => {
    if (getBranchName) {
      const branchName = getBranchName(item);

      if (!branchName) {
        if (!includeBranchlessItems && selectedBranchId !== "all") {
          return false;
        }
      } else if (!matchesBranchScopeName(branchName, selectedBranchId)) {
        return false;
      }
    }

    if (getDate && !matchesTimelineDate(getDate(item), timelineScope, referenceDate)) {
      return false;
    }

    return true;
  });
}

export function usePlatformScope() {
  const selectedBranchId = useBranchScopeStore((state) => state.selectedBranchId);
  const timelineScope = useTimelineScopeStore((state) => state.timelineScope);
  const selectedBranch = getBranchScopeOption(selectedBranchId);

  return {
    selectedBranchId,
    selectedBranch,
    timelineScope,
    timelineLabel: getTimelineScopeLabel(timelineScope),
    timelineDescription: getTimelineScopeDescription(timelineScope),
  };
}
