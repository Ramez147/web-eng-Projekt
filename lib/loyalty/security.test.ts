import { generateApiKey, hashApiKey } from './security';

describe('Security Utility Tests', () => {
  
  describe('generateApiKey()', () => {
    test('sollte mit dem Präfix ly_live_ beginnen', () => {
      const key = generateApiKey();
      // Überprüfen, ob der Key korrekt startet
      expect(key.startsWith('ly_live_')).toBe(true);
    });

    test('sollte einen eindeutigen Schlüssel generieren', () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      // Zwei Keys dürfen nicht identisch sein
      expect(key1).not.toBe(key2);
    });
  });

  describe('hashApiKey()', () => {
    test('sollte einen konsistenten SHA256-Hash zurückgeben', () => {
      const input = 'test-key-123';
      const hash1 = hashApiKey(input);
      const hash2 = hashApiKey(input);
      
      // Der Hash muss bei gleichem Input immer gleich sein
      expect(hash1).toBe(hash2);
      // Ein SHA256-Hash in Hex hat immer 64 Zeichen
      expect(hash1).toHaveLength(64);
    });

    test('sollte unterschiedliche Hashes für unterschiedlichen Input erzeugen', () => {
      const hashA = hashApiKey('passwort1');
      const hashB = hashApiKey('passwort2');
      expect(hashA).not.toBe(hashB);
    });
  });
});