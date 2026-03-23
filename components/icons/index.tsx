import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({
  children,
  className,
  size = 20,
  strokeWidth = 1.8,
  ...props
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function DashboardIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="11" rx="2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="17.5" width="7" height="3" rx="1.5" />
    </IconBase>
  );
}

export function BranchesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 21s6-5.1 6-10.5a6 6 0 1 0-12 0C6 15.9 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </IconBase>
  );
}

export function MembersIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M16 20a4 4 0 0 0-8 0" />
      <circle cx="12" cy="10" r="3.5" />
      <path d="M19.5 19a3 3 0 0 0-2.4-2.93" />
      <path d="M17.8 7.5a3 3 0 0 1 0 5.98" />
      <path d="M4.5 19a3 3 0 0 1 2.4-2.93" />
      <path d="M6.2 13.48a3 3 0 0 1 0-5.98" />
    </IconBase>
  );
}

export function BookingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4" y="5" width="16" height="15" rx="3" />
      <path d="M8 3.5v4" />
      <path d="M16 3.5v4" />
      <path d="M4 10.5h16" />
      <path d="m9.5 15 1.8 1.8 3.4-3.8" />
    </IconBase>
  );
}

export function ClassesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="3" />
      <path d="M8 2.5v4" />
      <path d="M16 2.5v4" />
      <path d="M3.5 9h17" />
      <path d="M7.5 13h3" />
      <path d="M13.5 13h3" />
      <path d="M7.5 17h3" />
    </IconBase>
  );
}

export function PlansIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 4.5 7.7v8.6L12 20.5l7.5-4.2V7.7L12 3.5Z" />
      <path d="M12 12.1 4.5 7.7" />
      <path d="M12 12.1 19.5 7.7" />
      <path d="M12 12.1v8.4" />
    </IconBase>
  );
}

export function PaymentsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
      <path d="M3.5 10h17" />
      <path d="M8 15h3" />
      <path d="M14 15h2" />
    </IconBase>
  );
}

export function GymProfileIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4.5 20.5h15" />
      <path d="M6.5 20.5v-11l5.5-4 5.5 4v11" />
      <path d="M9.5 20.5v-5h5v5" />
    </IconBase>
  );
}

export function GalleryIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m6.5 17 4.5-4.5 2.5 2.5 2-2 2 2" />
    </IconBase>
  );
}

export function AmenitiesIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3.5 5.5 6v5.2c0 4 2.6 7.3 6.5 9.3 3.9-2 6.5-5.3 6.5-9.3V6L12 3.5Z" />
      <path d="M9.3 12.3 11 14l3.7-3.8" />
    </IconBase>
  );
}

export function ReviewsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 4.2 2.25 4.56 5.03.73-3.64 3.55.86 5.01L12 15.7l-4.5 2.37.86-5.01-3.64-3.55 5.03-.73L12 4.2Z" />
    </IconBase>
  );
}

export function NotificationsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 16.5h12" />
      <path d="M7.5 16.5v-5a4.5 4.5 0 1 1 9 0v5" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </IconBase>
  );
}

export function StaffIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8.5 20v-1.5a3.5 3.5 0 0 1 3.5-3.5h1.5a3.5 3.5 0 0 1 3.5 3.5V20" />
      <circle cx="13" cy="9" r="3" />
      <path d="M4 11V5.5h5.5" />
      <path d="m4 5.5 4.5 4.5" />
    </IconBase>
  );
}

export function ActivityIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="8.5" />
    </IconBase>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19 12a7 7 0 0 0-.1-1.15l2.1-1.64-2-3.46-2.6 1.06A7.17 7.17 0 0 0 14.4 5L14 2h-4l-.4 3a7.17 7.17 0 0 0-2 1.81L5 5.75l-2 3.46 2.1 1.64A7 7 0 0 0 5 12c0 .39.03.77.1 1.15L3 14.79l2 3.46 2.6-1.06c.58.74 1.25 1.35 2 1.81l.4 3h4l.4-3a7.17 7.17 0 0 0 2-1.81l2.6 1.06 2-3.46-2.1-1.64c.07-.38.1-.76.1-1.15Z" />
    </IconBase>
  );
}

export function SupportIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 16.5a6 6 0 1 0-12 0" />
      <path d="M6 16.5v1a2 2 0 0 0 2 2h1.5" />
      <path d="M18 16.5v1a2 2 0 0 1-2 2h-1.5" />
      <path d="M12 18.5v1.5" />
    </IconBase>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </IconBase>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 12H7" />
      <path d="m12 7-5 5 5 5" />
    </IconBase>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </IconBase>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function MoreVerticalIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="5" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6.5 16.5h11" />
      <path d="M8 16.5v-4.75a4 4 0 1 1 8 0v4.75" />
      <path d="M10.5 19a1.75 1.75 0 0 0 3.5 0" />
    </IconBase>
  );
}

export function HelpCircleIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.8 9.4a2.45 2.45 0 0 1 4.6 1.23c0 1.48-1.8 1.95-2.4 3.12" />
      <circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </IconBase>
  );
}
