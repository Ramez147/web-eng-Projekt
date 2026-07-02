# Testdokumentation — Web Engineering Projekt

**Zuletzt aktualisiert:** 20. Mai 2026  
**Anzahl Test-Dateien:** 59  
**Test-Frameworks:** Jest · Vitest · React Testing Library

---

Inhalt

- Übersicht
- Teststruktur & Organisation
- Test-Frameworks
- Testkategorien (Kurz)
- Tests ausführen
- Detaillierte Test-Abdeckung
- Test-Qualitätsmetriken & Best Practices
- Test-Wartung & CI
- Fehlerbehebung
- Zugehörige Dokumentation

---

## Übersicht

Dieses Projekt verfügt über eine umfassende Testabdeckung auf mehreren Ebenen:

- Unit Tests: Utilities, Validatoren und Hilfsfunktionen
- Component Tests: React-Komponenten (React Testing Library)
- Integration Tests: API-Routen und Endpunkte
- Landing Page Tests: UI-Komponenten und Seiten

Ziel dieser Dokumentation ist es, Teststruktur, Ausführung und Wartung klar und schnell nutzbar zu dokumentieren.

---

## Teststruktur & Organisation

Tests liegen in derselben Ordnerstruktur wie der Quellcode und folgen der Namenskonvention `*.test.ts` / `*.test.tsx`.

Projekt (Auszug):

```text
web-eng-projekt/
├── assets/
│   └── icons.test.tsx
├── hooks/
│   └── use-mobile.test.ts
├── lib/
│   ├── format-number.test.ts
│   ├── supabaseClient.test.ts
│   └── loyalty/
│       ├── auth.test.ts
│       └── validators.test.ts
├── components/
│   ├── stripe-payment.test.tsx
│   └── period-picker.test.tsx
├── app/
│   ├── dashboard/
│   ├── api/
│   └── landing_page/
└── TESTING_DOCUMENTATION.md
```

---

## Test-Frameworks

- Jest
  - Konfiguration: `jest.config.js`
  - Setup: `jest.setup.js`
  - Einsatz: API-Routen, Utilities, Node.js-Tests

- Vitest
  - Konfiguration: `vitest.config.ts`
  - Setup: `vitest.setup.ts`
  - Einsatz: schnelle Unit- und Komponententests

- React Testing Library
  - Zweck: Komponenten aus Sicht des Benutzers testen
  - Best Practice: DOM-Interaktion wie ein Benutzer

---

## Testkategorien (Kurz)

1. Kern-Utilities & Hilfsfunktionen (6 Dateien)
2. Loyalty Engine (8 Dateien)
3. React-Komponenten (3 Dateien)
4. Dashboard-Seiten (4 Dateien)
5. Auth-API-Routen (2 Dateien)
6. Feature-API-Routen (4 Dateien)
7. Zahlungen / Webhooks (1 Datei)
8. Landing Page — Hauptseite (1 Datei)
9. Landing Page — Abschnitte (11 Dateien)
10. Landing Page — UI-Komponenten (9 Dateien)

Weitere Details folgen im Abschnitt „Detaillierte Test-Abdeckung“.

---

## Tests ausführen

Alle Tests

```bash
npm test
```

Watch-Modus

```bash
npm test -- --watch
```

Spezifische Datei

```bash
npm test -- components/stripe-payment.test.tsx
```

Coverage

```bash
npm test -- --coverage
```

Nur Jest / Nur Vitest

```bash
npm test -- --config jest.config.js
npm test -- --config vitest.config.ts
```

Beispiel-Ordner

```bash
# Landing Page Tests
npm test -- app/landing_page

# API Tests
npm test -- app/api

# Loyalty Engine Tests
npm test -- lib/loyalty
```

---

## Detaillierte Test-Abdeckung

Kurzstatistiken

| Kategorie                          | Dateien | Fokusbereich                                |
|-----------------------------------:|:-------:|:--------------------------------------------|
| Utilities                          | 6       | Formatierung, Validierung, Hilfsfunktionen  |
| Loyalty Engine                     | 8       | Zentrale Geschäftslogik                     |
| Komponenten                        | 3       | React-Komponentenverhalten                  |
| Dashboard                          | 4       | Seiten-Logik und Status                     |
| Auth APIs                          | 2       | Authentifizierungsfluss                     |
| Feature APIs                       | 4       | Loyalty-Funktionen (collect, redeem, analytics) |
| Zahlungen                          | 1       | Stripe-Webhook-Verarbeitung                 |
| Landing Page — Abschnitte          | 11      | Inhalt & Sections                           |
| Landing Page — UI                  | 9       | UI-Komponenten                              |
| Landing Page — Hauptseite          | 1       | Hauptanwendungsstruktur                     |
| GESAMT                             | **59**  | Umfassende Abdeckung                        |

Beispiel-Tests

Unit Test (formatNumber)

```typescript
describe('formatNumber', () => {
  it('formatiert große Zahlen mit K-Suffix', () => {
    expect(formatNumber(1200)).toBe('1.2K');
  });
});
```

Component Test (StripePayment)

```typescript
describe('StripePayment', () => {
  it('rendert den Bezahl-Button', () => {
    render(<StripePayment />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

Integration Test (POST /api/v1/collect)

```typescript
describe('POST /api/v1/collect', () => {
  it('sammelt Punkte erfolgreich', async () => {
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

Validierungs-Tests

```typescript
describe('validators', () => {
  it('validiert positive Zahlen korrekt', () => {
    expect(validatePositiveNumber(100)).toBe(true);
    expect(validatePositiveNumber(-1)).toBe(false);
  });
});
```

---

## Test-Qualitätsmetriken & Best Practices

Stärken

- Umfangreiche Tests für Loyalty Engine und API-Routen
- Vollständige Landing-Page-Komponententests
- Gute Abdeckung für Utilities

Empfohlene Best Practices

1. Aussagekräftige Test‑ und Case‑Namen
2. Tests isoliert halten (Mocks, Fixtures)
3. AAA-Muster (Arrange, Act, Assert)
4. Verhalten testen, nicht Implementierungsdetails
5. Tests neben jeweiligem Quellcode ablegen

Beispiel für aussagekräftige Assertions

```typescript
// ✓ Gut
expect(user.role).toBe('admin');

// ✗ Vermeiden
expect(user).toBeTruthy();
```

---

## Test-Wartung & CI

Regelmäßig

- Test-Suite vor Commits ausführen
- Tests bei Änderungen anpassen
- Veraltete Tests entfernen
- Testperformance beobachten

CI/CD

Tests sollten laufen bei:
- Pre-Commit Hooks
- Pull-Request Validierung
- Release-Builds
- Deployment-Pipelines

---

## Fehlerbehebung — Häufige Probleme

- Tests fehlschlagen wegen fehlender env vars → `.env` prüfen
- Mock greift nicht → Mock vor Importen definieren
- Komponente rendert nicht → Fehlende Props prüfen
- Async-Timeouts → `jest.setTimeout(10000)`
- Port belegt → laufenden Prozess beenden oder Port ändern

---

## Zugehörige Dokumentation

- Jest: https://jestjs.io
- Vitest: https://vitest.dev
- React Testing Library: https://testing-library.com/react

Projekt-Konfigurationsdateien

- `jest.config.js`
- `jest.setup.js`
- `vitest.config.ts`
- `vitest.setup.ts`

---

## Fazit

Die Test-Suite (59 Dateien) bietet eine solide Abdeckung über Unit-, Component- und Integrationstests. Die Struktur ist wartbar und folgt Best Practices, sodass Regressionen frühzeitig erkannt werden können.

**Überarbeitet:** 20. Mai 2026
