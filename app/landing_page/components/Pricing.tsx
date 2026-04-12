import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Check } from "lucide-react";

enum PopularPlanType {
  NO = 0,
  YES = 1,
}

interface PricingProps {
  title: string;
  popular: PopularPlanType;
  price: string;
  description: string;
  buttonText: string;
  benefitList: string[];
}

const pricingList: PricingProps[] = [
  {
    title: "Starter",
    popular: 0,
    price: "0€",
    description: "Zum Ausprobieren für kleine Teams oder erste Loyalty-Pilotprojekte.",
    buttonText: "Kostenlos testen",
    benefitList: [
      "Bis 100 Kunden",
      "Basis-Regeln für Punkte",
      "1 Kampagne",
      "E-Mail Support",
      "API Read Access",
    ],
  },
  {
    title: "Growth",
    popular: 1,
    price: "49€",
    description: "Der Bestseller für wachsende Marken mit API-Zugang und Automationen.",
    buttonText: "Demo anfragen",
    benefitList: [
      "Unbegrenzte Kundenprofile",
      "REST API + Webhooks",
      "Segmentierung in Echtzeit",
      "Reward-Automationen",
      "Priority Support",
    ],
  },
  {
    title: "Enterprise",
    popular: 0,
    price: "Kontakt",
    description: "Für White-Label, individuelle SLAs und unbegrenzte Skalierung.",
    buttonText: "Sales kontaktieren",
    benefitList: [
      "White-label Portal",
      "Custom SLA",
      "SSO & Rollenverwaltung",
      "Dedizierte Architektur",
      "Onboarding Support",
    ],
  },
];

export const Pricing = () => {
  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Wähle den Plan, der
        <span className="bg-linear-to-b from-primary/60 to-primary text-transparent bg-clip-text">
          {" "}
          mit deinem Loyalty-Programm wächst
        </span>
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Klare Preisstruktur für Self-Service, wachsende Marken und Enterprise-Setups.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps) => (
          <Card
            key={pricing.title}
            className={
              pricing.popular === PopularPlanType.YES
                ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }
          >
            <CardHeader>
              <CardTitle className="flex item-center justify-between">
                {pricing.title}
                {pricing.popular === PopularPlanType.YES ? (
                  <Badge
                    variant="secondary"
                    className="text-sm text-primary"
                  >
                    Most popular
                  </Badge>
                ) : null}
              </CardTitle>
              <div>
                <span className="text-3xl font-bold">{pricing.price}</span>
                <span className="text-muted-foreground">
                  {pricing.price === "Kontakt" ? " / individuell" : " / month"}
                </span>
              </div>

              <CardDescription>{pricing.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <Button className="w-full">{pricing.buttonText}</Button>
            </CardContent>

            <hr className="w-4/5 m-auto mb-4" />

            <CardFooter className="flex">
              <div className="space-y-4">
                {pricing.benefitList.map((benefit: string) => (
                  <span
                    key={benefit}
                    className="flex"
                  >
                    <Check className="text-green-500" />{" "}
                    <h3 className="ml-2">{benefit}</h3>
                  </span>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
