import { LogoIcon } from "./Icons";
import Link from "next/link";

const footerGroups = [
  {
    title: "Produkt",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Integrationen",
    links: [
      { label: "Shopify", href: "#features" },
      { label: "WooCommerce", href: "#features" },
      { label: "API Docs", href: "#cta" },
    ],
  },
  {
    title: "Use Cases",
    links: [
      { label: "Rewards", href: "#features" },
      { label: "White-Label", href: "#pricing" },
      { label: "Demo", href: "#cta" },
    ],
  },
  {
    title: "Ressourcen",
    links: [
      { label: "Case Study", href: "#testimonials" },
      { label: "Stack", href: "#sponsors" },
      { label: "Kontakt", href: "#footer" },
    ],
  },
];

export const Footer = () => {
  return (
    <footer
      id="footer"
      className="footer-shell"
    >
      <section className="container py-16 md:py-20">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link
              href="/"
              className="font-bold text-xl flex items-center"
            >
              <LogoIcon />
              LoyaltyFlow
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Loyalty-as-a-Service fuer Marken, die Kundenbindung als Produkt denken.
            </p>

            <div className="footer-trust">
              <div>
                <span className="footer-trust-value">99.9%</span>
                <span className="footer-trust-label">Uptime</span>
              </div>
              <div>
                <span className="footer-trust-value">DSGVO</span>
                <span className="footer-trust-label">Compliant</span>
              </div>
              <div>
                <span className="footer-trust-value">24/7</span>
                <span className="footer-trust-label">Monitoring</span>
              </div>
            </div>
          </div>

          {footerGroups.map((group) => (
            <div
              key={group.title}
              className="footer-link-column"
            >
              <h3 className="font-semibold text-base">{group.title}</h3>
              <div className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    rel="noreferrer noopener"
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div className="footer-cta">
            <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground">Naechster Schritt</p>
            <h3 className="mt-2 text-xl font-semibold leading-tight">Starte heute mit einem kostenlosen Architektur-Check</h3>
            <a
              rel="noreferrer noopener"
              href="#cta"
              className="footer-cta-button"
            >
              Demo anfragen
            </a>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <Link
            href="/"
            className="font-bold text-lg flex items-center"
          >
            <LogoIcon />
            LoyaltyFlow
          </Link>

          <p className="text-sm text-muted-foreground">
            &copy; 2026 LoyaltyFlow. Gemacht fuer Teams, die Wachstum messbar machen.
          </p>

          <div className="footer-legal-links">
            <a
              rel="noreferrer noopener"
              href="#footer"
              className="footer-link"
            >
              Impressum
            </a>
            <a
              rel="noreferrer noopener"
              href="#footer"
              className="footer-link"
            >
              Datenschutz
            </a>
            <a
              rel="noreferrer noopener"
              target="_blank"
              href="https://www.linkedin.com/in/leopoldo-miranda/"
              className="footer-link"
            >
              Your Team
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
};
