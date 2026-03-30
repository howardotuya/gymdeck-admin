"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/logo";
import { Input } from "@/components/ui";
import { useFakeAuth } from "@/stores/useFakeAuth";
import { authProviderButtonClassName, getAuthRouteWithNext } from "./shared";

export function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const beginAuth = useFakeAuth((state) => state.beginAuth);
  const [email, setEmail] = useState("");
  const nextPath = searchParams.get("next");
  const loginHref = getAuthRouteWithNext("/auth/login", nextPath);
  const checkEmailHref = getAuthRouteWithNext("/auth/check-email", nextPath);
  const isSubmitDisabled = email.trim().length === 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Enter an email address to continue.");
      return;
    }

    beginAuth({
      email: normalizedEmail,
      mode: "register",
      redirectPath: nextPath,
    });
    router.push(checkEmailHref);
  };

  const handleMockProvider = (provider: string) => {
    toast(provider);
  };

  return (
    <div className="flex w-full max-w-[358px] flex-col items-center gap-10 md:w-[571px] md:max-w-none md:rounded-[24px] md:bg-bg-surface md:p-14">
      <div className="hidden items-center justify-center md:flex">
        <BrandLogo />
      </div>

      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-full max-w-[324px] flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-[1.4] text-text-primary">
            Create your account
          </h1>
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Already have an account?{" "}
            <Link
              href={loginHref}
              className="text-text-brand underline decoration-solid underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="register-email"
                className="text-[12px] font-medium leading-normal text-text-secondary"
              >
                Enter your email
              </label>
              <Input
                id="register-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@email.com"
                className="h-[51px] rounded-full bg-bg-muted"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="h-[51px] w-full rounded-full bg-brand-primary px-[10px] py-4 text-[14px] font-medium leading-normal text-text-inverse transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue
            </button>
          </form>

          <div className="relative h-[38px] w-full">
            <div className="absolute left-0 right-0 top-1/2 border-t border-border-divider" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg-page px-[6px] py-[10px] text-[14px] leading-[1.4] text-text-support md:bg-bg-surface">
              Or
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              className={authProviderButtonClassName}
              onClick={() =>
                handleMockProvider("Phone sign-up stays mocked in this build.")
              }
            >
              Continue with Phone
            </button>

            <button
              type="button"
              className={`${authProviderButtonClassName} gap-2`}
              onClick={() =>
                handleMockProvider("Google sign-up stays mocked in this build.")
              }
            >
              <Image
                src="/assets/google.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
                aria-hidden="true"
              />
              Continue with Google
            </button>

            <button
              type="button"
              className={`${authProviderButtonClassName} gap-2`}
              onClick={() =>
                handleMockProvider(
                  "Facebook sign-up stays mocked in this build.",
                )
              }
            >
              <Image
                src="/assets/facebook.svg"
                alt=""
                width={20}
                height={20}
                className="size-5"
                aria-hidden="true"
              />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>

      <p className="w-full text-center text-[14px] leading-[1.4] text-text-secondary md:w-[370px]">
        By getting started, you agree with our{" "}
        <Link href="#" className="text-text-brand">
          Terms of Use
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-text-brand">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
