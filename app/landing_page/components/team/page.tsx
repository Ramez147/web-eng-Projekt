"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const members = [
  {
    name: "Ramez",
    role: "Produktstrategie und UX",
    tone: "from-primary/20 via-primary/10 to-background",
  },
  {
    name: "William",
    role: "Full-Stack Entwicklung",
    tone: "from-sky-500/20 via-sky-500/10 to-background",
  },
  {
    name: "Arezo",
    role: "Kommunikation und Design",
    tone: "from-emerald-500/20 via-emerald-500/10 to-background",
  },
  {
    name: "Ghaleb",
    role: "Daten, Analytics und Betrieb",
    tone: "from-amber-500/20 via-amber-500/10 to-background",
  },
];

export default function TeamPage() {
  const [badgeScale, setBadgeScale] = useState(1);
  const router = useRouter();

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.22),transparent_30%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.55),transparent_30%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.18))] px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Badge
          variant="secondary"
          className="w-fit rounded-full px-7 py-3 text-3xl font-bold tracking-tight md:text-4xl transition-transform duration-200 will-change-transform"
          style={{ transform: `scale(${badgeScale})`, transformOrigin: "left center" }}
        >
          Team
        </Badge>

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
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              Studierende der Hochschule Flensburg
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Ramez, William, Arezo und Ghaleb arbeiten an klaren, praktischen und
              professionellen Loyalty-Erfahrungen - mit Rollen, die sich je nach Aufgabe
              flexibel ergänzen.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {members.map((member) => (
            <Card key={member.name} className="group overflow-hidden border-border/60 bg-card/90 shadow-xl shadow-primary/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl backdrop-blur">
              <div className="h-1 bg-linear-to-r from-primary via-primary/70 to-secondary" />
              <CardHeader className="space-y-3">
                <Avatar className={`h-16 w-16 rounded-3xl bg-linear-to-br ${member.tone} ring-1 ring-border/60`}>
                  <AvatarFallback className="rounded-3xl bg-transparent text-foreground/70">
                    <UserRound className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{member.name}</CardTitle>
                <CardDescription>{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm leading-6 text-muted-foreground">
                Studierender der Hochschule Flensburg mit Fokus auf praxisnahe Umsetzung,
                Teamarbeit und saubere Produktarbeit.
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
