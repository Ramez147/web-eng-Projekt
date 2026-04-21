"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { InfiniteTextRotation } from "./InfiniteTextRotation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function KontaktPage() {
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const contactItems = [
    {
      title: "E-Mail",
      value: "kunde.service@loyaltyflow.de",
      icon: Mail,
    },
    {
      title: "Telefon",
      value: "+49 123 456 789",
      icon: Phone,
    },
    {
      title: "Adresse",
      value: "Musterstraße 123, 12345 Musterstadt",
      icon: MapPin,
    },
    {
      title: "Antwortzeit",
      value: "Innerhalb von 24 Stunden",
      icon: Clock3,
    },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setSubmitError("Bitte fülle Name, E-Mail und Nachricht aus.");
      setSubmitMessage(null);
      return;
    }

    setIsSending(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Die Nachricht konnte nicht gesendet werden.");
      }

      form.reset();
      setSubmitMessage(result.message ?? "Danke, deine Nachricht wurde gesendet.");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Die Nachricht konnte nicht gesendet werden.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.22),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.55),transparent_30%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.18))] px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <InfiniteTextRotation />

        <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button asChild>
              <Link href="/">Back to Home Page</Link>
            </Button>
          </div>

        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Kontaktiere uns</span>
            </div>
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              Lass uns dein Projekt sauber starten
            </CardTitle>
            <CardDescription className="max-w-2xl text-base leading-7">
              Du hast eine Idee oder ein Problem, das gelöst werden muss? Wir sind hier, um dir zu helfen. Kontaktiere uns für eine kostenlose Erstberatung.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border/60 bg-linear-to-br from-card/50 to-background p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-sm">{item.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" className="w-full sm:w-auto bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90">
                  Jetzt kontaktieren
                </Button>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto border border-primary/15 bg-background/70 text-foreground hover:bg-primary/5" asChild>
                  <Link href="/">
                    Mehr über LoyaltyFlow
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <Card className="border-border/60 bg-card/95 shadow-xl shadow-primary/5 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-2xl">Schnellkontakt</CardTitle>
                <CardDescription>
                  Sende uns eine kurze Nachricht und wir melden uns bei dir.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Dein Name"
                      className="w-full rounded-xl border border-primary/15 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">E-Mail</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="deine@email.com"
                      className="w-full rounded-xl border border-primary/15 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nachricht</label>
                    <textarea
                      name="message"
                      placeholder="Erzähl uns von deinem Projekt..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-primary/15 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  {submitError ? (
                    <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {submitError}
                    </p>
                  ) : null}

                  {submitMessage ? (
                    <p className="rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
                      {submitMessage}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isSending}
                    className="w-full rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSending ? "Wird gesendet..." : "Nachricht senden"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}