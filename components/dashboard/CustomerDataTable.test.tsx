/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CustomerDataTable } from "./CustomerDataTable";

// Mock global fetch
global.fetch = jest.fn();

describe("CustomerDataTable Komponente", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("sollte Tabellen-Header korrekt anzeigen", () => {
    render(<CustomerDataTable pageSize={2} />);
    
    expect(screen.getByText(/Customers/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Points Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Spent/i)).toBeInTheDocument();
  });

  test("sollte Skeletons während des Ladens anzeigen", () => {
    // Fetch bleibt im 'pending' Zustand, um Loading-State zu testen
    (global.fetch as jest.Mock).mockReturnValue(new Promise(() => {}));
    
    render(<CustomerDataTable pageSize={2} />);
    
    // Checkt ob Skeletons vorhanden sind (basierend auf deiner Logic im Code)
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(0);
  });

  test("sollte leeren Zustand anzeigen, wenn keine Daten vorhanden sind", async () => {
    // Arrange: Mock gibt leere Daten zurück
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ totalCount: 0, rows: [], page: 1, pageSize: 2 }),
    });

    render(<CustomerDataTable pageSize={2} />);

    // Act & Assert: Warten bis die Nachricht erscheint
    await waitFor(() => {
      expect(screen.getByText(/Keine Customer-Daten gefunden/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test("sollte Kundendaten korrekt rendern", async () => {
    // Arrange: Mock gibt einen Testkunden zurück
    const mockData = {
      totalCount: 1,
      rows: [{
        id: "1",
        externalCustomerId: "CUST-001",
        pointsBalance: 100,
        totalSpentEur: 50.5,
        createdAt: new Date().toISOString(),
      }],
      page: 1,
      pageSize: 2
    };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    render(<CustomerDataTable pageSize={2} />);

    // Assert: Warten bis die Daten in der Tabelle erscheinen
    await waitFor(() => {
      expect(screen.getByText("CUST-001")).toBeInTheDocument();
      expect(screen.getByText("100")).toBeInTheDocument();
    });
  });
});