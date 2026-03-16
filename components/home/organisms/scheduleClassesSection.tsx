"use client";

import clsx from "clsx";
import Image from "next/image";
import {
  ArrowRightSLineIcon,
  MapPin2LineIcon,
  UserStarLineIcon,
} from "@/components/icons";
import { ChipButton } from "@/components/home/atoms";
import type {
  ClassCategory,
  ClassDay,
  ClassSession,
} from "@/components/home/types";
import { useFakeAuth } from "@/stores/useFakeAuth";
import { useModalStore } from "@/stores/useModalStore";

const CLASS_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "short",
  day: "2-digit",
});
const RESERVATION_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const CLASS_ABOUT_COPY =
  "Discover nearby gyms and fitness studios effortlessly. Input your location to explore a variety of options, from weightlifting to yoga.";
const CLASS_BOOKING_TYPE = "Gym Class";
const CLASS_CONFIRM_AMOUNT_LABEL = "₦32,000";
const CLASS_CANCELLATION_POLICY_COPY =
  "You can cancel up to the start of the class for a complete refund. See our policy for exceptions and further details.";

function formatReservationTimeLabel(schedule: string) {
  const timeLabel = schedule.split("|").at(1)?.trim() ?? schedule;
  const [startTime, endTime] = timeLabel.split("-").map((segment) => segment.trim());

  if (!startTime || !endTime) {
    return timeLabel;
  }

  const endMeridiem = endTime.match(/\b(AM|PM)\b/i)?.[0]?.toUpperCase();
  const startHasMeridiem = /\b(AM|PM)\b/i.test(startTime);
  const formattedStartTime = endMeridiem && !startHasMeridiem ? `${startTime} ${endMeridiem}` : startTime;

  return `${formattedStartTime} - ${endTime}`;
}

type ScheduleClassesSectionProps = {
  categories: ClassCategory[];
  days: ClassDay[];
  sessions: ClassSession[];
  weekRange: string;
  selectedDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onDaySelect: (day: ClassDay) => void;
};

export function ScheduleClassesSection({
  categories,
  days,
  onDaySelect,
  onNextWeek,
  onPreviousWeek,
  selectedDate,
  sessions,
  weekRange,
}: ScheduleClassesSectionProps) {
  const isSignedIn = useFakeAuth((state) => state.isSignedIn);
  const openModal = useModalStore((state) => state.openModal);
  const selectedDayLabel = CLASS_DATE_FORMATTER.format(selectedDate);

  const handleReserveSpot = (session: ClassSession, schedule: string) => {
    if (!isSignedIn) {
      openModal("gymAccessRequired", {});
      return;
    }

    openModal("joinClass", {
      sessionId: session.id,
      classTitle: session.title,
      schedule,
      location: session.location,
      about: CLASS_ABOUT_COPY,
      pricePerSeatLabel: "₦32,000 per seat",
      reservationDate: RESERVATION_DATE_FORMATTER.format(selectedDate),
      reservationTime: formatReservationTimeLabel(schedule),
      bookingType: CLASS_BOOKING_TYPE,
      confirmAmountLabel: CLASS_CONFIRM_AMOUNT_LABEL,
      cancellationPolicyBlurb: CLASS_CANCELLATION_POLICY_COPY,
    });
  };

  return (
    <section className="space-y-10">
      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="text-[18px] leading-[1.4] font-semibold text-text-primary md:text-[24px]">
            Weekly Class Schedule
          </h3>
          <p className="text-[14px] leading-[1.5] text-text-support md:text-[16px]">
            Browse our extensive selection of classes to find the perfect fit
            for your fitness journey.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-[52px_minmax(0,1fr)_52px] items-center md:flex md:items-center md:justify-between">
            <button
              type="button"
              onClick={onPreviousWeek}
              className="inline-flex h-[51px] w-[52px] items-center justify-center rounded-full bg-bg-muted text-[14px] font-medium leading-normal text-text-support transition-colors hover:bg-bg-subtle md:w-[160px] md:gap-2 md:px-4 md:py-4"
            >
              <ArrowRightSLineIcon className="size-5 rotate-180" />
              <span className="hidden md:inline">Previous Week</span>
            </button>

            <p className="text-center text-[16px] leading-[1.4] font-medium text-text-primary md:text-[16px]">
              {weekRange}
            </p>

            <button
              type="button"
              onClick={onNextWeek}
              className="inline-flex h-[51px] w-[52px] items-center justify-center rounded-full bg-bg-muted text-[14px] font-medium leading-normal text-text-support transition-colors hover:bg-bg-subtle md:w-[160px] md:gap-2 md:px-4 md:py-4"
            >
              <span className="hidden md:inline">Next Week</span>
              <ArrowRightSLineIcon className="size-5" />
            </button>
          </div>

          <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden">
            <div className="inline-flex min-w-max gap-4 pr-4">
              {days.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => onDaySelect(day)}
                  className={clsx(
                    "flex h-[85px] w-[82px] shrink-0 flex-col items-center justify-center gap-3 rounded-[12px] bg-bg-muted p-6 text-center transition-colors",
                    day.isActive
                      ? "border-2 border-text-brand bg-bg-surface"
                      : "border-2 border-transparent",
                  )}
                >
                  <p
                    className={clsx(
                      "text-[16px] leading-normal font-normal",
                      day.isActive ? "text-text-brand" : "text-text-support",
                    )}
                  >
                    {day.weekday}
                  </p>
                  <p
                    className={clsx(
                      "text-[24px] leading-normal font-medium",
                      day.isActive ? "text-text-brand" : "text-text-primary",
                    )}
                  >
                    {day.dayNumber}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:grid md:grid-cols-7 md:gap-4">
            {days.map((day) => (
              <button
                key={day.id}
                type="button"
                onClick={() => onDaySelect(day)}
                className={clsx(
                  "flex h-[108px] flex-col items-center justify-center gap-3 rounded-[12px] bg-bg-muted px-[38px] py-6 text-center transition-colors",
                  day.isActive
                    ? "border-2 border-text-brand bg-bg-surface"
                    : "border-2 border-transparent",
                )}
              >
                <p
                  className={clsx(
                    "text-[16px] leading-normal font-normal",
                    day.isActive ? "text-text-brand" : "text-text-support",
                  )}
                >
                  {day.weekday}
                </p>
                <p
                  className={clsx(
                    "text-[24px] leading-normal font-medium",
                    day.isActive ? "text-text-brand" : "text-text-primary",
                  )}
                >
                  {day.dayNumber}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-border-input" />

      <div className="space-y-6">
        <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="inline-flex min-w-max gap-4 pr-4">
            {categories.map((category) => (
              <ChipButton
                key={category.id}
                active={category.isActive}
                className="h-[41px] shrink-0 px-4 py-3 text-[14px] leading-normal font-medium"
              >
                {category.label}
              </ChipButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => {
            const sessionTime = session.schedule.split("|").at(1)?.trim();
            const sessionSchedule = sessionTime
              ? `${selectedDayLabel} | ${sessionTime}`
              : session.schedule;

            return (
              <article
                key={session.id}
                className="relative h-[293px] overflow-hidden rounded-[16px]"
              >
                <Image
                  src="/assets/temp-gym-classes.jpg"
                  alt={`${session.title} class`}
                  width={1050}
                  height={340}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-bg-overlay-soft" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-overlay-strong to-bg-overlay-clear" />

                <div
                  className={clsx(
                    "absolute left-6 top-6 inline-flex w-fit items-center gap-[6px] overflow-hidden rounded-full bg-bg-surface px-2 py-1",
                    session.badge === "Exclusive Class" ? "h-7" : "h-[25px]",
                  )}
                >
                  {session.badge === "Exclusive Class" ? (
                    <UserStarLineIcon className="size-5 text-text-brand" />
                  ) : null}
                  <span className="text-[12px] leading-[1.4] font-medium text-text-brand">
                    {session.badge}
                  </span>
                </div>

                <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-4">
                  <div className="space-y-5 text-text-inverse">
                    <div className="space-y-2">
                      <h5 className="text-[24px] leading-[1.4] font-semibold">
                        {session.title}
                      </h5>
                      <p className="text-[16px] leading-[1.4]">
                        {sessionSchedule}
                      </p>
                    </div>
                    <p className="inline-flex items-center gap-1 text-[14px] leading-[1.4] text-text-inverse">
                      <MapPin2LineIcon className="size-[18px] text-text-inverse" />
                      Location: {session.location}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleReserveSpot(session, sessionSchedule);
                    }}
                    className="hidden h-[49px] shrink-0 items-center justify-center rounded-full bg-bg-surface px-4 text-[14px] font-medium leading-normal text-brand-primary transition-colors hover:bg-bg-page md:inline-flex"
                  >
                    Reserve Spot
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
