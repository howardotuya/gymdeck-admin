"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  BellIcon,
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
} from "@/components/icons";
import type { AdminPageMeta } from "../data";
import { IconButton } from "../atoms/iconButton";

type AdminTopbarProps = {
  pageMeta: AdminPageMeta;
  onOpenSidebar: () => void;
};

export function AdminTopbar({ pageMeta, onOpenSidebar }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
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

        <div className="hidden min-w-0 flex-1 items-center md:flex">
          <label className="flex h-10 w-full max-w-[420px] items-center gap-3 rounded-full border border-border-soft bg-bg-control px-4">
            <SearchIcon size={17} className="text-text-muted" />
            <input
              type="search"
              placeholder="Search members, classes, or transactions"
              className="w-full bg-transparent text-[14px] leading-[1.4] text-text-primary placeholder:text-text-subtle focus:outline-none"
            />
          </label>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <IconButton label="Notifications">
            <BellIcon size={17} />
          </IconButton>
          <IconButton label="Settings">
            <SettingsIcon size={17} />
          </IconButton>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
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
              <div className="absolute right-0 top-[calc(100%+12px)] w-[280px] rounded-[24px] border border-border-soft bg-bg-surface p-5 shadow-[var(--shadow-panel)]">
                <div className="flex flex-col items-center text-center">
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(214,167,255,0.55)] text-[28px] font-semibold text-text-inverse">
                    G
                  </span>
                  <p className="mt-5 text-[16px] font-semibold text-text-primary">
                    GymDeck HQ
                  </p>
                  <p className="mt-1 text-[14px] text-text-secondary">
                    ops@gymdeck.com
                  </p>
                  <div className="mt-4 flex items-center gap-3 text-[13px] text-text-secondary">
                    <span className="rounded-md bg-bg-warning-soft px-3 py-1 font-semibold text-text-warning">
                      ADMIN
                    </span>
                    <span>GymDeck Admin</span>
                  </div>
                </div>

                <div className="mt-6 space-y-2 border-t border-border-soft pt-4">
                  <Link
                    href="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-[14px] font-medium text-text-primary transition-colors hover:bg-bg-control"
                  >
                    My Profile
                  </Link>
                  <button
                    type="button"
                    className="block w-full rounded-xl px-3 py-3 text-left text-[14px] font-medium text-text-danger transition-colors hover:bg-bg-control"
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
