"use client";

import { MouseEvent } from "react";

const sponsors = ["Stripe", "Next.js", "Vercel", "Shopify", "WooCommerce", "API-first"];

export const Sponsors = () => {
  const handleGlowMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    card.style.setProperty("--sponsor-glow-x", `${x}px`);
    card.style.setProperty("--sponsor-glow-y", `${y}px`);
  };

  const handleGlowEnter = (event: MouseEvent<HTMLElement>) => {
    event.currentTarget.classList.add("sponsor-glow-active");
  };

  const handleGlowLeave = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    card.classList.remove("sponsor-glow-active");
    card.style.removeProperty("--sponsor-glow-x");
    card.style.removeProperty("--sponsor-glow-y");
  };

  return (
    <section
      id="sponsors"
      className="container pt-12 sm:pt-20"
    >
      <div
        onMouseMove={handleGlowMove}
        onMouseEnter={handleGlowEnter}
        onMouseLeave={handleGlowLeave}
        className="sponsor-glow-card rounded-2xl border bg-muted/30 p-6 md:p-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by teams building modern commerce stacks
          </h2>
          <p className="text-sm text-muted-foreground">
            Plug into the tools your customers already use.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
          {sponsors.map((name) => (
            <div
              key={name}
              className="rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
