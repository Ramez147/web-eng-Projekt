import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Activity, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export const HeroCards = () => {
  return (
    <div className="hidden lg:flex flex-row flex-wrap gap-8 relative w-[700px] h-[520px]">
      <Card className="absolute w-[360px] -top-[15px] left-0 drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-primary/10 bg-gradient-to-br from-background to-primary/5">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <Avatar>
            <AvatarImage
              alt=""
              src="https://github.com/shadcn.png"
            />
            <AvatarFallback>SH</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <CardTitle className="text-lg">Live Loyalty Overview</CardTitle>
            <CardDescription>points.flow / customers.segmented</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-2xl border bg-muted/40 p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Points issued today</span>
              <span className="font-medium text-foreground">+4,820</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-primary/10">
              <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-primary to-emerald-500" />
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Reward rules synced from your API in under 60 seconds.</span>
          </div>
        </CardContent>
      </Card>

      <Card className="absolute left-[10px] top-4 w-80 drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-primary/10">
        <CardHeader>
          <CardTitle className="flex item-center justify-between">
            Campaign Engine
            <Badge
              variant="secondary"
              className="text-sm text-primary"
            >
              Live
            </Badge>
          </CardTitle>
          <div>
            <span className="text-3xl font-bold">1€ = 1 Punkt</span>
          </div>

          <CardDescription>
            Passe Regeln, Trigger und Belohnungen an jede Marke an. Kein Vendor
            Lock-in, kein manuelles Spreadsheet-Chaos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button className="w-full bg-primary text-primary-foreground">
            Regel-Engine öffnen
          </Button>
        </CardContent>

        <hr className="w-4/5 m-auto mb-4" />

        <CardFooter className="flex">
          <div className="space-y-4 text-sm text-muted-foreground">
            {[
              "Tiered rewards for VIP customers",
              "Promo codes and campaigns in one place",
              "Segments updated in real time",
            ].map((benefit: string) => (
              <span
                key={benefit}
                className="flex items-start gap-2"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                <h3>{benefit}</h3>
              </span>
            ))}
          </div>
        </CardFooter>
      </Card>

      <Card className="absolute w-[350px] left-[30px] bottom-[40px] drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-primary/10 bg-gradient-to-br from-background to-emerald-500/5">
        <CardHeader className="space-y-1 flex md:flex-row justify-start items-start gap-4">
          <div className="mt-1 bg-primary/10 p-3 rounded-2xl text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Echtzeit-Analytics</CardTitle>
            <CardDescription className="text-md mt-2">
              Sieh sofort, welche Kampagnen Umsatz bringen, welche Segmente
              aktiv sind und welche Kunden zum Wiederkauf zurückkehren.
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};
