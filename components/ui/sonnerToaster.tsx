"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

type ToasterTheme = "light" | "dark";

function getDocumentTheme(): ToasterTheme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function SonnerToaster() {
  const [theme, setTheme] = useState<ToasterTheme | null>(null);

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setTheme(getDocumentTheme());
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  if (!theme) {
    return null;
  }

  return (
    <Toaster
      closeButton
      position="top-right"
      theme={theme}
      toastOptions={{
        style: {
          fontFamily: "var(--font-britti-sans, sans-serif)",
        },
      }}
    />
  );
}
