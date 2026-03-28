"use client";

export const authProviderButtonClassName =
  "flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] py-4 text-[14px] font-medium leading-normal text-text-support transition-colors hover:bg-bg-control";

export function getAuthRouteWithNext(route: string, nextPath: string | null) {
  if (!nextPath) {
    return route;
  }

  const params = new URLSearchParams({
    next: nextPath,
  });

  return `${route}?${params.toString()}`;
}

export function maskEmail(email: string | null) {
  if (!email) {
    return "your email address";
  }

  const [localPart, domain = "gymdeck.africa"] = email.split("@");
  const localStart = localPart.slice(0, 1);
  const localEnd = localPart.slice(-1);

  return `${localStart}${"*".repeat(Math.max(localPart.length - 2, 3))}${localEnd}@${domain}`;
}
