"use client";

import { useEffect } from "react";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  useEffect(() => {
    const root = document.documentElement;

    const hadLight = root.classList.contains("light");
    const hadDark = root.classList.contains("dark");

    root.classList.remove("light", "dark");
    root.classList.add("dark");

    return () => {
      root.classList.remove("dark");

      if (hadLight) {
        root.classList.add("light");
        return;
      }

      if (hadDark) {
        root.classList.add("dark");
      }
    };
  }, []);

  return <>{children}</>;
}
