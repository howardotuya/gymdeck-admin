import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

type PageHeaderBreadcrumb = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: PageHeaderBreadcrumb[];
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumbs,
  action,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={clsx(
        "flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        {breadcrumbs?.length ? (
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[12px] font-medium text-text-secondary"
          >
            {breadcrumbs.map((breadcrumb, index) => (
              <div key={`${breadcrumb.label}-${index}`} className="flex items-center gap-2">
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} className="transition-colors hover:text-text-primary">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-text-primary">{breadcrumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? (
                  <span aria-hidden="true" className="text-text-subtle">
                    /
                  </span>
                ) : null}
              </div>
            ))}
          </nav>
        ) : null}

        {eyebrow ? (
          <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-text-subtle">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2 text-[28px] font-semibold tracking-[-0.05em] text-text-primary">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-[820px] text-[14px] leading-[1.7] text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </section>
  );
}
