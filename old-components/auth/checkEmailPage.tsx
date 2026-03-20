"use client";

import type { ClipboardEvent, KeyboardEvent } from "react";
import { useRef, useState } from "react";
import Link from "next/link";
import { MailSendLineIcon } from "@/components/icons";

const verificationInputClassName =
  "h-[63px] min-w-0 rounded-[8px] border border-border-input bg-bg-input text-center text-[24px] leading-none text-text-primary outline-none focus:border-text-brand focus:ring-2 focus:ring-text-brand/20";

const OTP_LENGTH = 6;

export function CheckEmailPage() {
  const [otp, setOtp] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""));
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (!input) return;

    input.focus();
    input.select();
  };

  const handleChange = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    if (!digits) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      const values = digits.slice(0, OTP_LENGTH - index).split("");

      values.forEach((digit, offset) => {
        next[index + offset] = digit;
      });

      const nextFocusIndex = Math.min(index + values.length, OTP_LENGTH - 1);
      setTimeout(() => focusInput(nextFocusIndex), 0);
      return next;
    });
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();

      if (otp[index]) {
        setOtp((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
        return;
      }

      if (index > 0) {
        setOtp((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
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
    if (!pastedDigits) return;

    setOtp((prev) => {
      const next = [...prev];
      const values = pastedDigits.slice(0, OTP_LENGTH - index).split("");

      values.forEach((digit, offset) => {
        next[index + offset] = digit;
      });

      const nextFocusIndex = Math.min(index + values.length, OTP_LENGTH - 1);
      setTimeout(() => focusInput(nextFocusIndex), 0);
      return next;
    });
  };

  return (
    <div className="flex w-full max-w-[358px] flex-col items-center gap-8 md:w-[571px] md:max-w-none md:rounded-[24px] md:bg-bg-surface md:p-14">
      <div className="flex size-[88px] items-center justify-center rounded-full bg-bg-muted">
        <MailSendLineIcon className="size-10 text-text-brand" aria-hidden="true" />
      </div>

      <div className="flex w-full flex-col gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-[1.4] text-text-primary">Check your email</h1>
          <p className="max-w-[373px] text-[14px] leading-[1.4] text-text-secondary">
            Enter the six digit verification code we sent to{" "}
            <span className="font-bold">b*****gt40@gmail.com</span>
          </p>
        </div>

        <form className="grid w-full grid-cols-6 gap-2">
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
        </form>

        <div className="flex flex-col items-center gap-6">
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Didn&apos;t <span className="font-semibold text-text-brand">receive</span> a code?{" "}
            <Link href="#" className="font-semibold text-text-brand">
              Resend
            </Link>
          </p>

          <Link
            href="/auth/login"
            className="inline-flex h-[41px] items-center justify-center rounded-full border border-border-soft px-4 py-3 text-[14px] font-medium leading-normal text-text-support"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
