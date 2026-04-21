/**
 * @jest-environment node
 */
import { NextResponse } from 'next/server';
import { getErrorStatus, jsonError } from './error-response';

// Mock für Next/Server
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((body, init) => ({
      body,
      status: init?.status,
    })),
  },
}));

describe('Error Response Utility Tests', () => {
  
  describe('getErrorStatus', () => {
    
    test('sollte Status 409 zurückgeben, wenn die Punkte nicht ausreichen', () => {
      expect(getErrorStatus("insufficient points balance")).toBe(409);
    });

    test('sollte Status 401 für ungültige API-Keys oder fehlendes Login zurückgeben', () => {
      expect(getErrorStatus("invalid api key")).toBe(401);
      expect(getErrorStatus("please sign in")).toBe(401);
    });

    test('sollte Status 403 für "forbidden" oder "membership" Fehler zurückgeben', () => {
      expect(getErrorStatus("forbidden access")).toBe(403);
      expect(getErrorStatus("invalid membership status")).toBe(403);
    });

    test('sollte Status 404 zurückgeben, wenn "not found" in der Nachricht steht', () => {
      expect(getErrorStatus("The requested resource was not found")).toBe(404);
    });

    test('sollte standardmäßig Status 400 für unbekannte Fehler zurückgeben', () => {
      expect(getErrorStatus("ein unbekannter fehler")).toBe(400);
    });
  });

  describe('jsonError', () => {
    
    test('sollte eine NextResponse mit korrektem Status und Body erstellen', () => {
      const message = "not found";
      jsonError(message);

      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: message },
        { status: 404 }
      );
    });
  });

});
