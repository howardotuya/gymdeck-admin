import { ArrowRightSLineIcon } from "@/components/icons";

type MembershipHistoryBreadcrumbItem = {
  label: string;
  active?: boolean;
};

type MembershipHistoryBreadcrumbProps = {
  items: MembershipHistoryBreadcrumbItem[];
};

export function MembershipHistoryBreadcrumb({
  items,
}: MembershipHistoryBreadcrumbProps) {
  return (
    <nav aria-label="Membership history breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {index > 0 ? (
              <ArrowRightSLineIcon
                className="size-5 text-text-emphasis"
                aria-hidden="true"
              />
            ) : null}
            <span
              className={[
                "text-[14px] md:text-[16px] leading-[1.5] whitespace-nowrap",
                item.active ? "text-text-emphasis" : "text-text-muted",
              ].join(" ")}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
