import { Button } from "./ui/button";
import { HeroCards } from "./HeroCards";
import { HeroGlowButton } from "./HeroGlowButton";

export const Hero = () => {
  return (
    <section className="container relative grid lg:grid-cols-2 items-center py-20 md:py-32 gap-12 overflow-hidden">
      <div className="z-10 lg:col-start-1 lg:row-start-1">
        <HeroCards />
      </div>

      <div className="text-center lg:text-start space-y-6 lg:col-start-2 lg:row-start-1">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary">
          SaaS Loyalty Platform für moderne Marken
        </div>

        <main className="text-5xl md:text-6xl font-bold tracking-tight">
          <h1 className="inline">
            <span className="inline bg-gradient-to-r from-primary to-emerald-500 text-emerald-500 bg-clip-text">
              Verwandle Einmalkunden
            </span>{" "}
            in echte Fans
          </h1>
          <span className="block mt-2">vollautomatisch.</span>
        </main>

        <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0">
          Das Loyalty-System für moderne Unternehmen. Integriere Punkte,
          Belohnungen und Kampagnen in Minuten via API und betreibe dein eigenes
          Treueprogramm als skalierbare SaaS.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Button className="w-full sm:w-auto bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            Kostenlos starten
          </Button>

          <HeroGlowButton href="#cta" label="Demo vereinbaren" />
        </div>
      </div>

      <div className="shadow"></div>
    </section>
  );
};
