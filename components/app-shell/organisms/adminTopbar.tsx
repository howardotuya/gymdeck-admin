"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  BranchesIcon,
  ChevronDownIcon,
  MenuIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme";
import {
  branchScopeOptions,
  getBranchScopeOption,
  useBranchScopeStore,
} from "@/stores/useBranchScopeStore";
import type { AdminPageMeta } from "../data";
import { IconButton } from "../atoms/iconButton";

type AdminTopbarProps = {
  pageMeta: AdminPageMeta;
  onOpenSidebar: () => void;
};

export function AdminTopbar({ pageMeta, onOpenSidebar }: AdminTopbarProps) {
  const selectedBranchId = useBranchScopeStore((state) => state.selectedBranchId);
  const setSelectedBranchId = useBranchScopeStore((state) => state.setSelectedBranchId);
  const selectedBranch = getBranchScopeOption(selectedBranchId);
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const branchMenuRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (!branchMenuRef.current?.contains(target)) {
        setBranchMenuOpen(false);
      }

      if (!menuRef.current?.contains(target)) {
        setMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border-soft bg-bg-page">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
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

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <IconButton label="Notifications">
            <BellIcon size={17} />
          </IconButton>

          <div ref={branchMenuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setBranchMenuOpen((current) => {
                  const nextOpen = !current;

                  if (nextOpen) {
                    setMenuOpen(false);
                  }

                  return nextOpen;
                });
              }}
              className="inline-flex h-11 max-w-[172px] items-center gap-2 rounded-full border border-border-soft bg-bg-surface pl-1.5 pr-3 text-left"
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
                  <p className="text-[13px] font-semibold text-text-primary">Branch scope</p>
                  <p className="mt-1 text-[12px] text-text-subtle">
                    Web and module views follow this selection.
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
                          <p className="truncate text-[13px] font-medium">{option.name}</p>
                          <p
                            className={`mt-1 truncate text-[11px] ${
                              isActive ? "text-text-brand" : "text-text-subtle"
                            }`}
                          >
                            {option.detail}
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
              onClick={() => {
                setMenuOpen((current) => {
                  const nextOpen = !current;

                  if (nextOpen) {
                    setBranchMenuOpen(false);
                  }

                  return nextOpen;
                });
              }}
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
                    <p className="truncate text-[14px] font-semibold text-text-primary">Howard</p>
                    <p className="truncate text-[12px] text-text-secondary">ops@gymdeck.com</p>
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
  );
}
