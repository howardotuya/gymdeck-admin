"use client";

import type { ClipboardEvent, FormEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MailIcon } from "@/components/icons";
import { useFakeAuth } from "@/stores/useFakeAuth";
import { getAuthRouteWithNext, maskEmail } from "./shared";

const verificationInputClassName =
  "h-[63px] min-w-0 rounded-[8px] border border-border-input bg-bg-input text-center text-[24px] leading-none text-text-primary outline-none focus:border-text-brand focus:ring-2 focus:ring-text-brand/20";

const OTP_LENGTH = 6;

export function CheckEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pendingEmail = useFakeAuth((state) => state.pendingEmail);
  const authMode = useFakeAuth((state) => state.authMode);
  const redirectPath = useFakeAuth((state) => state.redirectPath);
  const completeAuth = useFakeAuth((state) => state.completeAuth);
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const nextPath = searchParams.get("next");
  const loginHref = getAuthRouteWithNext("/auth/login", nextPath);
  const isOtpComplete = otp.every((digit) => digit.length === 1);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (!input) {
      return;
    }

    input.focus();
    input.select();
  };

  const handleChange = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");

    if (!digits) {
      setOtp((currentOtp) => {
        const nextOtp = [...currentOtp];
        nextOtp[index] = "";
        return nextOtp;
      });
      return;
    }

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      const values = digits.slice(0, OTP_LENGTH - index).split("");

      values.forEach((digit, offset) => {
        nextOtp[index + offset] = digit;
      });

      const nextFocusIndex = Math.min(index + values.length, OTP_LENGTH - 1);
      setTimeout(() => focusInput(nextFocusIndex), 0);
      return nextOtp;
    });
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (otp[index]) {
        setOtp((currentOtp) => {
          const nextOtp = [...currentOtp];
          nextOtp[index] = "";
          return nextOtp;
        });
        return;
      }

      if (index > 0) {
        setOtp((currentOtp) => {
          const nextOtp = [...currentOtp];
          nextOtp[index - 1] = "";
          return nextOtp;
        });
        focusInput(index - 1);
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData.getData("text").replace(/\D/g, "");

    if (!pastedDigits) {
      return;
    }

    setOtp((currentOtp) => {
      const nextOtp = [...currentOtp];
      const values = pastedDigits.slice(0, OTP_LENGTH - index).split("");

      values.forEach((digit, offset) => {
        nextOtp[index + offset] = digit;
      });

      const nextFocusIndex = Math.min(index + values.length, OTP_LENGTH - 1);
      setTimeout(() => focusInput(nextFocusIndex), 0);
      return nextOtp;
    });
  };

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isOtpComplete) {
      toast.error("Enter the full six-digit verification code.");
      return;
    }

    completeAuth();
    router.replace(redirectPath ?? "/");
  };

  const handleResend = () => {
    toast.success("A new verification code is queued for this demo flow.");
  };

  return (
    <div className="flex w-full max-w-[358px] flex-col items-center gap-8 md:w-[571px] md:max-w-none md:rounded-[24px] md:bg-bg-surface md:p-14">
      <div className="flex size-[88px] items-center justify-center rounded-full bg-bg-muted">
        <MailIcon className="size-10 text-text-brand" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-[1.4] text-text-primary">Check your email</h1>
          <p className="max-w-[373px] text-[14px] leading-[1.4] text-text-secondary">
            Enter the six digit verification code we sent to{" "}
            <span className="font-bold">{maskEmail(pendingEmail)}</span> to finish{" "}
            {authMode === "register" ? "setting up your account" : "signing in"}.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleVerify}>
          <div className="grid w-full grid-cols-6 gap-2">
            {Array.from({ length: OTP_LENGTH }, (_, index) => (
              <label key={index} className="contents">
                <span className="sr-only">{`Verification code digit ${index + 1}`}</span>
                <input
                  type="text"
                  ref={(input) => {
                    inputRefs.current[index] = input;
                  }}
                  value={otp[index]}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  enterKeyHint="done"
                  className={verificationInputClassName}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={(event) => handlePaste(index, event)}
                  onFocus={(event) => event.target.select()}
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="h-[51px] w-full rounded-full bg-brand-primary px-[10px] py-4 text-[14px] font-medium leading-normal text-text-inverse transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!isOtpComplete}
          >
            Verify and continue
          </button>
        </form>

        <div className="flex flex-col items-center gap-6">
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Didn&apos;t <span className="font-semibold text-text-brand">receive</span> a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-text-brand"
            >
              Resend
            </button>
          </p>

          <Link
            href={loginHref}
            className="inline-flex h-[41px] items-center justify-center rounded-full border border-border-soft px-4 py-3 text-[14px] font-medium leading-normal text-text-support"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
