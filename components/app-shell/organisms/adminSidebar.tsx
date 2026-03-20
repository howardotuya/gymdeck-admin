"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon, SearchIcon, SettingsIcon, SupportIcon } from "@/components/icons";
import { BrandLogo } from "@/components/logo";
import logo from "@/public/assets/logo.png";
import { useState } from "react";
import { NavItem } from "../atoms/navItem";
import { NavGroup } from "../molecules/navGroup";
import {
  isSettingsHubPath,
  navSections,
  workspaceBranches,
  workspaceSummary,
} from "../data";

type AdminSidebarProps = {
  pathname: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ pathname, onNavigate }: AdminSidebarProps) {
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const settingsActive = isSettingsHubPath(pathname);
  const supportActive = pathname === "/support" || pathname.startsWith("/support/");

  return (
    <aside className="flex h-full flex-col bg-bg-page px-3 py-4">
      <div className="px-1.5 py-1">
        <BrandLogo
          wrapperClassName="gap-2"
          imageClassName="h-[16px] w-[28px]"
          textClassName="text-[17px]"
        />
      </div>

      <nav className="mt-6 flex-1 space-y-5 overflow-y-auto pr-0.5">
        {navSections.map((section) => (
          <NavGroup
            key={section.title}
            pathname={pathname}
            section={section}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="mt-4 border-t border-border-soft pt-4">
        <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-subtle">
          Settings
        </p>
        <div className="mt-2 space-y-1">
          <NavItem
            href="/support"
            label="Help & Support"
            icon={SupportIcon}
            active={supportActive}
            onNavigate={onNavigate}
          />
          <NavItem
            href="/settings"
            label="Settings"
            icon={SettingsIcon}
            active={settingsActive}
            onNavigate={onNavigate}
          />
        </div>
      </div>

      <div className="relative mt-4">
        {branchMenuOpen ? (
          <div className="absolute bottom-full left-0 right-0 mb-2.5 rounded-[20px] border border-border-soft bg-bg-surface p-2.5">
            <p className="px-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
              Switch branches
            </p>

            <label className="mt-2.5 flex h-9 items-center gap-2.5 rounded-xl border border-border-soft bg-bg-control px-3">
              <SearchIcon size={16} className="text-text-muted" />
              <input
                type="search"
                placeholder="Search branch"
                className="w-full bg-transparent text-[13px] text-text-primary placeholder:text-text-subtle focus:outline-none"
              />
            </label>

            <div className="mt-2.5 space-y-1.5">
              {workspaceBranches.map((branch) => (
                <button
                  key={`menu-${branch.name}`}
                  type="button"
                  className={clsx(
                    "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors",
                    branch.active
                      ? "border-border-brand bg-bg-brand-soft/60 text-text-brand"
                      : "border-border-soft bg-bg-control text-text-secondary hover:bg-bg-muted hover:text-text-primary",
                  )}
                >
                  <div>
                    <p className="text-[13px] font-medium">{branch.name}</p>
                    <p
                      className={clsx(
                        "mt-1 text-[11px]",
                        branch.active ? "text-text-brand" : "text-text-subtle",
                      )}
                    >
                      {branch.detail}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      "inline-flex h-3.5 w-3.5 rounded-full border",
                      branch.active
                        ? "border-[4px] border-bg-brand-strong bg-bg-surface"
                        : "border-border-soft bg-bg-surface",
                    )}
                  />
                </button>
              ))}
            </div>

            <div className="mt-2.5 border-t border-border-soft pt-2.5">
              <Link
                href="/branches"
                onClick={() => {
                  setBranchMenuOpen(false);
                  onNavigate?.();
                }}
                className="inline-flex text-[12px] font-semibold text-text-brand"
              >
                Manage branches
              </Link>
              <button
                type="button"
                className="mt-2.5 block text-[13px] font-semibold text-text-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        ) : null}

        <div className="rounded-[20px] border border-border-soft bg-bg-control p-2.5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 overflow-hidden rounded-[14px] border border-border-soft bg-bg-surface">
              <Image
                src={logo}
                alt={`${workspaceSummary.name} logo`}
                width={48}
                height={48}
                className="h-full w-full object-contain p-1.5"
              />
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-text-primary">
                {workspaceSummary.name}
              </p>
              <p className="mt-0.5 truncate text-[12px] text-text-secondary">
                {workspaceSummary.activeBranch}
              </p>
              <p className="mt-0.5 text-[11px] text-text-subtle">{workspaceSummary.branchCount}</p>
            </div>

            <button
              type="button"
              aria-label="Open branch switcher"
              onClick={() => setBranchMenuOpen((current) => !current)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-soft bg-bg-surface text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary"
            >
              <ChevronDownIcon
                size={15}
                className={clsx("transition-transform", branchMenuOpen && "rotate-180")}
              />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
