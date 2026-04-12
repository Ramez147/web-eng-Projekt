"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function KontaktPage() {
  const router = useRouter();
  const [badgeScale, setBadgeScale] = useState(1);

  useEffect(() => {
    const maxShrinkDistance = 220;
    const minScale = 0.8;
    const maxScale = 1;

    const handleScroll = () => {
      const progress = Math.min(window.scrollY / maxShrinkDistance, 1);
      const scale = maxScale - progress * (maxScale - minScale);
      setBadgeScale(scale);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_26%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.6),transparent_30%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.16))] px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Badge
          variant="secondary"
          className="w-fit rounded-full px-7 py-3 text-3xl font-bold tracking-tight md:text-4xl transition-transform duration-200 will-change-transform"
          style={{ transform: `scale(${badgeScale})`, transformOrigin: "left center" }}
        >
          Kontakt
        </Badge>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button asChild>
            <Link href="/">Back to Home Page</Link>
          </Button>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="overflow-hidden border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="h-1.5 bg-linear-to-r from-primary via-primary/60 to-secondary" />
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl tracking-tight md:text-4xl">
                Lass uns dein Projekt sauber starten
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                Du hast eine Idee oder ein Problem, das gelöst werden muss? Wir sind hier, um dir zu helfen. Kontaktiere uns für eine kostenlose Erstberatung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-semibold">E-Mail</h3>
                  <p className="text-sm text-muted-foreground">hello@loyaltyflow.de</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Telefon</h3>
                  <p className="text-sm text-muted-foreground">+49 123 456 789</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-sm text-muted-foreground">Musterstraße 123, 12345 Musterstadt</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Antwortzeit</h3>
                  <p className="text-sm text-muted-foreground">Innerhalb von 24 Stunden</p>
                </div>
              </div>
              <Button size="lg" className="w-full sm:w-auto">
                Jetzt kontaktieren
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
            <CardHeader>
              <CardTitle>Schnellkontakt</CardTitle>
              <CardDescription>
                Sende uns eine kurze Nachricht und wir melden uns bei dir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  type="text"
                  placeholder="Dein Name"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <input
                  type="email"
                  placeholder="deine@email.com"
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nachricht</label>
                <textarea
                  placeholder="Erzähl uns von deinem Projekt..."
                  rows={4}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background resize-none"
                />
              </div>
              <Button className="w-full">Nachricht senden</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}