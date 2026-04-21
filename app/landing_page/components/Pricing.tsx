"use client";

import { MouseEvent } from "react";
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
import { Check, X } from "lucide-react";

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
  missingList?: string[];
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
    missingList: [
      "Keine REST API Writes",
      "Keine Echtzeit-Segmentierung",
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
  const handleGlowMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty("--glow-x", `${x}px`);
    card.style.setProperty("--glow-y", `${y}px`);
  };

  const handleGlowEnter = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.classList.add("pricing-glow-active");
  };

  const handleGlowLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.classList.remove("pricing-glow-active");
    card.style.removeProperty("--glow-x");
    card.style.removeProperty("--glow-y");
  };

  return (
    <section
      id="pricing"
      className="container py-24 sm:py-32"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        Wähle den Plan, der
        <span className="bg-linear-to-b from-primary/60 to-primary bg-clip-text">
          {" "}
          mit deinem Loyalty-Programm wächst
        </span>
      </h2>
      <h3 className="text-xl text-center text-muted-foreground pt-4 pb-8">
        Klare Preisstruktur für Self-Service, wachsende Marken und Enterprise-Setups.
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {pricingList.map((pricing: PricingProps, index: number) => (
          <Card
            key={pricing.title}
            onMouseMove={handleGlowMove}
            onMouseEnter={handleGlowEnter}
            onMouseLeave={handleGlowLeave}
            className={`pricing-glow-card pricing-glow-${index + 1} ${
              pricing.popular === PopularPlanType.YES
                ? "pricing-glow-popular drop-shadow-xl shadow-black/10 dark:shadow-white/10"
                : ""
            }`}
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

                {pricing.missingList?.length ? (
                  <div className="pt-2 space-y-2">
                    {pricing.missingList.map((missing: string) => (
                      <span
                        key={missing}
                        className="flex items-center text-muted-foreground"
                      >
                        <X className="h-4 w-4 text-red-500" />
                        <h3 className="ml-2 text-sm line-through decoration-red-400/70">
                          {missing}
                        </h3>
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
