/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Sponsors } from "./Sponsors";

describe("Sponsors Komponente", () => {
  
  test("rendert die Hauptüberschrift korrekt", () => {
    render(<Sponsors />);
    expect(screen.getByText(/Trusted by teams/i)).toBeInTheDocument();
  });

  test("rendert alle Sponsoren aus der Liste", () => {
    render(<Sponsors />);
    const sponsoren = ["Stripe", "Next.js", "Vercel", "Shopify", "WooCommerce", "API-first"];
    
    sponsoren.forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  test("zeigt den Beschreibungstext an", () => {
    render(<Sponsors />);
    expect(screen.getByText(/Plug into the tools/i)).toBeInTheDocument();
  });

});