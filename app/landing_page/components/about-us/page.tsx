"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import TextHighlighter from "@/components/TextHighlighter";

export default function AboutUsPage() {
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
              About Us
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
              <span className="text-sm font-medium text-primary">Über uns</span>
            </div>
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              Warum wir Loyalty neu denken
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Wir bauen eine API-first Plattform, damit Teams Punkte- und Rewards-Logik nicht
              jedes Mal neu entwickeln muessen.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-linear-to-br from-card/50 to-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold tracking-tight">Klare Produktlogik</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Von Membership bis Analytics bleibt alles tenant-fähig, nachvollziehbar und
                schnell integrierbar.
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-linear-to-br from-card/50 to-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <p className="text-sm font-semibold tracking-tight">Technisch sauber</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Wir setzen auf einfache Abläufe, gute Lesbarkeit und eine UI, die nicht im Weg
                steht.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
