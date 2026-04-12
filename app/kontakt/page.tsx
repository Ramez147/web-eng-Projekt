import { Badge } from "../landing_page/components/ui/badge";
import { Button } from "../landing_page/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../landing_page/components/ui/card";

export default function KontaktPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.24),transparent_26%),radial-gradient(circle_at_bottom_right,hsl(var(--secondary)/0.6),transparent_30%),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--secondary)/0.16))] px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-xs tracking-wide">
          Kontakt
        </Badge>

        <section className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <Card className="overflow-hidden border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="h-1.5 bg-linear-to-r from-primary via-primary/60 to-secondary" />
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl tracking-tight md:text-4xl">
                Lass uns dein Projekt sauber starten
              </CardTitle>
              <CardDescription className="max-w-2xl text-base leading-7">
                Ob Fragen zur Integration, zur Membership-Logik oder zum Design deiner
                Loyalty-Flows - wir antworten direkt und ohne Umwege.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    E-Mail
                  </p>
                  <p className="mt-2 text-sm font-medium">contact@loyaltyflow.dev</p>
                </div>
                <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Antwortzeit
                  </p>
                  <p className="mt-2 text-sm font-medium">meist innerhalb eines Werktags</p>
                </div>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                Am schnellsten erreichst du uns per Mail. Wenn du direkt loslegen willst,
                schreib uns einfach kurz, worum es geht.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button>Termin anfragen</Button>
                <Button variant="outline">E-Mail schreiben</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border/60 bg-card/90 shadow-xl shadow-primary/5 backdrop-blur">
            <div className="h-1.5 bg-linear-to-r from-secondary via-primary/60 to-primary" />
            <CardHeader>
              <CardTitle className="text-xl">Wofuer wir da sind</CardTitle>
              <CardDescription>
                Kurz, konkret und auf Produktteams ausgerichtet.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background px-4 py-3 shadow-sm">API-Integration und technische Beratung</div>
              <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background px-4 py-3 shadow-sm">Einrichtung von Points, Rewards und Memberships</div>
              <div className="rounded-3xl border border-border/60 bg-linear-to-br from-secondary/70 to-background px-4 py-3 shadow-sm">Support beim produktiven Go-Live</div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
