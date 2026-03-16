import { MapPin2LineIcon, TimeLineIcon } from "@/components/icons";

type ClassMetaRowProps = {
  location: string;
  schedule: string;
};

export function ClassMetaRow({ location, schedule }: ClassMetaRowProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-bg-surface p-5 text-[14px] leading-[1.4] text-text-emphasis md:flex-row md:items-center md:gap-6">
      <div className="inline-flex items-center gap-1">
        <MapPin2LineIcon className="size-[18px] text-text-support" />
        <span className="truncate">Location: {location}</span>
      </div>

      <span className="hidden h-5 w-px bg-border-soft md:block" aria-hidden="true" />

      <div className="inline-flex items-center gap-1">
        <TimeLineIcon className="size-[18px] text-text-support" />
        <span className="truncate">{schedule}</span>
      </div>
    </div>
  );
}
