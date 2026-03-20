import clsx from "clsx";
import Link from "next/link";
import type { ComponentType } from "react";
import type { IconProps } from "@/components/icons";

type NavItemProps = {
  href: string;
  label: string;
  icon: ComponentType<IconProps>;
  active: boolean;
  onNavigate?: () => void;
};

export function NavItem({ href, label, icon: Icon, active, onNavigate }: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        "group relative flex h-11 items-center gap-3 rounded-xl px-2.5 text-[13px] leading-[1.4] transition-all",
        active
          ? "bg-bg-brand-soft/60 text-text-primary"
          : "text-text-secondary hover:bg-bg-control hover:text-text-primary",
      )}
    >
      <span
        className={clsx(
          "absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-full transition-opacity",
          active ? "bg-bg-brand-strong opacity-100" : "opacity-0",
        )}
      />
      <span
        className={clsx(
          "inline-flex h-[34px] w-[34px] items-center justify-center rounded-[10px] transition-colors",
          active
            ? "border border-border-brand bg-bg-surface text-text-brand"
            : "bg-bg-control text-text-muted group-hover:bg-bg-surface group-hover:text-text-primary",
        )}
      >
        <Icon size={16} />
      </span>
      <span className="truncate font-medium">{label}</span>
    </Link>
  );
}
