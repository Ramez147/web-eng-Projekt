"use client";

import { LogOut } from "lucide-react";

type LogoutButtonProps = {
  className?: string;
};

export function LogoutButton({ className = "" }: LogoutButtonProps) {
  async function handleLogout() {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      credentials: "include",
    });

    const result = (await response.json()) as { success?: boolean; error?: string };

    if (!response.ok || !result.success) {
      throw new Error(result.error ?? "Abmeldung fehlgeschlagen");
    }

    window.location.assign("/");
  }

  return (
    <button
      type="button"
      onClick={() => {
        void handleLogout();
      }}
      className={`inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white ${className}`}
    >
      <LogOut className="h-3.5 w-3.5" />
      Logout
    </button>
  );
}