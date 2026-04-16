
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn()
  }
}));

import { getErrorStatus } from './error-response';

describe('Error Response Utility Tests', () => {

  test('sollte Status 404 zurückgeben, wenn "not found" enthalten ist', () => {
    expect(getErrorStatus("User not found")).toBe(404);
  });

  test('sollte Status 401 bagi API Key yang salah', () => {
    expect(getErrorStatus("invalid api key")).toBe(401);
  });

  test('sollte Status 409 bagi saldo poin kurang', () => {
    expect(getErrorStatus("insufficient points balance")).toBe(409);
  });

  test('sollte default ke 400 kalau pesan tidak dikenal', () => {
    expect(getErrorStatus("random error")).toBe(400);
  });

});