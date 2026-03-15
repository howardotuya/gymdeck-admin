import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/logo";

const buttonBaseClassName =
  "flex h-[51px] w-full items-center justify-center rounded-full bg-bg-muted px-[10px] py-4 text-[14px] font-medium leading-normal text-text-support";

export function LoginPage() {
  return (
    <div className="flex w-full max-w-[358px] flex-col items-center gap-10 md:w-[571px] md:max-w-none md:rounded-[24px] md:bg-bg-surface md:p-14">
      <div className="hidden items-center justify-center md:flex">
        <BrandLogo />
      </div>

      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex w-full max-w-[324px] flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] leading-[1.4] text-text-primary">Welcome Back!</h1>
          <p className="text-[14px] leading-[1.4] text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-text-brand underline decoration-solid underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="flex w-full flex-col gap-4">
          <form className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="login-email"
                className="text-[12px] font-medium leading-normal text-text-secondary"
              >
                Enter your email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="example@email.com"
                className="h-[51px] w-full rounded-full bg-bg-muted px-4 text-[14px] leading-[1.4] text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-text-brand/30"
              />
            </div>

            <button
              type="submit"
              className="h-[51px] w-full rounded-full bg-brand-primary px-[10px] py-4 text-[14px] font-medium leading-normal text-text-inverse"
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
            <button type="button" className={buttonBaseClassName}>
              Continue with Phone
            </button>

            <button type="button" className={`${buttonBaseClassName} gap-2`}>
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

            <button type="button" className={`${buttonBaseClassName} gap-2`}>
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
        Trouble signing in?{" "}
        <Link href="#" className="text-text-brand">
          Contact us
        </Link>
      </p>
    </div>
  );
}
