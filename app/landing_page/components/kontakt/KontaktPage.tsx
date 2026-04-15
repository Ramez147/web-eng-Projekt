"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { InfiniteTextRotation } from "./InfiniteTextRotation";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function KontaktPage() {
  const router = useRouter();
  const [badgeScale, setBadgeScale] = useState(1);
  const contactItems = [
    {
      title: "E-Mail",
      value: "hello@loyaltyflow.de",
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
      <div className="mx-auto max-w-6xl space-y-8">
        <InfiniteTextRotation />

        <Badge
          variant="secondary"
          className="w-fit rounded-full border border-primary/20 bg-primary/10 px-6 py-2 text-2xl font-extrabold tracking-tight text-primary md:text-3xl transition-transform duration-200 will-change-transform"
          style={{ transform: `scale(${badgeScale})`, transformOrigin: "left center" }}
        >
          Kontakt
        </Badge>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="rounded-full" onClick={() => router.back()}>
            Back
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/">Back to Home Page</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-muted-foreground backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            Kostenlose Erstberatung
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-4 py-2 text-muted-foreground backdrop-blur">
            <Clock3 className="h-4 w-4 text-primary" />
            Response in unter 24h
          </span>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="overflow-hidden border-border/60 bg-linear-to-b from-card to-card/90 shadow-xl shadow-primary/10 backdrop-blur">
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
              <div className="grid gap-3 sm:grid-cols-2">
                {contactItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="mb-2 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button size="lg" className="w-full sm:w-auto">
                  Jetzt kontaktieren
                </Button>
                <Button size="lg" variant="ghost" className="w-full sm:w-auto" asChild>
                  <Link href="/">
                    Mehr über LoyaltyFlow
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-card/95 shadow-xl shadow-primary/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl">Schnellkontakt</CardTitle>
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
                  className="w-full rounded-xl border border-border/80 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <input
                  type="email"
                  placeholder="deine@email.com"
                  className="w-full rounded-xl border border-border/80 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nachricht</label>
                <textarea
                  placeholder="Erzähl uns von deinem Projekt..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border/80 bg-background/90 px-3 py-2.5 shadow-sm outline-none transition duration-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <Button className="w-full rounded-xl">Nachricht senden</Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}