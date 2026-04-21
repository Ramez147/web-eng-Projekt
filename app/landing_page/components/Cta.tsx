"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export const Cta = () => {
  return (
    <section
      id="cta"
      className="bg-muted/50 py-12 my-12 sm:my-16"
    >
      <div className="container">
        <div
          className="cta-laser-host relative overflow-visible rounded-3xl border border-primary/20 px-6 py-10 md:px-10 md:py-12"
        >
          <div className="relative z-10 lg:grid lg:grid-cols-2 place-items-center">
            <div className="lg:col-start-1">
              <h2 className="text-3xl md:text-4xl font-bold ">
                Bereit für mehr Umsatz durch
                <span className="bg-linear-to-b from-primary/60 to-primary bg-clip-text">
                  {" "}
                  Kundenbindung
                </span>
                ?
              </h2>
              <p className="text-muted-foreground text-xl mt-4 mb-8 lg:mb-0">
                Starte unverbindlich, teste die API und baue in wenigen Minuten dein
                eigenes Loyalty-System auf.
              </p>
            </div>

            <div className="space-y-4 lg:col-start-2">
              <Button asChild className="w-full md:mr-4 md:w-auto">
                <Link href="#anmeldung">Jetzt unverbindlich testen</Link>
              </Button>

              <div className="cta-demo-laser-host relative inline-flex w-full overflow-hidden rounded-md md:w-auto">
                <div className="cta-demo-laser-reveal" />

                <Button
                  asChild
                  variant="outline"
                  className="relative z-10 w-full md:w-auto border-primary/40 bg-transparent transition-all duration-300 hover:border-primary/70 hover:bg-primary/10 hover:shadow-[0_0_1.2rem_hsl(var(--primary)/0.35)]"
                >
                  <Link href="/kontakt">Demo vereinbaren</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
