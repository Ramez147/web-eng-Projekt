import { LogoIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer id="footer">
      <hr className="w-11/12 mx-auto" />

      <section className="container py-20 grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
        <div className="col-span-full xl:col-span-2">
          <a
            rel="noreferrer noopener"
            href="/"
            className="font-bold text-xl flex"
          >
            <LogoIcon />
            LoyaltyFlow
          </a>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Loyalty-as-a-Service für Marken, die Kundenbindung als Produkt
            denken.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Product</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Github
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#pricing"
              className="opacity-60 hover:opacity-100"
            >
              Pricing
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#faq"
              className="opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Integrations</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Shopify
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              WooCommerce
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#cta"
              className="opacity-60 hover:opacity-100"
            >
              API Docs
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Use Cases</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#features"
              className="opacity-60 hover:opacity-100"
            >
              Rewards
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#pricing"
              className="opacity-60 hover:opacity-100"
            >
              White-label
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#cta"
              className="opacity-60 hover:opacity-100"
            >
              Demo
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg">Resources</h3>
          <div>
            <a
              rel="noreferrer noopener"
              href="#testimonials"
              className="opacity-60 hover:opacity-100"
            >
              Case Study
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#sponsors"
              className="opacity-60 hover:opacity-100"
            >
              Stack
            </a>
          </div>

          <div>
            <a
              rel="noreferrer noopener"
              href="#footer"
              className="opacity-60 hover:opacity-100"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      <section className="container pb-14 text-center">
        <h3>
          &copy; 2026 LoyaltyFlow made by{" "}
          <a
            rel="noreferrer noopener"
            target="_blank"
            href="https://www.linkedin.com/in/leopoldo-miranda/"
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Your Team
          </a>
        </h3>
      </section>
    </footer>
  );
};
