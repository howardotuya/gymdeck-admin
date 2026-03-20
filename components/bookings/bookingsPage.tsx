"use client";

import { useState } from "react";
import { OverviewCard } from "@/components/ui";
import { bookings, getBookingOverview } from "./data";
import { BookingListTable } from "./organisms/bookingListTable";

export function BookingsPage() {
  const [bookingRows, setBookingRows] = useState(bookings);
  const bookingOverview = getBookingOverview(bookingRows);

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {bookingOverview.map((item) => (
          <OverviewCard
            key={item.label}
            label={item.label}
            value={item.value}
            size="hero"
          />
        ))}
      </section>

      <BookingListTable
        bookings={bookingRows}
        onMarkAsUsed={(bookingId) => {
          setBookingRows((currentRows) =>
            currentRows.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    status: "Used",
                    statusTone: "success",
                    qrState: "Validated",
                    qrTone: "success",
                  }
                : booking,
            ),
          );
        }}
        onCancel={(bookingId) => {
          setBookingRows((currentRows) =>
            currentRows.map((booking) =>
              booking.id === bookingId
                ? {
                    ...booking,
                    status: "Cancelled",
                    statusTone: "danger",
                    qrState: "Voided",
                    qrTone: "danger",
                  }
                : booking,
            ),
          );
        }}
      />
    </div>
  );
}
