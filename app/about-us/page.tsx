import { Badge } from "../landing_page/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../landing_page/components/ui/card";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_26%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.6),transparent_30%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.16))] px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs tracking-wide">
          About Us
        </Badge>

        <Card className="overflow-hidden border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
          <div className="h-1.5 bg-linear-to-r from-primary via-secondary to-primary" />
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl tracking-tight md:text-4xl">
              Warum wir Loyalty neu denken
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7">
              Wir bauen eine API-first Plattform, damit Teams Punkte- und Rewards-Logik nicht
              jedes Mal neu entwickeln muessen.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-sm font-medium">Klare Produktlogik</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Von Membership bis Analytics bleibt alles tenant-faehig, nachvollziehbar und
                schnell integrierbar.
              </p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background p-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
              <p className="text-sm font-medium">Technisch sauber</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Wir setzen auf einfache Ablaufe, gute Lesbarkeit und eine UI, die nicht im Weg
                steht.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
