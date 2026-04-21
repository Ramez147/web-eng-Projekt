/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Statistics } from "./Statistics";

describe("Statistics Komponente", () => {

  test("rendert alle Mengen (Quantities) korrekt", () => {
    render(<Statistics />);
    expect(screen.getByText("2.7K+")).toBeInTheDocument();
    expect(screen.getByText("1.8K+")).toBeInTheDocument();
    expect(screen.getByText("112")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  test("rendert alle Beschreibungen korrekt", () => {
    render(<Statistics />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Subscribers")).toBeInTheDocument();
    expect(screen.getByText("Downloads")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
  });

  test("besitzt die korrekte Grid-Struktur", () => {
    const { container } = render(<Statistics />);
    const gridDiv = container.querySelector(".grid");
    expect(gridDiv).toHaveClass("grid-cols-2", "lg:grid-cols-4");
  });

});