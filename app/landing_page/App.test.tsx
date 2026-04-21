/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mocks für komplexe Komponenten (verhindert Hook-Fehler)
jest.mock("./components/Navbar", () => ({ Navbar: () => <nav>Navbar Mock</nav> }));
jest.mock("./components/Hero", () => ({ Hero: () => <section>Hero Mock</section> }));
jest.mock("./components/Login", () => ({ Login: () => <section>Login Mock</section> }));
jest.mock("./components/Sponsors", () => ({ Sponsors: () => <section>Sponsors Mock</section> }));
jest.mock("./components/Testimonials", () => ({ Testimonials: () => <section>Testimonials Mock</section> }));
jest.mock("./components/Features", () => ({ Features: () => <section>Features Mock</section> }));
jest.mock("./components/Pricing", () => ({ Pricing: () => <section>Pricing Mock</section> }));
jest.mock("./components/FAQ", () => ({ FAQ: () => <section>FAQ Mock</section> }));
jest.mock("./components/Cta", () => ({ Cta: () => <section>Cta Mock</section> }));
jest.mock("./components/Footer", () => ({ Footer: () => <footer>Footer Mock</footer> }));
jest.mock("./components/ScrollToTop", () => ({ ScrollToTop: () => <div>Scroll Mock</div> }));

describe("App Hauptkomponente", () => {
  
  test("rendert alle Hauptsektionen der Landing Page", () => {
    render(<App />);

    // Überprüfen, ob die gemockten Sektionen vorhanden sind
    expect(screen.getByText(/Navbar Mock/i)).toBeInTheDocument();
    expect(screen.getByText(/Login Mock/i)).toBeInTheDocument();
    expect(screen.getByText(/Sponsors Mock/i)).toBeInTheDocument();
    expect(screen.getByText(/Testimonials Mock/i)).toBeInTheDocument();
    expect(screen.getByText(/Pricing Mock/i)).toBeInTheDocument();
    expect(screen.getByText(/Footer Mock/i)).toBeInTheDocument();
  });

});