// security.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { generateApiKey, hashApiKey } from "./security";

describe("Security Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // generateApiKey Tests
  describe("generateApiKey", () => {
    it("generiert Key mit 'ly_live_' Präfix", () => {
      const key = generateApiKey();
      expect(key.startsWith("ly_live_")).toBe(true);
    });

    it("generiert eindeutige Keys", () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      expect(key1).not.toBe(key2);
    });

    it("generiert immer verschiedene Keys", () => {
      const keys = new Set();
      for (let i = 0; i < 100; i++) {
        keys.add(generateApiKey());
      }
      expect(keys.size).toBe(100);
    });

    it("hat konsistente Länge", () => {
      const key = generateApiKey();
      // ly_live_ = 8 chars + 64 chars (hex von 32 bytes) = 72 chars
      expect(key).toHaveLength(72);
    });

    it("hat gültige Hexadezimal-Zeichen nach Präfix", () => {
      const key = generateApiKey();
      const hexPart = key.substring(8); // After "ly_live_"
      const hexRegex = /^[0-9a-f]{64}$/;
      expect(hexRegex.test(hexPart)).toBe(true);
    });

    it("generiert nur kleine Hexadezimal-Zeichen", () => {
      for (let i = 0; i < 50; i++) {
        const key = generateApiKey();
        expect(key).toMatch(/^ly_live_[0-9a-f]+$/);
      }
    });

    it("hat nur ASCII-Zeichen", () => {
      const key = generateApiKey();
      const onlyAscii = /^[\x00-\x7F]*$/.test(key);
      expect(onlyAscii).toBe(true);
    });

    it("generiert verschiedene Suffixe", () => {
      const suffixes = new Set();
      for (let i = 0; i < 20; i++) {
        const key = generateApiKey();
        suffixes.add(key.substring(8));
      }
      expect(suffixes.size).toBe(20);
    });
  });

  // hashApiKey Tests
  describe("hashApiKey", () => {
    it("gibt SHA256 Hash zurück", () => {
      const hash = hashApiKey("test-key");
      // SHA256 hex hat 64 Zeichen (256 bits / 4)
      expect(hash).toHaveLength(64);
    });

    it("gibt konsistente Hashes für gleiche Input", () => {
      const input = "test-key-123";
      const hash1 = hashApiKey(input);
      const hash2 = hashApiKey(input);
      expect(hash1).toBe(hash2);
    });

    it("gibt unterschiedliche Hashes für unterschiedliche Input", () => {
      const hash1 = hashApiKey("passwort1");
      const hash2 = hashApiKey("passwort2");
      expect(hash1).not.toBe(hash2);
    });

    it("gibt nur Hexadezimal-Zeichen zurück", () => {
      const hash = hashApiKey("test");
      const hexRegex = /^[0-9a-f]{64}$/;
      expect(hexRegex.test(hash)).toBe(true);
    });

    it("gibt nur kleine Hexadezimal-Zeichen zurück", () => {
      const hash = hashApiKey("anything");
      expect(hash).toMatch(/^[0-9a-f]+$/);
      expect(hash).not.toMatch(/[A-F]/);
    });

    it("sensitiv auf Großschreibung", () => {
      const hash1 = hashApiKey("Test");
      const hash2 = hashApiKey("test");
      expect(hash1).not.toBe(hash2);
    });

    it("sensitiv auf Whitespace", () => {
      const hash1 = hashApiKey("test key");
      const hash2 = hashApiKey("testkey");
      expect(hash1).not.toBe(hash2);
    });

    it("akzeptiert leeren String", () => {
      const hash = hashApiKey("");
      expect(hash).toHaveLength(64);
      expect(/^[0-9a-f]{64}$/.test(hash)).toBe(true);
    });

    it("akzeptiert sehr lange Strings", () => {
      const longString = "x".repeat(10000);
      const hash = hashApiKey(longString);
      expect(hash).toHaveLength(64);
    });

    it("akzeptiert Strings mit Sonderzeichen", () => {
      const special = "!@#$%^&*()_+-={}[]|:;<>?,.";
      const hash = hashApiKey(special);
      expect(hash).toHaveLength(64);
    });

    it("akzeptiert Unicode Zeichen", () => {
      const unicode = "こんにちは世界";
      const hash = hashApiKey(unicode);
      expect(hash).toHaveLength(64);
    });

    it("akzeptiert Zeilenumbrüche", () => {
      const multiline = "line1\nline2\nline3";
      const hash = hashApiKey(multiline);
      expect(hash).toHaveLength(64);
    });

    it("akzeptiert Tabs und Spaces", () => {
      const whitespace = "  \t  \n  ";
      const hash = hashApiKey(whitespace);
      expect(hash).toHaveLength(64);
    });

    it("generiert unterschiedliche Hashes für API Keys", () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      expect(hash1).not.toBe(hash2);
    });

    it("konsistent mit mehrfachen Aufrufen", () => {
      const input = "consistent-test";
      const hashes = [];
      for (let i = 0; i < 10; i++) {
        hashes.push(hashApiKey(input));
      }
      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(1);
    });
  });

  // Integration Tests
  describe("Security Utilities Integration", () => {
    it("generiert Key und hasht ihn", () => {
      const key = generateApiKey();
      const hash = hashApiKey(key);
      expect(key.startsWith("ly_live_")).toBe(true);
      expect(hash).toHaveLength(64);
    });

    it("gleiches Key generiert gleichen Hash jedes Mal", () => {
      const key = "fixed-key-123";
      const hash1 = hashApiKey(key);
      const hash2 = hashApiKey(key);
      expect(hash1).toBe(hash2);
    });

    it("unterschiedliche Keys generieren unterschiedliche Hashes", () => {
      const key1 = generateApiKey();
      const key2 = generateApiKey();
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      expect(hash1).not.toBe(hash2);
    });

    it("API Key hat gültiges Format für Hashing", () => {
      const key = generateApiKey();
      expect(key).toMatch(/^ly_live_[0-9a-f]{64}$/);
      const hash = hashApiKey(key);
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it("mehrere generierte Keys produzieren eindeutige Hashes", () => {
      const hashes = new Set();
      for (let i = 0; i < 50; i++) {
        const key = generateApiKey();
        const hash = hashApiKey(key);
        hashes.add(hash);
      }
      expect(hashes.size).toBe(50);
    });

    it("Hash ist nicht reversible (nicht der Key)", () => {
      const key = generateApiKey();
      const hash = hashApiKey(key);
      // Hash sollte nicht dem Original-Key gleichen
      expect(hash).not.toBe(key);
      expect(hash).not.toContain("ly_live_");
    });

    it("gleicher Input mit verschiedenen Funktionen konsistent", () => {
      const key1 = "test-api-key";
      const key2 = "test-api-key";
      const hash1 = hashApiKey(key1);
      const hash2 = hashApiKey(key2);
      expect(key1).toBe(key2);
      expect(hash1).toBe(hash2);
    });

    it("generierte Keys sind alle hashable", () => {
      for (let i = 0; i < 20; i++) {
        const key = generateApiKey();
        const hash = hashApiKey(key);
        expect(typeof hash).toBe("string");
        expect(hash.length).toBe(64);
      }
    });

    it("große Menge von Keys erzeugt eindeutige Hashes", () => {
      const hashes = new Set();
      const keys = [];
      for (let i = 0; i < 100; i++) {
        const key = generateApiKey();
        keys.push(key);
        hashes.add(hashApiKey(key));
      }
      expect(hashes.size).toBe(100);
      expect(new Set(keys).size).toBe(100);
    });

    it("Hash ist deterministisch für bekannte Values", () => {
      // Known hash for "test" - can verify consistency
      const testInput = "test";
      const hash1 = hashApiKey(testInput);
      const hash2 = hashApiKey(testInput);
      expect(hash1).toBe(hash2);

      // Hash for different input should be different
      const hash3 = hashApiKey("Test");
      expect(hash3).not.toBe(hash1);
    });

    it("alle generierten Keys folgen konsistentem Format", () => {
      for (let i = 0; i < 50; i++) {
        const key = generateApiKey();
        expect(key.startsWith("ly_live_")).toBe(true);
        expect(key).toHaveLength(72);
        expect(/^ly_live_[0-9a-f]{64}$/.test(key)).toBe(true);
      }
    });

    it("Security-Funktionen sind Pure Functions", () => {
      // generateApiKey() ist nicht rein (erzeugt random), aber hashApiKey() schon
      const input1 = "pure-function-test";
      const result1 = hashApiKey(input1);
      const result2 = hashApiKey(input1);
      expect(result1).toBe(result2);
    });

    it("Hashes haben ausreichende Entropie", () => {
      const hashes = [];
      for (let i = 0; i < 100; i++) {
        const key = generateApiKey();
        hashes.push(hashApiKey(key));
      }
      const uniqueHashes = new Set(hashes);
      // Alle sollten eindeutig sein (bei 100 Samples sehr unwahrscheinlich, dass es Collisions gibt)
      expect(uniqueHashes.size).toBe(100);
    });

    it("Security-Utilities sind schnell genug", () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        const key = generateApiKey();
        hashApiKey(key);
      }
      const duration = Date.now() - start;
      // 1000 Iterationen sollten unter 5 Sekunden sein
      expect(duration).toBeLessThan(5000);
    });
  });
});