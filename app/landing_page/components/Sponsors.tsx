const sponsors = ["Stripe", "Next.js", "Vercel", "Shopify", "WooCommerce", "API-first"];

export const Sponsors = () => {
  return (
    <section
      id="sponsors"
      className="container pt-12 sm:pt-20"
    >
      <div className="rounded-2xl border bg-muted/30 p-6 md:p-8">
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
