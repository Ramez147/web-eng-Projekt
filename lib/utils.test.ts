import { cn } from './utils';

describe('Utility cn Tests', () => {

  test('sollte Klassen korrekt kombinieren', () => {
    const result = cn('bg-red', 'p-4');
    expect(result).toContain('bg-red');
    expect(result).toContain('p-4');
  });

  test('sollte Tailwind-Konflikte lösen', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8'); // ✅ ini tetap aman
  });

  test('sollte falsche Werte ignorieren', () => {
    expect(cn('btn', null, undefined, 'active')).toBe('btn active'); // ✅ ini juga aman
  });

});