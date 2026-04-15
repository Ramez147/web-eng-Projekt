"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export const Cta = () => {
  const handleGlowMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    event.currentTarget.style.setProperty("--glow-x", `${x}px`);
    event.currentTarget.style.setProperty("--glow-y", `${y}px`);
  };

  const handleGlowLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--glow-x", "50%");
    event.currentTarget.style.setProperty("--glow-y", "50%");
  };

  return (
    <section
      id="cta"
      className="bg-muted/50 py-16 my-24 sm:my-32"
    >
      <div className="container lg:grid lg:grid-cols-2 place-items-center">
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
          <div
            className="group relative inline-block w-full overflow-visible md:w-auto [--glow-x:50%] [--glow-y:50%]"
            onMouseMove={handleGlowMove}
            onMouseLeave={handleGlowLeave}
          >
            <span className="pointer-events-none absolute -inset-6 z-0 rounded-xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100">
              <span
                className="absolute inset-0 rounded-xl"
                style={{
                  background:
                    "radial-gradient(120px circle at var(--glow-x) var(--glow-y), hsl(var(--primary) / 0.55), transparent 70%)",
                }}
              />
            </span>

            <Button
              asChild
              variant="outline"
              className="relative z-10 w-full md:w-auto border-primary/40 transition-all duration-300 hover:border-primary/70 hover:bg-primary/10 hover:shadow-[0_0_1.2rem_hsl(var(--primary)/0.35)]"
            >
              <Link href="/kontakt">Demo vereinbaren</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
