"use client";

import { FormEvent, useEffect, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";

type SessionResponse = {
  authenticated?: boolean;
  email?: string | null;
};

export function DashboardSettingsPanel() {
  const [email, setEmail] = useState<string>("Loading...");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadSessionEmail = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        const result = (await response.json()) as SessionResponse;

        if (!isMounted) {
          return;
        }

        if (response.ok && result.authenticated) {
          setEmail(result.email ?? "No e-mail available");
          return;
        }

        setEmail("Not signed in");
      } catch {
        if (isMounted) {
          setEmail("Could not load e-mail");
        }
      }
    };

    void loadSessionEmail();

    return () => {
      isMounted = false;
    };
  }, []);

  function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setStatus("Bitte alle Passwort-Felder ausfüllen.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("Das neue Passwort muss mindestens 8 Zeichen haben.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Neues Passwort und Bestätigung stimmen nicht überein.");
      return;
    }

    setStatus("Passwort-Änderung vorbereitet. API-Verknüpfung kann als nächstes ergänzt werden.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-8">
      <section className="rounded-2xl border border-slate-800 bg-[#0a0a0a] p-6">
        <div className="mb-4 flex items-center gap-2">
          <Mail className="h-4 w-4 text-cyan-300" />
          <h1 className="text-lg font-semibold text-white">Profile</h1>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#070707] px-4 py-3">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current e-mail</p>
          <p className="mt-2 text-sm font-medium text-slate-100">{email}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#0a0a0a] p-6">
        <div className="mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-300" />
          <h2 className="text-lg font-semibold text-white">Change password</h2>
        </div>

        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Aktuell</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-700 bg-[#050505] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25"
              autoComplete="current-password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Neu</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-700 bg-[#050505] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25"
              autoComplete="new-password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Bestätigen</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
              }}
              className="w-full rounded-xl border border-slate-700 bg-[#050505] px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/25"
              autoComplete="new-password"
            />
          </label>

          <button
            type="submit"
            className="inline-flex items-center rounded-xl border border-cyan-500/40 bg-cyan-500/15 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/25"
          >
            Passwort aktualisieren
          </button>

          {status ? <p className="text-sm text-slate-300">{status}</p> : null}
        </form>
      </section>
    </main>
  );
}
