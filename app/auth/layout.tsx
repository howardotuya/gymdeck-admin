import type { ReactNode } from "react";
import Image from "next/image";
import { BrandLogo } from "@/components/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-page md:bg-bg-surface">
      <header className="h-[62px] border-b border-border-soft bg-bg-surface px-4 py-5 md:px-9 md:py-6">
        <BrandLogo
          imageClassName="h-[15.93px] w-[28.44px] object-contain md:h-[18px] md:w-[32px]"
          textClassName="text-[17.78px] leading-[1.5] text-text-logo md:text-[20px]"
        />
      </header>

      <main className="relative min-h-[calc(100vh-62px)] overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/assets/background.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            aria-hidden="true"
          />
        </div>

        <section className="relative mx-auto flex min-h-[calc(100vh-62px)] w-full items-center justify-center px-4 py-16 md:px-0">
          {children}
        </section>
      </main>
    </div>
  );
}
