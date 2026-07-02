# 🧪 Testdokumentation — Web Engineering Projekt

**Zuletzt aktualisiert:** 02. Juli 2026  
**Test-Frameworks:** Jest · Vitest · React Testing Library  
**Namenskonventionen:** `*.test.ts`, `*.test.tsx`, `*.test.js`, `*.test.jsx`

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Teststruktur & Organisation](#teststruktur--organisation)
3. [Frameworks & Setup](#frameworks--setup)
4. [Tests ausführen](#tests-ausführen)
5. [Detaillierte Test-Abdeckung](#detaillierte-test-abdeckung)
6. [Vollständige Liste aller Testdateien](#vollständige-liste-aller-testdateien)
7. [Qualitätsmetriken & Best Practices](#qualitätsmetriken--best-practices)
8. [Test-Wartung & CI](#test-wartung--ci)
9. [Fehlerbehebung](#fehlerbehebung)
10. [Zugehörige Dokumentation](#zugehörige-dokumentation)

---

## Überblick

Dieses Projekt verfügt über eine mehrstufige Testabdeckung:

- **Unit Tests**: Utilities, Validatoren, Hilfsfunktionen
- **Component Tests**: React-Komponenten (RTL)
- **Integration Tests**: API-Routen, Flows, Webhooks
- **Landing-Page Tests**: Seitenstruktur und UI-Bausteine

Ziel: schnelle Regressionserkennung, klare Wartbarkeit und zuverlässige Releases.

---

## Teststruktur & Organisation

Tests liegen nahe am Quellcode (co-located) und folgen einer konsistenten Dateibenennung.

```text
web-eng-projekt/
├── app/
│   ├── api/
│   ├── dashboard/
│   └── landing_page/
├── components/
├── hooks/
├── lib/
│   └── loyalty/
└── TESTING_DOCUMENTATION.md
```

### Konventionen

- Dateinamen: `*.test.ts(x)` / `*.test.js(x)`
- AAA-Prinzip: **Arrange · Act · Assert**
- Fokus auf Verhalten statt Implementation Details

---

## Frameworks & Setup

### Jest
- Konfiguration: `jest.config.js`
- Setup: `jest.setup.js`
- Fokus: API-Routen, Node-nahe Tests, Utilities

### Vitest
- Konfiguration: `vitest.config.ts`
- Setup: `vitest.setup.ts`
- Fokus: schnelle Unit- und Komponententests

### React Testing Library
- Benutzerzentrierte Assertions
- DOM-Interaktionen wie im echten Nutzerverhalten

---

## Tests ausführen

### Alle Tests
```bash
npm test
```

### Watch-Modus
```bash
npm test -- --watch
```

### Einzelne Datei
```bash
npm test -- components/stripe-payment.test.tsx
```

### Coverage
```bash
npm test -- --coverage
```

### Nur Jest / nur Vitest
```bash
npm test -- --config jest.config.js
npm test -- --config vitest.config.ts
```

### Nach Bereich
```bash
# Landing Page
npm test -- app/landing_page

# API
npm test -- app/api

# Loyalty
npm test -- lib/loyalty
```

---

## Detaillierte Test-Abdeckung

| Kategorie                     | Fokusbereich                                      |
|------------------------------|---------------------------------------------------|
| Utilities                    | Formatierung, Parsing, Object/Array-Helfer        |
| Loyalty Engine               | Geschäftslogik, Validation, Punktefluss           |
| Komponenten                  | Rendering, Props, Interaktion                     |
| Dashboard                    | Console-/Action-Logik, Tenant-Flows               |
| Auth APIs                    | Sign-in/Sign-out Verhalten und Fehlerbehandlung   |
| Feature APIs                 | Collect/Redeem/Analytics Endpunkte                |
| Zahlungen                    | Stripe-/Webhook-nahe Logik                        |
| Landing Page                 | Seitenstruktur, Sections, Content/UI-Komponenten  |

---

## Vollständige Liste aller Testdateien

> ✅ Diese Sektion ist für die **komplette** Auflistung aller `*.test.*` Dateien gedacht.  
> Format: nach Verzeichnis gruppiert, alphabetisch sortiert.

### `app/`
- `app/api/auth/signout/route.test.ts`
- `app/dashboard/actions.test.ts`
- `app/dashboard/tenant-console.test.tsx`
- `app/landing_page/components/About.test.tsx`
- `app/landing_page/components/Team.test.tsx`
- `app/landing_page/components/kontakt/KontaktPage.test.tsx`

### `components/`
- `components/stripe-payment.test.tsx`

### `hooks/`
- `hooks/use-mobile.test.ts`

### `lib/`
- `lib/utils.test.ts`
- `lib/loyalty/env.test.ts`

---

## Qualitätsmetriken & Best Practices

### Stärken
- Gute Abdeckung geschäftskritischer Loyalty-/API-Pfade
- Solide Landing-Page-Komponententests
- Sinnvolle Utility-Tests mit Edge-Cases

### Empfehlungen
1. Aussagekräftige Testnamen (Feature + Erwartung)
2. Isolierte Tests via Mocks/Fixtures
3. AAA strikt einhalten
4. Verhalten testen, nicht interne Details
5. Tests bei Feature-Änderungen synchron aktualisieren

### Assertion-Beispiel

```ts
// ✅ Gut
expect(user.role).toBe("admin");

// ❌ Zu ungenau
expect(user).toBeTruthy();
```

---

## Test-Wartung & CI

### Regelmäßig
- Test-Suite vor jedem Commit ausführen
- Veraltete Tests entfernen oder refactoren
- Flaky Tests priorisiert stabilisieren
- Laufzeit & Performance beobachten

### CI/CD-Empfehlung
Tests laufen bei:
- Pre-Commit Hooks
- Pull-Request Checks
- Release-Builds
- Deployment-Pipelines

---

## Fehlerbehebung

- **Fehlende ENV Vars** → `.env` / CI Secrets prüfen
- **Mock greift nicht** → Mock vor Importen definieren
- **Komponente rendert nicht** → Props/Provider prüfen
- **Async-Timeouts** → `jest.setTimeout(10000)` oder gezielte Wait-Strategie
- **Port-Konflikte** → laufenden Prozess beenden / Port wechseln

---

## Zugehörige Dokumentation

- Jest: https://jestjs.io
- Vitest: https://vitest.dev
- React Testing Library: https://testing-library.com/react

Projektdateien:
- `jest.config.js`
- `jest.setup.js`
- `vitest.config.ts`
- `vitest.setup.ts`

---

## Fazit

Die Testlandschaft ist solide und praxisnah aufgebaut.  
Mit vollständiger Dateiliste, klarer Struktur und konsistenten Konventionen ist die Dokumentation jetzt deutlich wartbarer und schneller nutzbar.

**Überarbeitet:** 02. Juli 2026
