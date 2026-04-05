"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import pilotImg from "../assets/pilot.png";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

type AuthMode = "signin" | "signup";

const initialForm: LoginForm = {
  email: "",
  password: "",
  remember: false,
};

export const Login = () => {
  const pilotSrc = typeof pilotImg === "string" ? pilotImg : pilotImg.src;
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>(initialForm);
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Bitte gib deine E-Mail und dein Passwort ein.");
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!isValidEmail) {
      setError("Bitte gib eine gueltige E-Mail-Adresse ein.");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const result = (await response.json()) as
        | { user?: unknown; session?: unknown; error?: string }
        | undefined;

      if (!response.ok) {
        setError(result?.error ?? "Der Vorgang konnte nicht abgeschlossen werden.");
        return;
      }

      if (mode === "signin") {
        setSuccess("Anmeldung erfolgreich. Deine Session wurde als Cookie gespeichert.");
        router.replace("/dashboard");
      } else {
        setSuccess(
          result?.session
            ? "Registrierung erfolgreich. Deine Session wurde als Cookie gespeichert."
            : "Registrierung erfolgreich. Bitte bestaetige deine E-Mail, falls Supabase-Bestaetigung aktiviert ist."
        );
        if (result?.session) {
          router.replace("/dashboard");
        }
      }
      setForm((prev) => ({ ...prev, password: "" }));
    } catch {
      setError("Der Vorgang konnte nicht abgeschlossen werden. Bitte erneut versuchen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="anmeldung"
      className="py-20 sm:py-24"
    >
      <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <div className="w-fit rounded-full border border-primary/30 bg-primary/10 p-1 text-sm font-medium text-primary">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  mode === "signin" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
              >
                Anmelden
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`rounded-full px-3 py-1 transition-colors ${
                  mode === "signup" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
              >
                Registrieren
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            {mode === "signin"
              ? "Melde dich an und steuere dein Loyalty-System zentral."
              : "Erstelle einen Account und starte mit deinem Loyalty-System."}
          </h2>

          <p className="max-w-xl text-lg text-muted-foreground">
            {mode === "signin"
              ? "Greife auf Kampagnen, Teilnehmer und Belohnungen zu. Alles in einer klaren Oberflaeche mit dem gleichen Look wie deine Landing Page."
              : "Lege dein Konto an und nutze direkt dieselbe klare Oberflaeche fuer Kampagnen, Teilnehmer und Belohnungen."}
          </p>

          <div className="rounded-2xl border bg-muted/40 p-4">
            <img
              src={pilotSrc}
              alt="Illustration einer Person mit Helm"
              className="mx-auto w-full max-w-xs"
            />
          </div>
        </div>

        <Card className="border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>{mode === "signin" ? "Anmeldung" : "Registrierung"}</CardTitle>
            <CardDescription>
              {mode === "signin"
                ? "Nutze deine E-Mail und dein Passwort, um dich einzuloggen."
                : "Nutze deine E-Mail und ein Passwort, um dich zu registrieren."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  E-Mail
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@beispiel.de"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    {mode === "signin" ? "Passwort" : "Passwort festlegen"}
                  </label>
                  <a
                    href={mode === "signin" ? "#" : "#anmeldung"}
                    className="text-sm text-primary hover:underline"
                  >
                    {mode === "signin" ? "Passwort vergessen?" : "Schon ein Konto?"}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>

              {mode === "signin" ? (
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input"
                    checked={form.remember}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, remember: event.target.checked }))
                    }
                  />
                  Angemeldet bleiben
                </label>
              ) : null}

              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              {success ? <p className="text-sm text-primary">{success}</p> : null}

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? mode === "signin"
                    ? "Anmeldung laeuft..."
                    : "Registrierung laeuft..."
                  : mode === "signin"
                    ? "Jetzt anmelden"
                    : "Jetzt registrieren"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {mode === "signin" ? "Noch kein Konto?" : "Schon registriert?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="text-primary hover:underline"
                >
                  {mode === "signin" ? "Jetzt registrieren" : "Jetzt anmelden"}
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
