import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui";
import type { BookingRow } from "../data";

type BookingMobileCardProps = {
  booking: BookingRow;
  actionsMenu: ReactNode;
};

export function BookingMobileCard({ booking, actionsMenu }: BookingMobileCardProps) {
  return (
    <article className="rounded-[20px] border border-border-soft bg-bg-surface px-4 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] font-semibold text-text-primary">{booking.member}</p>
            <StatusBadge label={booking.status} tone={booking.statusTone} />
          </div>
          <p className="mt-2 text-[13px] text-text-secondary">
            {booking.id} • {booking.passType}
          </p>
        </div>
        <div className="flex items-start gap-2">
          <StatusBadge label={booking.qrState} tone={booking.qrTone} />
          {actionsMenu}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Booking type
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{booking.type}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Branch
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{booking.branch}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Session
          </p>
          <p className="mt-1 text-[14px] text-text-primary">{booking.target}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-subtle">
            Schedule
          </p>
          <p className="mt-1 text-[14px] text-text-primary">
            {booking.date} • {booking.time}
          </p>
        </div>
      </div>
    </article>
  );
}
