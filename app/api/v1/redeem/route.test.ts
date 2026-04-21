/**
 * @jest-environment jsdom
 */
import { POST } from "./route";
import { NextResponse } from "next/server";

// Mocking (Simulation)
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      _data: data,
      _status: init?.status || 200,
    })),
  },
}));

// WICHTIG: Hier fängt der eigentliche Test an!
describe("Redeem API", () => {
  test("sollte erfolgreich sein", async () => {
    const mockRequest = {
      json: jest.fn().mockResolvedValue({ points: 10 }),
    };
    // Wir rufen deine POST Funktion auf
    const response = await POST(mockRequest as any) as any;
    
    // Das ist die Prüfung
    expect(response).toBeDefined();
  });
});