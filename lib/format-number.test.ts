import { compactFormat, standardFormat } from './format-number';

describe('FormatNumber Tests', () => {

  test('compactFormat sollte Zahlen abkürzen (z.B. 1K)', () => {
    // 1000 wird zu 1K
    expect(compactFormat(1000)).toBe('1K');
    // 1500 wird zu 1.5K
    expect(compactFormat(1500)).toBe('1.5K');
  });

  test('standardFormat sollte Tausendertrennzeichen hinzufügen', () => {
    // 1000 wird zu 1,000 (Formatierung mit Komma)
    expect(standardFormat(1000)).toBe('1,000');
  });

});