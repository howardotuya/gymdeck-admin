import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownSLineIcon,
  HeartLineIcon,
  MapPin2LineIcon,
  Search2LineIcon,
} from "@/components/icons";
import { BrandLogo } from "@/components/logo";
import {
  DASHBOARD_LOCATION_LABEL,
  DASHBOARD_NAV_ITEMS,
  DASHBOARD_SEARCH_PLACEHOLDER,
} from "@/components/dashboard/data";

type DashboardTopNavigationProps = {
  activeNavId: string;
};

export function DashboardTopNavigation({ activeNavId }: DashboardTopNavigationProps) {
  return (
    <>
      <header className="hidden border-b border-border-soft bg-bg-surface md:block">
        <div className="flex h-[72px] w-full items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <BrandLogo
              imageClassName="h-[15.93px] w-[28.44px] object-contain"
              textClassName="sr-only"
              wrapperClassName="gap-0"
            />

            <nav className="flex items-center gap-6">
              {DASHBOARD_NAV_ITEMS.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={[
                    "text-[14px] leading-[1.4] transition-colors",
                    item.id === activeNavId
                      ? "font-semibold text-text-brand"
                      : "text-text-secondary hover:text-text-primary",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <label className="flex h-10 w-full max-w-[348px] items-center gap-2 rounded-full bg-bg-control px-5">
            <Search2LineIcon className="size-5 text-text-support" />
            <input
              type="search"
              placeholder={DASHBOARD_SEARCH_PLACEHOLDER}
              className="w-full bg-transparent text-[14px] leading-[1.4] text-text-primary placeholder:text-text-muted focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-6">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-[7px] rounded-full bg-bg-control px-3 text-[14px] leading-[1.4] text-text-support"
            >
              <MapPin2LineIcon className="size-5 text-text-brand" />
              {DASHBOARD_LOCATION_LABEL}
              <ArrowDownSLineIcon className="size-5 text-text-support" />
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex size-10 items-center justify-center rounded-full bg-bg-icon-soft transition-colors hover:bg-bg-subtle"
                aria-label="Saved places"
              >
                <HeartLineIcon className="size-5 text-text-brand" />
              </button>

              <span className="h-[25px] w-px bg-border-soft" aria-hidden="true" />

              <button
                type="button"
                className="inline-flex size-10 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90"
                aria-label="Open profile"
              >
                <Image
                  src="/assets/temp-gym-profile-image.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="size-10 rounded-full object-cover"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-20 border-b border-border-soft bg-bg-surface md:hidden">
        <div className="flex h-16 items-center justify-between border-b border-border-soft px-4">
          <BrandLogo
            imageClassName="h-[19.91px] w-[35.56px] object-contain"
            textClassName="sr-only"
            wrapperClassName="gap-0"
          />

          <label className="flex h-10 w-[242px] items-center gap-[10px] rounded-full bg-bg-muted px-[10px]">
            <Search2LineIcon className="size-5 text-text-support" />
            <input
              type="search"
              placeholder={DASHBOARD_SEARCH_PLACEHOLDER}
              className="w-full bg-transparent text-[14px] leading-[1.4] text-text-primary placeholder:text-text-secondary focus:outline-none"
            />
          </label>

          <Image
            src="/assets/temp-gym-profile-image.png"
            alt="Profile"
            width={40}
            height={40}
            className="size-10 rounded-full object-cover"
          />
        </div>

        <nav className="flex items-center gap-6 px-4 py-4">
          {DASHBOARD_NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={[
                "text-[14px] leading-[1.4] transition-colors",
                item.id === activeNavId
                  ? "font-semibold text-text-brand"
                  : "text-text-secondary hover:text-text-primary",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
