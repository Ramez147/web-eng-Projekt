"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRound, ArrowRight, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import TextHighlighter from "@/components/TextHighlighter";

const members = [
  {
    name: "Ramez",
    role: "Produktstrategie und UX",
    tone: "from-primary/20 via-primary/10 to-background",
    description: "Führt die Vision des Produkts an und gestaltet intuitive, benutzerfreundliche Erfahrungen.",
    expertise: ["Strategie", "UX/UI", "User Research"],
  },
  {
    name: "William",
    role: "Full-Stack Entwicklung",
    tone: "from-sky-500/20 via-sky-500/10 to-background",
    description: "Baut die technische Grundlage mit modernen, skalierbaren Lösungen.",
    expertise: ["Backend", "Frontend", "API Design"],
  },
  {
    name: "Arezo",
    role: "Kommunikation und Design",
    tone: "from-emerald-500/20 via-emerald-500/10 to-background",
    description: "Prägt die visuelle Identität und vermittelt unsere Botschaft klar und wirkungsvoll.",
    expertise: ["Design System", "Branding", "Content"],
  },
  {
    name: "Ghaleb",
    role: "Daten, Analytics und Betrieb",
    tone: "from-amber-500/20 via-amber-500/10 to-background",
    description: "Sichert die Stabilität des Systems und extrahiert wertvolle Erkenntnisse aus Daten.",
    expertise: ["Datenanalyse", "DevOps", "Monitoring"],
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
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="w-fit rounded-full px-7 py-3 text-3xl font-bold tracking-tight md:text-4xl transition-transform duration-200 will-change-transform"
            style={{ transform: `scale(${badgeScale})`, transformOrigin: "left center" }}
          >
            <TextHighlighter
              as="span"
              triggerType="inView"
              highlightColor="linear-gradient(135deg, rgb(var(--primary)), rgb(16, 185, 129))"
              direction="ltr"
              transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
              className="font-bold"
            >
              Team
            </TextHighlighter>
          </Badge>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button asChild>
              <Link href="/">Back to Home Page</Link>
            </Button>
          </div>
        </div>

        <Card className="border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Unser Team</span>
            </div>
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              Studierende der Hochschule Flensburg
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Ramez, William, Arezo und Ghaleb arbeiten zusammen an klaren, praktischen und
              professionellen Loyalty-Erfahrungen - jeder mit eigenem Fokus, flexibel ergänzend in jeder Aufgabe.
            </CardDescription>
          </CardHeader>
        </Card>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {members.map((member) => (
            <Card 
              key={member.name} 
              className="group overflow-hidden border-border/60 bg-linear-to-br from-card/90 to-card/70 shadow-xl shadow-primary/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl backdrop-blur"
            >
              <div className="h-1 bg-linear-to-r from-primary via-primary/70 to-emerald-500" />
              
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <Avatar className={`h-16 w-16 rounded-2xl bg-linear-to-br ${member.tone} ring-2 ring-primary/20 shadow-lg`}>
                    <AvatarFallback className="rounded-2xl bg-transparent text-foreground/70">
                      <UserRound className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <ArrowRight className="h-5 w-5 text-primary/0 group-hover:text-primary transition-colors duration-300" />
                </div>
                
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold tracking-tight">{member.name}</CardTitle>
                  <CardDescription className="text-sm font-medium">{member.role}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  {member.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((skill) => (
                    <Badge 
                      key={skill} 
                      variant="secondary" 
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="border-border/60 bg-linear-to-br from-primary/5 to-emerald-500/5 shadow-lg shadow-primary/10 backdrop-blur">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl tracking-tight">
              Zusammen gestalten wir die Zukunft der Treueprogramme
            </CardTitle>
            <CardDescription className="text-base">
              Mit unterschiedlichen Perspektiven und komplementären Fähigkeiten bringen wir LoyaltyFlow zum Leben.
              Jeder Beitrag macht uns stärker.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}
