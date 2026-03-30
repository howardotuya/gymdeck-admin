"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BellIcon,
  BranchesIcon,
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  MenuIcon,
} from "@/components/icons";
import { Input } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";
import { useFakeAuth } from "@/stores/useFakeAuth";
import {
  branchScopeOptions,
  getBranchScopeOption,
  useBranchScopeStore,
} from "@/stores/useBranchScopeStore";
import {
  defaultTimelineScope,
  getTimelineScopeDescription,
  getTimelineScopeLabel,
  isTimelineCustomRangeValid,
  timelinePresetOptions,
  useTimelineScopeStore,
} from "@/stores/useTimelineScopeStore";
import type { AdminPageMeta } from "../data";
import { IconButton } from "../atoms/iconButton";

type AdminTopbarProps = {
  pageMeta: AdminPageMeta;
  onOpenSidebar: () => void;
};

export function AdminTopbar({ pageMeta, onOpenSidebar }: AdminTopbarProps) {
  const router = useRouter();
  const signOut = useFakeAuth((state) => state.signOut);
  const selectedBranchId = useBranchScopeStore(
    (state) => state.selectedBranchId,
  );
  const setSelectedBranchId = useBranchScopeStore(
    (state) => state.setSelectedBranchId,
  );
  const resetBranchScope = useBranchScopeStore(
    (state) => state.resetBranchScope,
  );
  const timelineScope = useTimelineScopeStore((state) => state.timelineScope);
  const setTimelinePreset = useTimelineScopeStore(
    (state) => state.setTimelinePreset,
  );
  const setCustomRange = useTimelineScopeStore((state) => state.setCustomRange);
  const resetTimelineScope = useTimelineScopeStore(
    (state) => state.resetTimelineScope,
  );
  const selectedBranch = getBranchScopeOption(selectedBranchId);
  const timelineLabel = getTimelineScopeLabel(timelineScope);
  const timelineDescription = getTimelineScopeDescription(timelineScope);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [timelineMenuOpen, setTimelineMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileWorkspaceOpen, setMobileWorkspaceOpen] = useState(false);
  const [mobileFilterSection, setMobileFilterSection] = useState<
    "branch" | "date" | null
  >(null);
  const [customStartDate, setCustomStartDate] = useState(
    timelineScope.customRange.startDate,
  );
  const [customEndDate, setCustomEndDate] = useState(
    timelineScope.customRange.endDate,
  );
  const branchMenuRef = useRef<HTMLDivElement | null>(null);
  const timelineMenuRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const mobileDockRef = useRef<HTMLDivElement | null>(null);
  const customRangeIsValid = isTimelineCustomRangeValid({
    startDate: customStartDate,
    endDate: customEndDate,
  });
  const mobileSurfaceOpen = mobileWorkspaceOpen || menuOpen;
  const workspaceHasCustomScope =
    selectedBranchId !== "all" ||
    timelineScope.preset !== defaultTimelineScope.preset ||
    timelineScope.customRange.startDate !==
      defaultTimelineScope.customRange.startDate ||
    timelineScope.customRange.endDate !==
      defaultTimelineScope.customRange.endDate;

  const syncCustomRangeInputs = () => {
    setCustomStartDate(timelineScope.customRange.startDate);
    setCustomEndDate(timelineScope.customRange.endDate);
  };

  const resetWorkspaceScope = () => {
    resetBranchScope();
    resetTimelineScope();
    setCustomStartDate(defaultTimelineScope.customRange.startDate);
    setCustomEndDate(defaultTimelineScope.customRange.endDate);
  };

  const closeMobileSurfaces = () => {
    setMobileWorkspaceOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    signOut();
    router.replace("/auth/login");
  };

  const handleMenuToggle = () => {
    setMenuOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        setBranchMenuOpen(false);
        setTimelineMenuOpen(false);
        setMobileWorkspaceOpen(false);
      }

      return nextOpen;
    });
  };

  const handleTimelineToggle = () => {
    setTimelineMenuOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        syncCustomRangeInputs();
        setBranchMenuOpen(false);
        setMenuOpen(false);
        setMobileWorkspaceOpen(false);
      }

      return nextOpen;
    });
  };

  const handleBranchToggle = () => {
    setBranchMenuOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        setTimelineMenuOpen(false);
        setMenuOpen(false);
        setMobileWorkspaceOpen(false);
      }

      return nextOpen;
    });
  };

  const handleMobileWorkspaceToggle = () => {
    setMobileWorkspaceOpen((current) => {
      const nextOpen = !current;

      if (nextOpen) {
        syncCustomRangeInputs();
        setBranchMenuOpen(false);
        setTimelineMenuOpen(false);
        setMenuOpen(false);
        setMobileFilterSection(null);
      }

      return nextOpen;
    });
  };

  const handleMobileFilterSectionToggle = (section: "branch" | "date") => {
    setMobileFilterSection((current) => (current === section ? null : section));
  };

  const handleApplyCustomRange = (onApply?: () => void) => {
    if (!customRangeIsValid) {
      return;
    }

    setCustomRange({
      startDate: customStartDate,
      endDate: customEndDate,
    });
    onApply?.();
  };

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (!branchMenuRef.current?.contains(target)) {
        setBranchMenuOpen(false);
      }

      if (!timelineMenuRef.current?.contains(target)) {
        setTimelineMenuOpen(false);
      }

      if (
        !menuRef.current?.contains(target) &&
        !mobileDockRef.current?.contains(target)
      ) {
        setMenuOpen(false);
      }

      if (!mobileDockRef.current?.contains(target)) {
        setMobileWorkspaceOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileSurfaceOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMobileSurfaces();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [mobileSurfaceOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border-soft bg-bg-page">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:hidden">
            <IconButton
              label="Open navigation"
              onClick={onOpenSidebar}
              className="shrink-0"
            >
              <MenuIcon size={17} />
            </IconButton>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-subtle">
                {pageMeta.group}
              </p>
              <h1 className="truncate text-[18px] font-semibold tracking-[-0.04em] text-text-primary">
                {pageMeta.title}
              </h1>
            </div>
          </div>

          <div className="ml-auto hidden shrink-0 items-center gap-2 md:flex">
            <IconButton label="Notifications" className="shrink-0">
              <BellIcon size={17} />
            </IconButton>

            <div ref={timelineMenuRef} className="relative">
              <button
                type="button"
                onClick={handleTimelineToggle}
                className="inline-flex h-11 max-w-[136px] items-center gap-2 rounded-full border border-border-soft bg-bg-surface pl-1.5 pr-2.5 text-left sm:max-w-[180px] sm:pr-3"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-control text-text-secondary">
                  <CalendarIcon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-text-primary">
                    {timelineLabel}
                  </span>
                </span>
                <ChevronDownIcon
                  size={16}
                  className={
                    timelineMenuOpen
                      ? "rotate-180 text-text-muted transition-transform"
                      : "text-text-muted transition-transform"
                  }
                />
              </button>

              {timelineMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-[340px] rounded-[24px] border border-border-soft bg-bg-surface p-4 shadow-[var(--shadow-panel)]">
                  <div className="px-1">
                    <p className="text-[13px] font-semibold text-text-primary">
                      Timeline
                    </p>
                    <p className="mt-1 text-[12px] text-text-subtle">
                      {timelineDescription}
                    </p>
                    <p className="mt-1 text-[11px] text-text-subtle">
                      Applies to overview, check-ins, finance, and audit logs.
                    </p>
                  </div>

                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {timelinePresetOptions.map((option) => {
                      const isActive = timelineScope.preset === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setTimelinePreset(option.id);
                            setTimelineMenuOpen(false);
                          }}
                          className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                            isActive
                              ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                              : "border-border-soft bg-bg-control text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                          }`}
                        >
                          <span className="block text-[13px] font-medium">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    className={`mt-4 rounded-[20px] border p-4 ${
                      timelineScope.preset === "custom"
                        ? "border-border-brand bg-bg-brand-soft/40"
                        : "border-border-soft bg-bg-control"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[13px] font-semibold text-text-primary">
                          Custom range
                        </p>
                        <p className="mt-1 text-[12px] text-text-subtle">
                          Choose exact dates for a one-off reporting window.
                        </p>
                      </div>
                      {timelineScope.preset === "custom" ? (
                        <span className="rounded-full bg-bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-brand">
                          Active
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <label className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                          Start
                        </span>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(event) =>
                            setCustomStartDate(event.target.value)
                          }
                          className="rounded-2xl px-3 py-2.5 text-[13px]"
                        />
                      </label>

                      <label className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                          End
                        </span>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(event) =>
                            setCustomEndDate(event.target.value)
                          }
                          className="rounded-2xl px-3 py-2.5 text-[13px]"
                        />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          resetTimelineScope();
                          setTimelineMenuOpen(false);
                        }}
                        className="inline-flex h-10 items-center rounded-full border border-border-soft bg-bg-surface px-4 text-[13px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        disabled={!customRangeIsValid}
                        onClick={() =>
                          handleApplyCustomRange(() =>
                            setTimelineMenuOpen(false),
                          )
                        }
                        className={`inline-flex h-10 items-center rounded-full px-4 text-[13px] font-semibold transition-colors ${
                          customRangeIsValid
                            ? "bg-bg-brand-strong text-text-inverse hover:bg-bg-brand-strong"
                            : "cursor-not-allowed bg-bg-muted text-text-subtle"
                        }`}
                      >
                        Apply custom
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div ref={branchMenuRef} className="relative">
              <button
                type="button"
                onClick={handleBranchToggle}
                className="inline-flex h-11 max-w-[136px] items-center gap-2 rounded-full border border-border-soft bg-bg-surface pl-1.5 pr-2.5 text-left sm:max-w-[172px] sm:pr-3"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-control text-text-secondary">
                  <BranchesIcon size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-text-primary">
                    {selectedBranch.name}
                  </span>
                </span>
                <ChevronDownIcon
                  size={16}
                  className={
                    branchMenuOpen
                      ? "rotate-180 text-text-muted transition-transform"
                      : "text-text-muted transition-transform"
                  }
                />
              </button>

              {branchMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-[300px] rounded-[24px] border border-border-soft bg-bg-surface p-4 shadow-[var(--shadow-panel)]">
                  <div className="px-1">
                    <p className="text-[13px] font-semibold text-text-primary">
                      Switch Branch
                    </p>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {branchScopeOptions.map((option) => {
                      const isActive = option.id === selectedBranchId;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setSelectedBranchId(option.id);
                            setBranchMenuOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-2xl border px-3 py-3 text-left transition-colors ${
                            isActive
                              ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                              : "border-border-soft bg-bg-control text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[13px] font-medium">
                              {option.name}
                            </p>
                          </div>
                          <span
                            className={`ml-3 inline-flex h-3.5 w-3.5 rounded-full border ${
                              isActive
                                ? "border-[4px] border-bg-brand-strong bg-bg-surface"
                                : "border-border-soft bg-bg-surface"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={handleMenuToggle}
                className="inline-flex h-11 items-center gap-3 rounded-full border border-border-soft bg-bg-surface pl-1.5 pr-3"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-bg-brand-soft text-[12px] font-semibold text-text-brand">
                  HO
                </span>
                <span className="hidden text-[13px] font-medium text-text-primary sm:inline">
                  Howard
                </span>
                <ChevronDownIcon
                  size={16}
                  className={
                    menuOpen
                      ? "rotate-180 text-text-muted transition-transform"
                      : "text-text-muted transition-transform"
                  }
                />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 top-[calc(100%+12px)] w-[248px] rounded-[20px] border border-border-soft bg-bg-surface p-3 shadow-[var(--shadow-panel)]">
                  <div className="flex items-center gap-3 rounded-2xl px-2 py-1.5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-brand-soft text-[14px] font-semibold text-text-brand">
                      HO
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-text-primary">
                        Howard
                      </p>
                      <p className="truncate text-[12px] text-text-secondary">
                        ops@gymdeck.com
                      </p>
                    </div>

                    <span className="rounded-full bg-bg-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                      Admin
                    </span>
                  </div>

                  <div className="mt-2 space-y-1 border-t border-border-soft pt-2">
                    <ThemeToggle
                      labelMode="always"
                      className="h-10 w-full justify-between rounded-xl border-transparent bg-bg-control px-3 hover:border-transparent hover:bg-bg-muted"
                    />
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-control"
                    >
                      My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-text-danger transition-colors hover:bg-bg-control"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {mobileSurfaceOpen ? (
        <button
          type="button"
          aria-label="Close mobile panel"
          onClick={closeMobileSurfaces}
          className="fixed inset-0 z-40 bg-bg-overlay backdrop-blur-[3px] md:hidden"
        />
      ) : null}

      <div className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+16px)] z-50 flex justify-center px-4 md:hidden">
        <div ref={mobileDockRef} className="relative">
          {mobileWorkspaceOpen ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-filters-title"
              className="absolute bottom-[calc(100%+14px)] left-1/2 z-20 w-[calc(100vw-2rem)] max-h-[min(72vh,34rem)] max-w-[360px] -translate-x-1/2 overflow-y-auto rounded-[30px] border border-border-soft bg-bg-surface/95 p-4 shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  id="mobile-filters-title"
                  className="text-[18px] font-semibold tracking-[-0.04em] text-text-primary"
                >
                  Filters
                </p>
                <button
                  type="button"
                  onClick={resetWorkspaceScope}
                  className="inline-flex h-9 shrink-0 items-center rounded-full border border-border-soft bg-bg-control px-3 text-[12px] font-medium text-text-secondary transition-colors hover:border-border-strong hover:bg-bg-muted hover:text-text-primary"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 space-y-2.5">
                <section
                  className={`overflow-hidden rounded-[24px] border transition-colors ${
                    mobileFilterSection === "branch"
                      ? "border-border-brand bg-bg-brand-soft/20"
                      : "border-border-soft bg-bg-control"
                  }`}
                >
                  <h2>
                    <button
                      id="mobile-filter-branch-button"
                      type="button"
                      aria-expanded={mobileFilterSection === "branch"}
                      aria-controls="mobile-filter-branch-panel"
                      onClick={() => handleMobileFilterSectionToggle("branch")}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border-soft bg-bg-surface text-text-secondary">
                          <BranchesIcon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            Branch
                          </p>
                          <p className="mt-1 truncate text-[15px] font-semibold text-text-primary">
                            {selectedBranch.name}
                          </p>
                        </div>
                      </div>
                      <ChevronDownIcon
                        size={18}
                        className={
                          mobileFilterSection === "branch"
                            ? "shrink-0 rotate-180 text-text-muted transition-transform"
                            : "shrink-0 text-text-muted transition-transform"
                        }
                      />
                    </button>
                  </h2>

                  <div
                    id="mobile-filter-branch-panel"
                    role="region"
                    aria-labelledby="mobile-filter-branch-button"
                    hidden={mobileFilterSection !== "branch"}
                    className="border-t border-border-soft px-3 pb-3 pt-2"
                  >
                    <div className="space-y-1.5">
                      {branchScopeOptions.map((option) => {
                        const isActive = option.id === selectedBranchId;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setSelectedBranchId(option.id)}
                            className={`w-full rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-border-brand bg-bg-brand-soft/60 text-text-primary"
                                : "border-border-soft bg-bg-surface text-text-secondary hover:border-border-strong hover:bg-bg-muted hover:text-text-primary"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="min-w-0 flex-1 truncate text-[13px] font-medium">
                                {option.name}
                              </p>
                              <span
                                className={`inline-flex h-3.5 w-3.5 shrink-0 rounded-full border ${
                                  isActive
                                    ? "border-[4px] border-bg-brand-strong bg-bg-surface"
                                    : "border-border-soft bg-bg-surface"
                                }`}
                              />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <section
                  className={`overflow-hidden rounded-[24px] border transition-colors ${
                    mobileFilterSection === "date"
                      ? "border-border-brand bg-bg-brand-soft/20"
                      : "border-border-soft bg-bg-control"
                  }`}
                >
                  <h2>
                    <button
                      id="mobile-filter-date-button"
                      type="button"
                      aria-expanded={mobileFilterSection === "date"}
                      aria-controls="mobile-filter-date-panel"
                      onClick={() => handleMobileFilterSectionToggle("date")}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border-soft bg-bg-surface text-text-secondary">
                          <CalendarIcon size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
                            Date
                          </p>
                          <p className="mt-1 truncate text-[15px] font-semibold text-text-primary">
                            {timelineLabel}
                          </p>
                        </div>
                      </div>
                      <ChevronDownIcon
                        size={18}
                        className={
                          mobileFilterSection === "date"
                            ? "shrink-0 rotate-180 text-text-muted transition-transform"
                            : "shrink-0 text-text-muted transition-transform"
                        }
                      />
                    </button>
                  </h2>

                  <div
                    id="mobile-filter-date-panel"
                    role="region"
                    aria-labelledby="mobile-filter-date-button"
                    hidden={mobileFilterSection !== "date"}
                    className="border-t border-border-soft px-3 pb-3 pt-2"
                  >
                    <div className="grid grid-cols-2 gap-1.5">
                      {timelinePresetOptions.map((option) => {
                        const isActive = timelineScope.preset === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setTimelinePreset(option.id)}
                            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                              isActive
                                ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                                : "border-border-soft bg-bg-surface text-text-secondary hover:border-border-strong hover:bg-bg-muted hover:text-text-primary"
                            }`}
                          >
                            <span className="block text-[13px] font-medium">
                              {option.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className={`mt-3 rounded-[20px] border p-4 ${
                        timelineScope.preset === "custom"
                          ? "border-border-brand bg-bg-brand-soft/40"
                          : "border-border-soft bg-bg-surface"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">
                            Custom
                          </p>
                        </div>
                        {timelineScope.preset === "custom" ? (
                          <span className="rounded-full bg-bg-surface px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-brand">
                            Active
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <label className="space-y-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                            From
                          </span>
                          <Input
                            type="date"
                            value={customStartDate}
                            onChange={(event) =>
                              setCustomStartDate(event.target.value)
                            }
                            className="rounded-2xl px-3 py-2.5 text-[13px]"
                          />
                        </label>

                        <label className="space-y-1.5">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                            To
                          </span>
                          <Input
                            type="date"
                            value={customEndDate}
                            onChange={(event) =>
                              setCustomEndDate(event.target.value)
                            }
                            className="rounded-2xl px-3 py-2.5 text-[13px]"
                          />
                        </label>
                      </div>

                      <button
                        type="button"
                        disabled={!customRangeIsValid}
                        onClick={() =>
                          handleApplyCustomRange(() =>
                            setMobileWorkspaceOpen(false),
                          )
                        }
                        className={`mt-4 inline-flex h-10 w-full items-center justify-center rounded-full px-4 text-[13px] font-semibold transition-colors ${
                          customRangeIsValid
                            ? "bg-bg-brand-strong text-text-inverse hover:bg-bg-brand-strong"
                            : "cursor-not-allowed bg-bg-muted text-text-subtle"
                        }`}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          ) : null}

          {menuOpen ? (
            <div className="absolute bottom-[calc(100%+12px)] left-1/2 z-20 w-[calc(100vw-2rem)] max-w-[360px] -translate-x-1/2 rounded-[28px] border border-border-soft bg-bg-surface p-4 shadow-[var(--shadow-panel)]">
              <div className="rounded-[22px] border border-border-soft bg-bg-control p-3">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-brand-soft text-[14px] font-semibold text-text-brand">
                    HO
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-text-primary">
                      Howard
                    </p>
                    <p className="truncate text-[12px] text-text-secondary">
                      ops@gymdeck.com
                    </p>
                  </div>

                  <span className="rounded-full bg-bg-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
                    Admin
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <ThemeToggle
                  labelMode="always"
                  className="h-11 w-full justify-between rounded-[18px] border-border-soft bg-bg-control px-3 hover:bg-bg-muted"
                />
                <Link
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[18px] border border-border-soft bg-bg-control px-3 py-3 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-muted"
                >
                  Profile
                </Link>
                <Link
                  href="/support"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-[18px] border border-border-soft bg-bg-control px-3 py-3 text-[13px] font-medium text-text-primary transition-colors hover:bg-bg-muted"
                >
                  Support
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-[18px] border border-transparent bg-bg-control px-3 py-3 text-left text-[13px] font-medium text-text-danger transition-colors hover:bg-bg-muted"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex w-[calc(100vw-2rem)] max-w-[360px] items-center gap-2 rounded-[24px] border border-border-soft bg-bg-page/95 p-1.5 shadow-[var(--shadow-panel)] backdrop-blur-xl">
            <button
              type="button"
              onClick={handleMobileWorkspaceToggle}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors ${
                mobileWorkspaceOpen || workspaceHasCustomScope
                  ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                  : "border-transparent bg-transparent text-text-secondary hover:border-border-soft hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              <FilterIcon size={16} />
              <span>Filters</span>
            </button>

            <button
              type="button"
              onClick={handleMenuToggle}
              className={`inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors ${
                menuOpen
                  ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                  : "border-transparent bg-transparent text-text-secondary hover:border-border-soft hover:bg-bg-surface hover:text-text-primary"
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-bg-brand-soft text-[14px] font-semibold text-text-brand">
                HO
              </span>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
