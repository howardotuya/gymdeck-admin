"use client";

import { SettingsIcon, SupportIcon } from "@/components/icons";
import { BrandLogo } from "@/components/logo";
import { NavItem } from "../atoms/navItem";
import { NavGroup } from "../molecules/navGroup";
import { isSettingsHubPath, navSections } from "../data";

type AdminSidebarProps = {
  pathname: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ pathname, onNavigate }: AdminSidebarProps) {
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
    </aside>
  );
}
