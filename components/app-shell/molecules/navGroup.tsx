import {
  ActivityIcon,
  AmenitiesIcon,
  BookingsIcon,
  BranchesIcon,
  ClassesIcon,
  DashboardIcon,
  GalleryIcon,
  GymProfileIcon,
  MembersIcon,
  NotificationsIcon,
  PaymentsIcon,
  PlansIcon,
  ReviewsIcon,
  SettingsIcon,
  StaffIcon,
  SupportIcon,
} from "@/components/icons";
import type { NavSection } from "../data";
import { NavItem } from "../atoms/navItem";

type NavGroupProps = {
  pathname: string;
  section: NavSection;
  onNavigate?: () => void;
};

const iconMap = {
  dashboard: DashboardIcon,
  branches: BranchesIcon,
  members: MembersIcon,
  bookings: BookingsIcon,
  classes: ClassesIcon,
  plans: PlansIcon,
  payments: PaymentsIcon,
  gymProfile: GymProfileIcon,
  gallery: GalleryIcon,
  amenities: AmenitiesIcon,
  reviews: ReviewsIcon,
  notifications: NotificationsIcon,
  staff: StaffIcon,
  activity: ActivityIcon,
  settings: SettingsIcon,
  support: SupportIcon,
};

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavGroup({ pathname, section, onNavigate }: NavGroupProps) {
  return (
    <div className="space-y-2">
      <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-text-subtle">
        {section.title}
      </p>
      <div className="space-y-1">
        {section.items.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={iconMap[item.icon]}
            active={isPathActive(pathname, item.href)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
