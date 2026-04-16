import { parsePositiveNumber, parseNonEmptyString } from './validators';

describe('Validator Tests', () => {

  test('parsePositiveNumber sollte eine positive Zahl akzeptieren', () => {
    expect(parsePositiveNumber(100, 'Preis')).toBe(100);
  });

  test('parsePositiveNumber sollte bei negativen Zahlen einen Fehler werfen', () => {
    expect(() => parsePositiveNumber(-10, 'Preis')).toThrow('Preis must be a positive number');
  });

  test('parseNonEmptyString sollte Leerzeichen entfernen', () => {
    expect(parseNonEmptyString('  Hallo  ', 'Name')).toBe('Hallo');
  });

  test('parseNonEmptyString sollte bei leerem String einen Fehler werfen', () => {
    expect(() => parseNonEmptyString('', 'Name')).toThrow('Name must be a non-empty string');
  });

});