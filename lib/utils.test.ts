// utils.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import {
  cn,
  isObject,
  isPrimitive,
  isEmpty,
  deepEqual,
  pick,
  omit,
  merge,
  parseJson,
  getByPath,
  setByPath,
  formatDate,
  formatCurrency,
  chunk,
  flatten,
  unique,
  groupBy,
  capitalize,
  toCamelCase,
  toSnakeCase,
} from "./utils";

describe("Utils Utilities", () => {
  beforeEach(() => {
    // Cleanup
  });

  // cn Tests
  describe("cn", () => {
    it("kombiniert Klassen korrekt", () => {
      const result = cn("bg-red", "p-4");
      expect(result).toContain("bg-red");
      expect(result).toContain("p-4");
    });

    it("löst Tailwind-Konflikte auf", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
    });

    it("ignoriert falsche Werte", () => {
      const result = cn("btn", null, undefined, "active");
      expect(result).toContain("btn");
      expect(result).toContain("active");
    });

    it("kombiniert konditionelle Klassen", () => {
      const isActive = true;
      const result = cn("base", isActive && "active");
      expect(result).toContain("active");
    });
  });

  // isObject Tests
  describe("isObject", () => {
    it("gibt true für Objekte zurück", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ key: "value" })).toBe(true);
    });

    it("gibt false für Arrays zurück", () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it("gibt false für null zurück", () => {
      expect(isObject(null)).toBe(false);
    });

    it("gibt false für Primitive zurück", () => {
      expect(isObject("string")).toBe(false);
      expect(isObject(123)).toBe(false);
      expect(isObject(true)).toBe(false);
    });

    it("gibt false für undefined zurück", () => {
      expect(isObject(undefined)).toBe(false);
    });
  });

  // isPrimitive Tests
  describe("isPrimitive", () => {
    it("gibt true für primitive Typen zurück", () => {
      expect(isPrimitive("string")).toBe(true);
      expect(isPrimitive(123)).toBe(true);
      expect(isPrimitive(true)).toBe(true);
      expect(isPrimitive(null)).toBe(true);
    });

    it("gibt false für Objekte zurück", () => {
      expect(isPrimitive({})).toBe(false);
      expect(isPrimitive([])).toBe(false);
    });
  });

  // isEmpty Tests
  describe("isEmpty", () => {
    it("gibt true für leere Objekte zurück", () => {
      expect(isEmpty({})).toBe(true);
    });

    it("gibt true für leere Arrays zurück", () => {
      expect(isEmpty([])).toBe(true);
    });

    it("gibt true für leere Strings zurück", () => {
      expect(isEmpty("")).toBe(true);
      expect(isEmpty("   ")).toBe(true);
    });

    it("gibt true für null und undefined zurück", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it("gibt false für nicht-leere Werte zurück", () => {
      expect(isEmpty({ key: "value" })).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty("text")).toBe(false);
    });
  });

  // deepEqual Tests
  describe("deepEqual", () => {
    it("vergleicht gleiche Primitive", () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual("test", "test")).toBe(true);
      expect(deepEqual(true, true)).toBe(true);
    });

    it("vergleicht gleiche Arrays", () => {
      expect(deepEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      expect(deepEqual(["a", "b"], ["a", "b"])).toBe(true);
    });

    it("vergleicht gleiche Objekte", () => {
      expect(deepEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it("vergleicht verschachtelte Strukturen", () => {
      const obj1 = { a: [1, 2], b: { c: 3 } };
      const obj2 = { a: [1, 2], b: { c: 3 } };
      expect(deepEqual(obj1, obj2)).toBe(true);
    });

    it("gibt false für unterschiedliche Werte zurück", () => {
      expect(deepEqual(1, 2)).toBe(false);
      expect(deepEqual([1, 2], [1, 3])).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 2 })).toBe(false);
    });
  });

  // pick Tests
  describe("pick", () => {
    it("wählt angegebene Schlüssel aus", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, ["a", "c"])).toEqual({ a: 1, c: 3 });
    });

    it("ignoriert nicht-existierende Schlüssel", () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, ["a", "c" as any])).toEqual({ a: 1 });
    });

    it("gibt leeres Objekt zurück wenn keine Keys", () => {
      const obj = { a: 1, b: 2 };
      expect(pick(obj, [])).toEqual({});
    });
  });

  // omit Tests
  describe("omit", () => {
    it("entfernt angegebene Schlüssel", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["b"])).toEqual({ a: 1, c: 3 });
    });

    it("behält nicht-angegebene Schlüssel", () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, ["a"])).toEqual({ b: 2, c: 3 });
    });

    it("gibt alle Schlüssel zurück wenn keine zu entfernen", () => {
      const obj = { a: 1, b: 2 };
      expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
    });
  });

  // merge Tests
  describe("merge", () => {
    it("merged flache Objekte", () => {
      const target = { a: 1, b: 2 };
      const source = { b: 3, c: 4 };
      expect(merge(target, source)).toEqual({ a: 1, b: 3, c: 4 });
    });

    it("merged verschachtelte Objekte", () => {
      const target = { a: { x: 1 }, b: 2 };
      const source = { a: { y: 2 } } as any;
      expect(merge(target, source)).toEqual({ a: { x: 1, y: 2 }, b: 2 });
    });

    it("verändert Original nicht", () => {
      const target = { a: 1 };
      const source = { b: 2 } as any;
      merge(target, source);
      expect(target).toEqual({ a: 1 });
    });
  });

  // parseJson Tests
  describe("parseJson", () => {
    it("parst gültiges JSON", () => {
      const result = parseJson('{"a": 1}', {});
      expect(result).toEqual({ a: 1 });
    });

    it("gibt Default zurück für ungültiges JSON", () => {
      const defaultValue = { default: true };
      const result = parseJson("invalid", defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it("gibt Default zurück für null", () => {
      const defaultValue = {};
      const result = parseJson(null, defaultValue);
      expect(result).toEqual(defaultValue);
    });

    it("gibt Default zurück für undefined", () => {
      const defaultValue = {};
      const result = parseJson(undefined, defaultValue);
      expect(result).toEqual(defaultValue);
    });
  });

  // getByPath Tests
  describe("getByPath", () => {
    it("holt Wert mit Pfad", () => {
      const obj = { a: { b: { c: 1 } } };
      expect(getByPath(obj, "a.b.c")).toBe(1);
    });

    it("holt oberste Ebene Wert", () => {
      const obj = { a: 1, b: 2 };
      expect(getByPath(obj, "a")).toBe(1);
    });

    it("gibt undefined zurück wenn Pfad nicht existiert", () => {
      const obj = { a: { b: 1 } };
      expect(getByPath(obj, "a.c")).toBeUndefined();
    });

    it("gibt undefined zurück bei null Zwischenwert", () => {
      const obj = { a: null };
      expect(getByPath(obj, "a.b")).toBeUndefined();
    });
  });

  // setByPath Tests
  describe("setByPath", () => {
    it("setzt Wert mit Pfad", () => {
      const obj = { a: { b: 1 } };
      setByPath(obj, "a.b", 2);
      expect(obj.a.b).toBe(2);
    });

    it("erstellt fehlende verschachtelte Objekte", () => {
      const obj = {};
      setByPath(obj, "a.b.c", 1);
      expect((obj as any).a.b.c).toBe(1);
    });

    it("überschreibt existierende Werte", () => {
      const obj = { a: 1 };
      setByPath(obj, "a", 2);
      expect(obj.a).toBe(2);
    });
  });

  // formatDate Tests
  describe("formatDate", () => {
    it("formatiert Datum mit Standard Format", () => {
      const date = new Date(2024, 3, 24); // April 24, 2024
      const result = formatDate(date);
      expect(result).toMatch(/2024-04-24/);
    });

    it("formatiert Datum mit Custom Format", () => {
      const date = new Date(2024, 3, 24);
      const result = formatDate(date, "DD-MM-YYYY");
      expect(result).toMatch(/24-04-2024/);
    });
  });

  // formatCurrency Tests
  describe("formatCurrency", () => {
    it("formatiert Betrag als USD", () => {
      const result = formatCurrency(1000);
      expect(result).toContain("1,000");
    });

    it("formatiert Betrag mit Custom Currency", () => {
      const result = formatCurrency(1000, "EUR");
      expect(result).toContain("1,000");
    });

    it("formatiert Dezimalbeträge", () => {
      const result = formatCurrency(19.99);
      expect(result).toContain("19.99");
    });
  });

  // chunk Tests
  describe("chunk", () => {
    it("zerlegt Array in Chunks", () => {
      const result = chunk([1, 2, 3, 4, 5], 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("gibt Array mit einem Chunk zurück wenn Größe größer", () => {
      const result = chunk([1, 2], 5);
      expect(result).toEqual([[1, 2]]);
    });

    it("gibt leeres Array zurück für leeres Input", () => {
      const result = chunk([], 2);
      expect(result).toEqual([]);
    });
  });

  // flatten Tests
  describe("flatten", () => {
    it("flacht Array um eine Ebene ab", () => {
      const result = flatten([1, [2, 3], 4]);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("entfernt nur eine Ebene von Verschachtelung", () => {
      const result = flatten([1, [[2]], 3] as any) as any[];
      expect(result).toEqual([1, [2], 3] as any);
    });

    it("gibt leeres Array zurück für leeres Input", () => {
      const result = flatten([]);
      expect(result).toEqual([]);
    });
  });

  // unique Tests
  describe("unique", () => {
    it("entfernt Duplikate", () => {
      const result = unique([1, 2, 2, 3, 3, 3]);
      expect(result).toEqual([1, 2, 3]);
    });

    it("behält Reihenfolge", () => {
      const result = unique([3, 1, 2, 1]) as number[];
      expect(result[0]).toBe(3);
      expect(result[1]).toBe(1);
    });

    it("gibt leeres Array zurück für leeres Input", () => {
      const result = unique([]);
      expect(result).toEqual([]);
    });
  });

  // groupBy Tests
  describe("groupBy", () => {
    it("gruppiert Array nach Funktion", () => {
      const result = groupBy([1, 2, 3, 4], (n) => (n % 2 === 0 ? "even" : "odd"));
      expect(result).toEqual({
        odd: [1, 3],
        even: [2, 4],
      });
    });

    it("gruppiert Objekt-Arrays", () => {
      const users = [
        { name: "Alice", role: "admin" },
        { name: "Bob", role: "user" },
        { name: "Charlie", role: "admin" },
      ];
      const result = groupBy(users, (u) => u.role);
      expect(result.admin).toHaveLength(2);
      expect(result.user).toHaveLength(1);
    });
  });

  // capitalize Tests
  describe("capitalize", () => {
    it("kapitalisiert ersten Buchstaben", () => {
      expect(capitalize("hello")).toBe("Hello");
    });

    it("behält großen Anfangsbuchstaben", () => {
      expect(capitalize("Hello")).toBe("Hello");
    });

    it("behandelt leeren String", () => {
      expect(capitalize("")).toBe("");
    });
  });

  // toCamelCase Tests
  describe("toCamelCase", () => {
    it("konvertiert snake_case zu camelCase", () => {
      expect(toCamelCase("hello_world")).toBe("helloWorld");
    });

    it("konvertiert kebab-case zu camelCase", () => {
      expect(toCamelCase("hello-world")).toBe("helloWorld");
    });

    it("konvertiert Space-separated zu camelCase", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
    });

    it("behandelt bereits camelCase", () => {
      expect(toCamelCase("helloWorld")).toBe("helloWorld");
    });
  });

  // toSnakeCase Tests
  describe("toSnakeCase", () => {
    it("konvertiert camelCase zu snake_case", () => {
      expect(toSnakeCase("helloWorld")).toBe("hello_world");
    });

    it("konvertiert kebab-case zu snake_case", () => {
      expect(toSnakeCase("hello-world")).toBe("hello_world");
    });

    it("konvertiert Spaces zu Underscores", () => {
      expect(toSnakeCase("hello world")).toBe("hello_world");
    });

    it("behandelt bereits snake_case", () => {
      expect(toSnakeCase("hello_world")).toBe("hello_world");
    });
  });

  // Integration Tests
  describe("Utils Integration", () => {
    it("kombiniert Typ-Checking und Leerheits-Check", () => {
      const data = {};
      expect(isObject(data)).toBe(true);
      expect(isEmpty(data)).toBe(true);
    });

    it("kombiniert pick/omit für Objektmanipulation", () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const picked = pick(obj, ["a", "b"]) as any;
      const omitted = omit(obj, ["c", "d"]) as any;
      expect(deepEqual(picked, omitted)).toBe(true);
    });

    it("kombiniert getByPath und setByPath", () => {
      const obj = { a: { b: 1 } };
      setByPath(obj, "a.b", 2);
      expect(getByPath(obj, "a.b")).toBe(2);
    });

    it("verarbeitet komplexe Strukturen mit all", () => {
      const users = [
        { id: 1, name: "Alice", role: "admin" },
        { id: 2, name: "Bob", role: "user" },
      ];
      const grouped = groupBy(users, (u) => u.role);
      expect(grouped.admin[0].id).toBe(1);
      expect(grouped.user[0].id).toBe(2);
    });

    it("formatiert Daten für Anzeige", () => {
      const name = "john doe";
      expect(capitalize(name)).toBe("John doe");
      expect(toCamelCase("john_doe")).toBe("johnDoe");
    });

    it("alle Funktionen sind Pure Functions", () => {
      const obj = { a: 1 };
      const array = [1, 2, 3];
      expect(pick(obj, ["a"])).toEqual(pick(obj, ["a"]));
      expect(chunk(array, 2)).toEqual(chunk(array, 2));
    });

    it("kombiniert chunk und flatten", () => {
      const array = [1, 2, 3, 4];
      const chunked = chunk(array, 2);
      const flattened = flatten(chunked);
      expect(flattened).toEqual(array);
    });

    it("kombiniert unique und groupBy", () => {
      const data = [1, 2, 2, 3, 3, 3];
      const uniqueData = unique(data);
      const grouped = groupBy(uniqueData, (n) => String(n));
      expect(Object.keys(grouped).length).toBe(3);
    });

    it("verarbeitet JSON Parse mit Fallback", () => {
      const validJson = '{"key": "value"}';
      const invalidJson = "not json";
      const defaultValue = {};

      expect(parseJson(validJson, defaultValue)).toEqual({ key: "value" });
      expect(parseJson(invalidJson, defaultValue)).toEqual(defaultValue);
    });

    it("verarbeitet große Datenmengen", () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      const chunked = chunk(largeArray, 100);
      expect(chunked.length).toBe(10);
      expect(chunked[0].length).toBe(100);
    });

    it("kombiniert Case Conversion", () => {
      const snakeStr = "hello_world_test";
      const camelStr = toCamelCase(snakeStr);
      expect(camelStr).toBe("helloWorldTest");
      expect(toSnakeCase(camelStr)).toBe("hello_world_test");
    });

    it("kombiniert deepEqual mit komplexen Strukturen", () => {
      const original = {
        users: [
          { id: 1, roles: ["admin", "user"] },
          { id: 2, roles: ["user"] },
        ],
      };
      const merged = merge(original, {});
      expect(deepEqual(original, merged)).toBe(true);
    });
  });
});
