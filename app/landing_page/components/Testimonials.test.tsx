/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Testimonials } from "./Testimonials";

jest.mock("./ui/avatar", () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarImage: (props: any) => <img {...props} alt={props.alt || "avatar"} />,
  AvatarFallback: ({ children }: any) => <div>{children}</div>,
}));

jest.mock("./ui/card", () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

describe("Testimonials Komponente", () => {

  test("rendert die Hauptüberschrift korrekt", () => {
    render(<Testimonials />);
    expect(screen.getByText(/Beta-Feedback/i)).toBeInTheDocument();
  });

  test("zeigt den Namen Mara Schmidt an", () => {
    render(<Testimonials />);
    expect(screen.getByText("Mara Schmidt")).toBeInTheDocument();
  });

  test("rendert den Avatar-Fallback BT", () => {
    render(<Testimonials />);
    expect(screen.getByText("BT")).toBeInTheDocument();
  });

  test("listet die White-label-Vorteile auf", () => {
    render(<Testimonials />);
    expect(screen.getByText(/White-label bereit/i)).toBeInTheDocument();
  });

});