/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Team } from "./Team";


jest.mock("./ui/button", () => ({
  buttonVariants: () => "mock-button-class",
}));

describe("Team Komponente", () => {
  
  test("rendert die Team-Überschrift korrekt", () => {
    render(<Team />);
    expect(screen.getByText(/Dedicated/i)).toBeInTheDocument();
    expect(screen.getByText(/Crew/i)).toBeInTheDocument();
  });

  test("rendert alle Namen der Teammitglieder", () => {
    render(<Team />);
    expect(screen.getByText("Emma Smith")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Ashley Ross")).toBeInTheDocument();
    expect(screen.getByText("Bruce Rogers")).toBeInTheDocument();
  });

  test("zeigt die korrekten Arbeitspositionen an", () => {
    render(<Team />);
    expect(screen.getByText("Product Manager")).toBeInTheDocument();
    expect(screen.getByText("Tech Lead")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
  });

  test("Profilbilder haben die korrekten Alt-Attribute", () => {
    render(<Team />);
    const image = screen.getByAltText("Emma Smith Product Manager");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://i.pravatar.cc/150?img=35");
  });

  test("stellt die korrekten Social-Media-Initialen dar", () => {
    render(<Team />);
    expect(screen.getAllByText("in").length).toBeGreaterThan(0);
    expect(screen.getAllByText("f").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ig").length).toBeGreaterThan(0);
  });

});