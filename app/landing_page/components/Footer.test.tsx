// Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { Footer } from "./Footer";

describe("Footer component", () => {
  beforeEach(() => {
    // DOM vor jedem Test löschen
    document.body.innerHTML = "";
  });

  it("rendert ohne Fehler", () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });

  it("footer element mit id footer wird angezeigt", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer#footer");
    expect(footer).toBeInTheDocument();
  });

  it("LoyaltyFlow logo und brand name werden angezeigt", () => {
    render(<Footer />);
    const brandName = screen.getAllByText("LoyaltyFlow");
    expect(brandName.length).toBeGreaterThan(0);
  });

  it("brand beschreibungstext wird angezeigt", () => {
    render(<Footer />);
    const description = screen.getByText(/Loyalty-as-a-Service/);
    expect(description).toBeInTheDocument();
  });

  it("trust badge '99.9% Uptime' wird angezeigt", () => {
    render(<Footer />);
    const uptime = screen.getByText("99.9%");
    expect(uptime).toBeInTheDocument();
  });

  it("trust badge 'DSGVO Compliant' wird angezeigt", () => {
    render(<Footer />);
    const dsgvo = screen.getByText("DSGVO");
    expect(dsgvo).toBeInTheDocument();
  });

  it("trust badge '24/7 Monitoring' wird angezeigt", () => {
    render(<Footer />);
    const monitoring = screen.getByText("24/7");
    expect(monitoring).toBeInTheDocument();
  });

  it("footer link 'Features' wird angezeigt", () => {
    render(<Footer />);
    const features = screen.getAllByText("Features");
    expect(features.length).toBeGreaterThan(0);
  });

  it("footer link 'Pricing' wird angezeigt", () => {
    render(<Footer />);
    const pricing = screen.getAllByText("Pricing");
    expect(pricing.length).toBeGreaterThan(0);
  });

  it("footer link 'FAQ' wird angezeigt", () => {
    render(<Footer />);
    const faq = screen.getByText("FAQ");
    expect(faq).toBeInTheDocument();
  });

  it("footer link 'Shopify' wird angezeigt", () => {
    render(<Footer />);
    const shopify = screen.getByText("Shopify");
    expect(shopify).toBeInTheDocument();
  });

  it("footer link 'WooCommerce' wird angezeigt", () => {
    render(<Footer />);
    const woocommerce = screen.getByText("WooCommerce");
    expect(woocommerce).toBeInTheDocument();
  });

  it("footer link 'API Docs' wird angezeigt", () => {
    render(<Footer />);
    const apiDocs = screen.getByText("API Docs");
    expect(apiDocs).toBeInTheDocument();
  });

  it("footer link 'Rewards' wird angezeigt", () => {
    render(<Footer />);
    const rewards = screen.getByText("Rewards");
    expect(rewards).toBeInTheDocument();
  });

  it("footer link 'White-Label' wird angezeigt", () => {
    render(<Footer />);
    const whiteLabel = screen.getByText("White-Label");
    expect(whiteLabel).toBeInTheDocument();
  });

  it("footer link 'Case Study' wird angezeigt", () => {
    render(<Footer />);
    const caseStudy = screen.getByText("Case Study");
    expect(caseStudy).toBeInTheDocument();
  });

  it("footer cta 'Starte heute' wird angezeigt", () => {
    render(<Footer />);
    const cta = screen.getByText(/Starte heute mit einem kostenlosen/);
    expect(cta).toBeInTheDocument();
  });

  it("footer cta button 'Demo anfragen' wird angezeigt", () => {
    render(<Footer />);
    const button = screen.getByText("Demo anfragen");
    expect(button).toBeInTheDocument();
  });

  it("copyright text wird angezeigt", () => {
    render(<Footer />);
    const copyright = screen.getByText(/2026 LoyaltyFlow/);
    expect(copyright).toBeInTheDocument();
  });

  it("copyright text 'Gemacht fuer Teams' wird angezeigt", () => {
    render(<Footer />);
    const text = screen.getByText(/Gemacht fuer Teams/);
    expect(text).toBeInTheDocument();
  });

  it("legal link 'Impressum' wird angezeigt", () => {
    render(<Footer />);
    const impressum = screen.getByText("Impressum");
    expect(impressum).toBeInTheDocument();
  });

  it("legal link 'Datenschutz' wird angezeigt", () => {
    render(<Footer />);
    const datenschutz = screen.getByText("Datenschutz");
    expect(datenschutz).toBeInTheDocument();
  });

  it("legal link 'Your Team' wird angezeigt", () => {
    render(<Footer />);
    const team = screen.getByText("Your Team");
    expect(team).toBeInTheDocument();
  });

  it("alle footer gruppen werden angezeigt", () => {
    render(<Footer />);
    expect(screen.getByText("Produkt")).toBeInTheDocument();
    expect(screen.getByText("Integrationen")).toBeInTheDocument();
    expect(screen.getByText("Use Cases")).toBeInTheDocument();
    expect(screen.getByText("Ressourcen")).toBeInTheDocument();
  });

  it("footer struktur ist korrekt", () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector("footer#footer");
    const sections = footer?.querySelectorAll("section");
    expect(sections?.length).toBeGreaterThanOrEqual(1);
  });

  it("footer grid wird gerendert", () => {
    const { container } = render(<Footer />);
    const grid = container.querySelector(".footer-grid");
    expect(grid).toBeInTheDocument();
  });

  it("footer bottom bar wird gerendert", () => {
    const { container } = render(<Footer />);
    const bottomBar = container.querySelector(".footer-bottom-bar");
    expect(bottomBar).toBeInTheDocument();
  });

  it("alle footer links sind navigierbar", () => {
    const { container } = render(<Footer />);
    const links = container.querySelectorAll("a[href]");
    expect(links.length).toBeGreaterThan(10);
  });

  it("keine Fehler beim Rendern", () => {
    expect(() => {
      render(<Footer />);
    }).not.toThrow();
  });
});
