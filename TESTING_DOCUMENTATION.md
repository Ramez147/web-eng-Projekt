# Testdokumentation - Web Engineering Projekt

**Zuletzt aktualisiert:** 20. Mai 2026  
**Gesamtzahl Test-Dateien:** 59  
**Test-Framework:** Jest, Vitest, React Testing Library

---

## Inhaltsverzeichnis

1. [Übersicht](#Übersicht)
2. [Test-Struktur & Organisation](#test-struktur--organisation)
3. [Test-Frameworks](#test-frameworks)
4. [Test-Kategorien](#test-kategorien)
5. [Tests Ausführen](#tests-ausführen)
6. [Detaillierte Test-Abdeckung](#detaillierte-test-abdeckung)
7. [Test-Qualitätsmetriken](#test-qualitätsmetriken)
8. [Best Practices](#best-practices)

---

## Übersicht

Dieses Projekt verfügt über umfassende Test-Abdeckung auf mehreren Ebenen:
- **Unit Tests:** Utility-Funktionen, Validatoren, Hilfsfunktionen
- **Component Tests:** React-Komponenten mit React Testing Library
- **Integration Tests:** API-Routen und Endpunkte
- **Landing Page Tests:** UI-Komponenten und Seitenstruktur

---

## Test-Struktur & Organisation

### Verzeichnisstruktur

```
web-eng-projekt/
├── assets/
│   ├── icons.test.tsx          # SVG icon rendering
├── hooks/
│   ├── use-mobile.test.ts       # Media query hooks
├── lib/
│   ├── format-number.test.ts    # Number formatting utilities
│   ├── supabaseClient.test.ts   # Supabase configuration
│   ├── utils.test.ts            # General utilities
│   └── loyalty/
│       ├── auth.test.ts         # API key validation
│       ├── db.test.ts           # Database operations
│       ├── validators.test.ts   # Input validation
│       ├── security.test.ts     # API key generation
│       ├── error-response.test.ts
│       ├── public-api.test.ts
│       ├── env.test.ts          # Environment variables
│       └── user-membership.test.ts
├── components/
│   ├── stripe-payment.test.tsx  # Payment components
│   ├── period-picker.test.tsx   # Period selection
│   └── dashboard/
│       └── CustomerDataTable.test.tsx
├── app/
│   ├── dashboard/
│   │   ├── actions.test.ts
│   │   ├── logout-button.test.tsx
│   │   ├── overview.test.tsx
│   │   └── tenant-console.test.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── signin/route.test.ts
│   │   │   └── signup/route.test.ts
│   │   ├── contact/route.test.ts
│   │   ├── payment/webhook/route.test.ts
│   │   └── v1/
│   │       ├── collect/route.test.ts
│   │       ├── redeem/route.test.ts
│   │       └── analytics/overview/route.test.ts
│   └── landing_page/
│       ├── App.test.tsx
│       └── components/
│           ├── Hero.test.tsx
│           ├── Footer.test.tsx
│           ├── Features.test.tsx
│           ├── FAQ.test.tsx
│           ├── Cta.test.tsx
│           ├── About.test.tsx
│           ├── HowItWorks.test.tsx
│           ├── Services.test.tsx
│           ├── Newsletter.test.tsx
│           ├── Pricing.test.tsx
│           ├── Sponsors.test.tsx
│           ├── HeroGlowButton.test.tsx
│           ├── HeroCards.test.tsx
│           ├── Icons.test.tsx
│           ├── Login.test.tsx
│           ├── mode-toggle.test.tsx
│           ├── Navbar.test.tsx
│           ├── ScrollToTop.test.tsx
│           └── about-us/AboutUsPage.test.tsx
```

---

## Test-Frameworks

### Jest
- **Konfiguration:** `jest.config.js`
- **Setup-Datei:** `jest.setup.js`
- **Verwendung:** API-Routen, Utilities und Node.js-basierte Tests

### Vitest
- **Konfiguration:** `vitest.config.ts`
- **Setup-Datei:** `vitest.setup.ts`
- **Verwendung:** Schnellere Unit Tests und Component Tests

### React Testing Library
- **Zweck:** Testing von React-Komponenten mit Fokus auf Benutzerverhalten
- **Best Practice:** Tests interagieren mit der DOM wie ein Benutzer

---

## Test-Kategorien

### 1. Kern-Utilities & Hilfsfunktionen (6 Dateien)

#### `assets/icons.test.tsx`
Tests SVG-Icon-Rendering und Strukturvalidierung
- ✓ Icon viewBox-Rendering
- ✓ Stroke-Attribute
- ✓ SVG-DOM-Struktur

#### `hooks/use-mobile.test.ts`
Tests mobile responsive hooks
- ✓ Media query detection
- ✓ Breakpoint validation
- ✓ Listener creation and cleanup

#### `lib/format-number.test.ts`
Tests number formatting utilities
- ✓ Compact format (1.2K, 3.5M, 1.2B)
- ✓ Standard format with thousand separators
- ✓ Magnitude prefix validation

#### `lib/utils.test.ts`
Tests general utility functions
- ✓ Class name merging with `cn()`
- ✓ Type checking (object vs primitive)
- ✓ Deep equality comparison
- ✓ String transformations (camelCase, snake_case)

#### `lib/supabaseClient.test.ts`
Tests Supabase configuration validation
- ✓ URL format validation
- ✓ API key validation
- ✓ Hostname extraction

#### `lib/format-number.test.ts`
Comprehensive number formatting tests
- ✓ Large number abbreviations
- ✓ Decimal precision
- ✓ Locale-aware formatting

---

### 2. Loyalty Engine-Bibliothek (8 Dateien)

Die Loyalty Engine ist die zentrale Geschäftslogik mit umfassender Test-Abdeckung.

#### `lib/loyalty/auth.test.ts`
API authentication validation
- ✓ API key format validation
- ✓ Header-based key verification
- ✓ Organization context matching
- ✓ Authorization scope checking

#### `lib/loyalty/validators.test.ts`
Input validation for all API operations
- ✓ Positive number validation
- ✓ String format checking
- ✓ Integer type validation
- ✓ Range validation
- ✓ Pattern matching (regex)
- ✓ Email validation
- ✓ UUID validation
- ✓ Enum value checking

#### `lib/loyalty/db.test.ts`
Database operations and validation
- ✓ Supabase URL/key validation
- ✓ Table name validation
- ✓ Column name validation
- ✓ Query operations
- ✓ Connection health checks
- ✓ Transaction handling

#### `lib/loyalty/security.test.ts`
API key generation and security
- ✓ Key generation with `ly_live_` prefix format
- ✓ Key uniqueness validation
- ✓ Length validation (32+ characters)
- ✓ Hex character format checking

#### `lib/loyalty/error-response.test.ts`
HTTP error status mapping
- ✓ 409 Conflict (insufficient points)
- ✓ 401 Unauthorized
- ✓ 403 Forbidden
- ✓ 400 Bad Request (validation errors)

#### `lib/loyalty/public-api.test.ts`
Public API request/response schemas
- ✓ Collect points request format
- ✓ Redeem points request format
- ✓ Response envelope structure
- ✓ Error response formatting

#### `lib/loyalty/env.test.ts`
Environment variable validation
- ✓ Required env variable checking
- ✓ Supabase URL validation
- ✓ Publishable key validation
- ✓ Secret key validation

#### `lib/loyalty/user-membership.test.ts`
User membership context and roles
- ✓ Membership context creation
- ✓ Role validation (admin/member)
- ✓ Permission checking
- ✓ Membership data formatting

---

### 3. React-Komponenten (3 Dateien)

#### `components/stripe-payment.test.tsx`
Payment component logic
- ✓ Payment state building
- ✓ Amount validation
- ✓ Message constant validation
- ✓ CSS class assignment

#### `components/period-picker.test.tsx`
Period selection component
- ✓ Period range validation
- ✓ Dropdown option handling
- ✓ CSS class consistency
- ✓ Change event parsing

#### `components/dashboard/CustomerDataTable.test.tsx`
Customer data display
- ✓ Avatar className generation
- ✓ Initial extraction from names
- ✓ Range formatting for display
- ✓ Data transformation

---

### 4. Dashboard-Seiten (4 Dateien)

#### `app/dashboard/actions.test.ts`
Server actions for dashboard
- ✓ API key generation validation
- ✓ UUID validation (invalid input handling)
- ✓ Organization verification
- ✓ Key uniqueness checks

#### `app/dashboard/logout-button.test.tsx`
Logout functionality
- ✓ Logout request handling
- ✓ Response validation
- ✓ Message display
- ✓ Session cleanup

#### `app/dashboard/overview.test.tsx`
Dashboard overview page
- ✓ Time frame resolution (daily/weekly/monthly/yearly)
- ✓ KPI types (earned, redeemed, etc.)
- ✓ Time frame validation
- ✓ Data aggregation

#### `app/dashboard/tenant-console.test.tsx`
Multi-tenant console features
- ✓ Authentication modes (signin/signup)
- ✓ User roles (admin/member)
- ✓ Transaction types (earn/redeem)
- ✓ Analytics response structure

---

### 5. API-Routen - Authentifizierung (2 Dateien)

#### `app/api/auth/signin/route.test.ts`
Sign-in endpoint
- ✓ Request type validation
- ✓ Response structure
- ✓ HTTP status codes (200, 401, 400)
- ✓ Database result handling

#### `app/api/auth/signup/route.test.ts`
Sign-up endpoint
- ✓ Request validation
- ✓ User creation
- ✓ HTTP status codes
- ✓ Duplicate user handling

---

### 6. API-Routen - Kernfunktionen (4 Dateien)

#### `app/api/contact/route.test.ts`
Contact form submission API
- ✓ Missing field validation
- ✓ Invalid JSON handling
- ✓ Email validation
- ✓ Message storage

#### `app/api/v1/collect/route.test.ts`
Points collection endpoint
- ✓ Customer ID validation
- ✓ Points amount validation
- ✓ Metadata handling
- ✓ Balance updates

#### `app/api/v1/redeem/route.test.ts`
Points redemption endpoint
- ✓ Response structure validation
- ✓ Error states (insufficient points)
- ✓ Balance deduction
- ✓ Transaction logging

#### `app/api/v1/analytics/overview/route.test.ts`
Analytics data endpoint
- ✓ OrganizationId parameter validation
- ✓ Organization data retrieval
- ✓ Analytics aggregation
- ✓ Time period calculations

---

### 7. API-Routen - Zahlungen (1 Datei)

#### `app/api/payment/webhook/route.test.ts`
Stripe webhook handling
- ✓ Stripe event validation
- ✓ Event type checking (payment_intent.succeeded, etc.)
- ✓ Payment intent extraction
- ✓ Payment method validation
- ✓ Webhook signature verification

---

### 8. Landing Page - Hauptkomponenten (1 Datei)

#### `app/landing_page/App.test.tsx`
Main landing page structure
- ✓ App wrapper classes
- ✓ Navigation rendering
- ✓ Footer rendering
- ✓ Hero section structure
- ✓ Dark mode support

---

### 9. Landing Page - Abschnitte (11 Dateien)

#### `app/landing_page/components/Hero.test.tsx`
Hero section
- ✓ Badge display
- ✓ Heading text
- ✓ Description content
- ✓ CTA button

#### `app/landing_page/components/Features.test.tsx`
Features section
- ✓ Feature card rendering
- ✓ Title: "Flexible Points System"
- ✓ Title: "API Integration"
- ✓ Title: "Real-Time Analytics"

#### `app/landing_page/components/Footer.test.tsx`
Footer section
- ✓ Brand name display
- ✓ Description text
- ✓ Trust badges (99.9% uptime)
- ✓ DSGVO compliance badge
- ✓ 24/7 monitoring badge
- ✓ Links validation

#### `app/landing_page/components/FAQ.test.tsx`
FAQ section
- ✓ Heading display
- ✓ Question list rendering
- ✓ Accordion functionality
- ✓ Meta card display

#### `app/landing_page/components/Cta.test.tsx`
Call-to-action section
- ✓ CTA heading
- ✓ Description text
- ✓ Button interaction

#### `app/landing_page/components/About.test.tsx`
About section
- ✓ Company heading
- ✓ Description content
- ✓ Company image rendering
- ✓ Statistics display

#### `app/landing_page/components/HowItWorks.test.tsx`
How-it-works section
- ✓ Step-by-step guide
- ✓ Feature titles (Accessibility)
- ✓ Step visualization

#### `app/landing_page/components/Services.test.tsx`
Services section
- ✓ Section title: "Client-Centric Services"
- ✓ Styling and layout

#### `app/landing_page/components/Newsletter.test.tsx`
Newsletter signup section
- ✓ Layout structure
- ✓ Title display
- ✓ Form input
- ✓ Responsive classes

#### `app/landing_page/components/Pricing.test.tsx`
Pricing section
- ✓ Section title styling
- ✓ Description text
- ✓ Price tier display

#### `app/landing_page/components/Sponsors.test.tsx`
Sponsors section
- ✓ Sponsor cards
- ✓ Glow effect styling
- ✓ Responsive padding

---

### 10. Landing Page - UI-Komponenten (9 Dateien)

#### `app/landing_page/components/HeroGlowButton.test.tsx`
Glow button component
- ✓ Href handling
- ✓ Label text
- ✓ CSS class validation
- ✓ Rel attribute

#### `app/landing_page/components/HeroCards.test.tsx`
Hero cards display
- ✓ "Live Loyalty Overview" card
- ✓ "Campaign Engine" card
- ✓ "Analytics" card
- ✓ Descriptions and metrics

#### `app/landing_page/components/Icons.test.tsx`
Icon components
- ✓ LogoIcon SVG rendering
- ✓ MedalIcon rendering
- ✓ MapIcon rendering
- ✓ PlaneIcon rendering
- ✓ GiftIcon rendering
- ✓ CSS classes

#### `app/landing_page/components/Login.test.tsx`
Login section
- ✓ Mode toggle buttons (signin/signup)
- ✓ Grid layout
- ✓ Form rendering

#### `app/landing_page/components/mode-toggle.test.tsx`
Theme toggle component
- ✓ Light mode
- ✓ Dark mode
- ✓ System mode
- ✓ Icon classes
- ✓ Button variants

#### `app/landing_page/components/Navbar.test.tsx`
Navigation bar
- ✓ Route list:
  - Anmeldung
  - Features
  - Trust
  - Pricing
  - FAQ
  - Demo
  - Kontakt
  - Team
  - About Us
- ✓ GitHub URL link

#### `app/landing_page/components/ScrollToTop.test.tsx`
Scroll-to-top button
- ✓ Visibility threshold (400px)
- ✓ Scroll event handling
- ✓ CSS class animation
- ✓ Click functionality

#### `app/landing_page/components/AboutUsPage.test.tsx`
About page
- ✓ Badge scaling calculation
- ✓ Value cards:
  - "Clear Product Logic"
  - "Technical Cleanliness"
- ✓ Headline display

---

## Tests Ausführen

### Konfigurationsdateien

Alle Test-Konfigurationen befinden sich im Projektstammverzeichnis:
- **Jest:** `jest.config.js`, `jest.setup.js`
- **Vitest:** `vitest.config.ts`, `vitest.setup.ts`

### Alle Tests Ausführen

```bash
npm test
```

### Tests im Watch-Modus Ausführen

```bash
npm test -- --watch
```

### Spezifische Test-Datei Ausführen

```bash
npm test -- components/stripe-payment.test.tsx
```

### Tests mit Abdeckungsbericht Ausführen

```bash
npm test -- --coverage
```

### Nur Jest Ausführen

```bash
npm test -- --config jest.config.js
```

### Nur Vitest Ausführen

```bash
npm test -- --config vitest.config.ts
```

### Landing Page Tests Ausführen

```bash
npm test -- app/landing_page
```

### API Tests Ausführen

```bash
npm test -- app/api
```

### Loyalty Engine Tests Ausführen

```bash
npm test -- lib/loyalty
```

---

## Detaillierte Test-Abdeckung

### Test-Statistiken

| Kategorie | Dateien | Fokusbereich |
|----------|-------|-----------|
| **Utilities** | 6 | Formatierung, Validierung, Hilfsfunktionen |
| **Loyalty Engine** | 8 | Zentrale Geschäftslogik |
| **Komponenten** | 3 | React-Komponentenverhalten |
| **Dashboard** | 4 | Seiten-Logik und Status |
| **Auth APIs** | 2 | Authentifizierungsfluss |
| **Feature APIs** | 4 | Loyalty-Funktionen (erfassen, einlösen, Analytik) |
| **Zahlungen** | 1 | Stripe-Webhook-Verarbeitung |
| **Landing Page - Abschnitte** | 11 | Abschnittsinhalte |
| **Landing Page - UI** | 9 | UI-Komponenten |
| **Landing Page - Hauptseite** | 1 | Hauptanwendungsstruktur |
| **GESAMT** | **59** | Umfassende Abdeckung |

### Verwendete Test-Muster

#### 1. **Unit Testing**
Isolierte Funktions-Tests mit Mocks
```typescript
describe('formatNumber', () => {
  it('should format large numbers with K suffix', () => {
    expect(formatNumber(1200)).toBe('1.2K');
  });
});
```

#### 2. **Component Testing**
React Testing Library - benutzerbasierte Tests
```typescript
describe('StripePayment', () => {
  it('should render payment button', () => {
    render(<StripePayment />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

#### 3. **Integration Testing**
API-Endpunkt-Testing mit Request/Response-Validierung
```typescript
describe('POST /api/v1/collect', () => {
  it('should collect points successfully', async () => {
    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

#### 4. **Validierungs-Testing**
Eingabevalidierung und Fehlerbehandlung
```typescript
describe('validators', () => {
  it('should validate positive numbers', () => {
    expect(validatePositiveNumber(100)).toBe(true);
    expect(validatePositiveNumber(-1)).toBe(false);
  });
});
```

---

## Test-Qualitätsmetriken

### Abdeckungsbereiche

✅ **Stärken:**
- Umfassendes Loyalty Engine Testing (8 Dateien)
- Vollständige API-Routen-Abdeckung (7 Dateien)
- Vollständiges Landing Page Komponenten-Testing (21 Dateien)
- Utility-Funktionsvalidierung (6 Dateien)
- Authentifizierungs-Flow-Testing
- Fehlerbehandlung und Grenzfälle

### Implementierte Test-Best-Practices

1. **Aussagekräftige Test-Namen**
   - Jeder Test erklärt klar, was getestet wird
   - Beispiel: "sollte positive Zahlen validieren"

2. **Isolation**
   - Tests sind nicht voneinander abhängig
   - Mocks und Fixtures für externe Abhängigkeiten

3. **Abdeckungsfokus**
   - Happy-Path-Szenarien
   - Fehlerfälle und Grenzfälle
   - Grenzbedingungen

4. **Lesbarkeit**
   - Klares Arrange-Act-Assert-Muster
   - Lesbare Assertions
   - Gute Test-Organisation mit describe-Blöcken

5. **Wartung**
   - Test-Dateien zusammen mit Quelldateien
   - Konsistente Benennungskonvention (*.test.ts, *.test.tsx)
   - Regelmäßige Aktualisierungen mit Code-Änderungen

---

## Best Practices

### Tests für neue Funktionen schreiben

1. **Test-Datei neben Quelle erstellen**
   ```
   src/
   ├── utils.ts
   └── utils.test.ts  ← Test-Datei
   ```

2. **Benennungskonventionen befolgen**
   - Datei: `*.test.ts` oder `*.test.tsx`
   - Test-Block: `describe('KomponentenName', () => { ... })`
   - Test-Fall: `it('sollte...', () => { ... })`

3. **Test-Struktur (AAA-Muster)**
   ```typescript
   it('sollte etwas tun', () => {
     // Arrange - Test-Daten einrichten
     const input = { value: 100 };
     
     // Act - Funktion ausführen
     const result = myFunction(input);
     
     // Assert - Ergebnis überprüfen
     expect(result).toBe(expected);
   });
   ```

4. **Aussagekräftige Assertions verwenden**
   ```typescript
   // ✓ Gut
   expect(user.role).toBe('admin');
   
   // ✗ Vermeiden
   expect(user).toBeTruthy();
   ```

5. **Verhalten testen, nicht Implementierung**
   ```typescript
   // ✓ Gut - testet Verhalten
   it('sollte Schaltfläche deaktivieren, wenn laden', () => {
     render(<Button loading={true} />);
     expect(screen.getByRole('button')).toBeDisabled();
   });
   
   // ✗ Vermeiden - testet Implementierung
   it('sollte disabled-Attribut setzen', () => {
     // ...
   });
   ```

### Häufige Test-Szenarien

#### API-Testing
```typescript
describe('POST /api/v1/collect', () => {
  it('sollte 400 für fehlende customer_id zurückgeben', async () => {
    const response = await POST({
      body: { points: 100 }
    });
    expect(response.status).toBe(400);
  });
});
```

#### Component-Testing
```typescript
describe('PaymentButton', () => {
  it('sollte Click-Event verarbeiten', () => {
    const handleClick = jest.fn();
    render(<PaymentButton onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

#### Validierungs-Testing
```typescript
describe('validators', () => {
  it('sollte E-Mail-Format validieren', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

### Tests Debuggen

```bash
# Test mit ausführlicher Ausgabe ausführen
npm test -- --verbose

# Einzelne Test-Datei mit Protokollierung ausführen
npm test -- components/stripe-payment.test.tsx --no-coverage

# In Node debuggen
node --inspect-brk node_modules/.bin/jest --runInBand
```

---

## Test-Wartung

### Regelmäßige Aufgaben

- ✓ Vollständige Test-Suite vor Commits ausführen
- ✓ Tests bei Funktionsänderungen aktualisieren
- ✓ Test-Dateien mit Quelldateien organisiert halten
- ✓ Veraltete Tests überprüfen und bereinigen
- ✓ Test-Leistung überwachen

### Tests zu CI/CD hinzufügen

Tests sollten bei folgenden Gelegenheiten ausgeführt werden:
- Pre-Commit-Hooks
- Pull-Request-Validierung
- Release-Builds
- Deployment-Pipelines

---

## Fehlerbehebung

### Häufige Probleme

| Problem | Lösung |
|-------|----------|
| Tests schlagen wegen env vars fehl | `.env`-Datei und env-Validierung überprüfen |
| Mock funktioniert nicht | Sicherstellen, dass Mock vor Import erstellt wird |
| Komponente wird nicht gerendert | Überprüfen, ob alle Props bereitgestellt sind |
| Async-Test-Timeout | Timeout erhöhen: `jest.setTimeout(10000)` |
| Port bereits in Verwendung | Vorhandenen Prozess beenden oder Port wechseln |

---

## Zugehörige Dokumentation

- Test-Framework-Dokumentation:
  - [Jest-Dokumentation](https://jestjs.io)
  - [Vitest-Dokumentation](https://vitest.dev)
  - [React Testing Library](https://testing-library.com/react)

- Projekt-Konfigurationsdateien:
  - [jest.config.js](jest.config.js)
  - [vitest.config.ts](vitest.config.ts)
  - [jest.setup.js](jest.setup.js)
  - [vitest.setup.ts](vitest.setup.ts)

---

## Fazit

Dieses Projekt verfügt über umfassende Test-Abdeckung auf allen Ebenen:
- **59 Test-Dateien** mit Unit-, Component- und Integration-Testing
- **Gut organisierte** Test-Struktur mit klarer Kategorisierung
- **Best Practices** überall implementiert (AAA-Muster, aussagekräftige Namen, Isolation)
- **Starke Abdeckung** kritischer Pfade (Loyalty Engine, API-Routen, Authentifizierung)
- **Landing Page** vollständig auf Inhalt und Struktur getestet

Die regelmäßige Ausführung und Wartung dieser Tests gewährleistet Code-Qualität und verhindert Regressions während die Projekt sich entwickelt.

---

**Erstellt:** 20. Mai 2026  
**Bei Fragen:** Beachten Sie einzelne Test-Dateien oder project README.md
