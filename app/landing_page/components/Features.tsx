import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface FeatureProps {
  title: string;
  description: string;
  points: string[];
}

const features: FeatureProps[] = [
  {
    title: "Flexibles Punktesystem",
    description:
      "Du bestimmst die Regeln. Ob 1€ = 1 Punkt, doppelte Punkte am Wochenende oder VIP-Belohnungen - alles lässt sich pro Marke anpassen.",
    points: ["Regeln pro Brand", "VIP-Tiers", "Kampagnen-Trigger"],
  },
  {
    title: "Einfache Integration via API",
    description:
      "Infrastruktur, die mitwächst. Unsere REST-API lässt sich nahtlos in Shopify, WooCommerce oder deine eigene App einbinden.",
    points: ["REST API", "Webhooks", "SDK-ready"],
  },
  {
    title: "Echtzeit-Analytics",
    description:
      "Verstehe deine Kunden sofort. Sieh aktive Segmente, Kampagnen-Performance und die Kunden mit der höchsten Wiederkaufsrate.",
    points: ["Live Dashboards", "Retention KPIs", "Segment Reports"],
  },
];

const featureList: string[] = [
  "Punkte & Rewards",
  "REST API",
  "White-label",
  "Realtime Events",
  "Fraud Controls",
  "Customer Segments",
];

export const Features = () => {
  return (
    <section
      id="features"
      className="container py-24 sm:py-32 space-y-8"
    >
      <h2 className="text-3xl lg:text-4xl font-bold md:text-center">
        Loyalty-Features, die{" "}
        <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          Umsatz und Wiederkäufe
        </span>
        {' '}
        steigern
      </h2>

      <div className="flex flex-wrap md:justify-center gap-4">
        {featureList.map((feature: string) => (
          <div key={feature}>
            <Badge
              variant="secondary"
              className="text-sm"
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map(({ title, description, points }: FeatureProps) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>

            <CardContent>{description}</CardContent>

            <CardFooter>
              <div className="flex flex-wrap gap-2">
                {points.map((point) => (
                  <Badge
                    key={point}
                    variant="secondary"
                  >
                    {point}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
