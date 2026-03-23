import type { Metadata } from "next";
import localFont from "next/font/local";
import { AppShell } from "@/components/app-shell";
import { ModalHost } from "@/components/modals";
import "./globals.css";

const brittiSans = localFont({
  src: [
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-Light-BF6757bfd494951.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-LightItalic-BF6757bfd48c7c7.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-Regular-BF6757bfd47ffbf.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-RegularItalic-BF6757bfd44e013.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-Semibold-BF6757bfd443a8a.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-SemiboldItalic-BF6757bfd411c3a.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-Bold-BF6757bfd4a96ed.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/britti-sans/BrittiSansTrial-BoldItalic-BF6757bfd4a2285.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-britti-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GymDeck Admin",
    template: "%s | GymDeck Admin",
  },
  description: "Operational dashboard for GymDeck management and staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${brittiSans.variable} antialiased`}>
        <AppShell>{children}</AppShell>
        <ModalHost />
      </body>
    </html>
  );
}
