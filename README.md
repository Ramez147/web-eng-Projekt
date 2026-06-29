# 🎯 Loyalty Engine Platform

> **Mandantenfähige B2B-SaaS-Plattform für Treueprogramme mit API-first Architektur**

Built with **Next.js** + **Supabase** | Stripe Payments | Multi-Tenant | REST API v1

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [API Endpoints](#-api-endpoints)
- [Webhooks](#-webhooks)
- [Stripe Integration](#-stripe-payment-integration)
- [Dashboard](#-dashboard)
- [Docker](#-docker)
- [Documentation](#-documentation)

---

## ✨ Features

- 🏢 **Multi-Tenancy** über `organizations`
- 🔐 **Sichere API-Key Authentifizierung** (Hash-Speicherung)
- 💰 **Punkte-Management** – Punkte vergeben (`earn`) und einlösen (`redeem`)
- 👤 **Auto-Profile** – Kundenprofil wird bei erster API-Transaktion automatisch erstellt
- 📊 **Transaktions-Historie** – Vollständige Historie für Analytics & Reporting
- 🎨 **Dashboard** – Verwaltungskonsole unter `/dashboard`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js** App Router | Frontend & Server-Side Rendering |
| **Supabase** (PostgreSQL) | Database & Real-time Backend |
| **REST API v1** | API-first Architecture unter `/api/v1` |
| **Stripe** | Payment Processing |

---

## 🚀 Quick Start

### 1️⃣ Environment-Variablen einrichten

Erstelle `.env.local` mit folgendem Inhalt:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2️⃣ Stripe Webhook konfigurieren

1. Gehe zu **Stripe Dashboard** → **Webhooks**
2. Erstelle einen neuen Webhook:
   - **Endpoint URL**: `https://yourdomain.com/api/payment/webhook`
   - **Events**: `payment_intent.succeeded`
3. Kopiere den **Webhook Secret** in `.env.local` (`STRIPE_WEBHOOK_SECRET`)

### 3️⃣ Datenbank-Migrationen ausführen

Führe folgende SQL-Migrations in Supabase aus:

```sql
-- In Supabase SQL Editor:
supabase/migrations/20260410_loyalty_engine.sql
supabase/migrations/20260410_memberships.sql
supabase/migrations/20260419_contact_requests.sql
```

### 4️⃣ Development Server starten

```bash
npm install
npm run dev
```

Server läuft unter: **http://localhost:3000**

### 5️⃣ Smoke-Test (Optional)

Das Projekt enthält ein PowerShell-Skript für lokale End-to-End-Tests:

```powershell
$env:AUTH_EMAIL = 'dein.login@example.com'
$env:AUTH_PASSWORD = 'dein-passwort'
.\smoke-test.ps1
```

Oder mit Parametern:

```powershell
.\smoke-test.ps1 -AuthEmail 'dein.login@example.com' -AuthPassword 'dein-passwort'
```

Das Skript führt folgende Calls aus:
- `register` – Neue Organization registrieren
- `collect` – Punkte sammeln
- `redeem` – Punkte einlösen
- `analytics/overview` – Analytics abrufen

---

## 📡 API Endpoints

### Organization Management

#### `POST /api/v1/organizations/register`

Registriert eine neue Organization und gibt den **API-Key einmalig** in Klartext zurück.

**Request:**
```json
{
  "name": "ACME GmbH",
  "pointsRatio": 10
}
```

**Response:**
```json
{
  "organizationId": "uuid",
  "apiKey": "ly_live_..."
}
```

---

#### `PATCH /api/v1/organizations/{organizationId}/ratio`

Aktualisiert die Punkte-Ratio (nur für Admin).

**Headers:**
```
x-api-key: ly_live_...
```

**Request:**
```json
{
  "pointsRatio": 12
}
```

---

### Points Management

#### `POST /api/v1/points/earn`

Rechnet EUR-Betrag in Punkte um und schreibt diese dem Kundenprofil gut.

**Headers:**
```
x-api-key: ly_live_...
```

**Request:**
```json
{
  "organizationId": "uuid",
  "externalCustomerId": "customer-123",
  "amountEur": 59.90,
  "metadata": {
    "orderId": "order-999"
  }
}
```

---

#### `POST /api/v1/points/redeem`

Prüft verfügbare Punkte und löst diese ein. Bei zu wenig Punkten → `409 Conflict`.

**Headers:**
```
x-api-key: ly_live_...
```

**Request:**
```json
{
  "organizationId": "uuid",
  "externalCustomerId": "customer-123",
  "points": 300,
  "metadata": {
    "rewardCode": "VIP-REWARD"
  }
}
```

---

#### `POST /api/v1/collect` ⭐

**Alternative Route** – Organization wird automatisch aus `x-api-key` ermittelt.

**Headers:**
```
x-api-key: ly_live_...
```

**Request:**
```json
{
  "externalCustomerId": "customer-123",
  "amountEur": 59.90,
  "metadata": {
    "orderId": "order-999",
    "channel": "shopify"
  }
}
```

---

#### `POST /api/v1/redeem` ⭐

**Alternative Route** – Organization wird automatisch aus `x-api-key` ermittelt.

**Headers:**
```
x-api-key: ly_live_...
```

**Request:**
```json
{
  "externalCustomerId": "customer-123",
  "points": 300,
  "metadata": {
    "rewardCode": "VIP-REWARD"
  }
}
```

---

### Analytics & History

#### `GET /api/v1/analytics/overview`

Liefert KPIs für eine Organization.

**Headers:**
```
x-api-key: ly_live_...
```

**Query Parameter:**
```
organizationId=uuid
```

**Response:**
```json
{
  "customerCount": 1250,
  "totalRevenueEur": 45230.50,
  "pointsPerDay": [
    { "date": "2026-04-28", "points": 15000 }
  ],
  "recentTransactions": [...]
}
```

---

#### `GET /api/v1/history`

Ruft die komplette Transaktionshistorie eines Kunden ab.

**Query Parameter:**
```
externalCustomerId=customer-123
```

**Authentifizierung – zwei Optionen:**

**Option 1: API-Key (Public API)**
```bash
curl -X GET "http://localhost:3000/api/v1/history?externalCustomerId=customer-123" \
  -H "x-api-key: ly_live_..."
```

**Option 2: Session-Cookie (Dashboard)**
- Automatisch für angemeldete Dashboard-User
- Filtert nach Organization des angemeldeten Users

**Response:**
```json
{
  "organizationId": "uuid",
  "externalCustomerId": "customer-123",
  "customer": {
    "id": "profile-uuid",
    "pointsBalance": 1500,
    "totalSpentEur": 1598.90,
    "createdAt": "2026-04-20T10:00:00Z"
  },
  "history": [
    {
      "id": "tx-uuid",
      "type": "earn",
      "points": 150,
      "eurAmount": 10.99,
      "createdAt": "2026-04-28T15:30:00Z",
      "metadata": { "orderId": "order-1001" }
    }
  ]
}
```

**Error Codes:**

| Status | Beschreibung |
|--------|-------------|
| `400` | `externalCustomerId` fehlt oder leer |
| `401` | Kein API-Key und kein Session-Cookie |
| `403` | Membership nicht gefunden für User |
| `404` | Kunde existiert nicht in dieser Organization |

---

## 🪝 Webhooks

### Stripe Webhook Integration

Der Stripe-Webhook verarbeitet Payment-Events asynchron:

**Endpoint:** `POST /api/payment/webhook`

#### Ablauf

1. Stripe sendet HTTP-`POST` mit signiertem Event
2. Route liest Raw-Body (Stripe validiert Signatur über exakten Payload)
3. Signatur aus Header `stripe-signature` wird gelesen
4. Mit `STRIPE_WEBHOOK_SECRET` wird Event kryptografisch verifiziert
5. Nur bekannte Event-Typen werden verarbeitet
6. Daten extrahiert und protokolliert
7. Route antwortet mit `200 { received: true }`

#### Unterstützte Event-Typen

```
✅ payment_intent.succeeded
✅ payment_intent.failed
✅ payment_method.attached
✅ charge.succeeded
✅ charge.failed
```

#### Security Best Practices

- ✓ Stripe-Signaturprüfung ist erforderlich (keine freien JSON-Eingaben)
- ✓ Endpoint antwortet schnell (`200` + `{ received: true }`)
- ✓ Geschäftslogik läuft nur nach erfolgreicher Verifikation
- ✓ Idempotent implementiert (Stripe sendet ggf. Events erneut)

#### Hilfsfunktionen

Die Webhook-Route verwendet kleine, testbare Funktionen:

- `isValidEventType(...)` – Prüft Event-Typ
- `isValidStripeEvent(...)` – Prüft Event-Struktur
- `isValidWebhookHeaders(...)` – Liest Signatur-Header
- `shouldProcessEvent(...)` – Kombiniert Prüfungen
- `extractPaymentIntentFromEvent(...)` – Extrahiert Payment-Intent
- `extractPaymentMethodFromEvent(...)` – Extrahiert Payment-Method

#### Konfiguration

**Erforderliche Umgebungsvariablen:**

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 💳 Stripe Payment Integration

Die Plattform unterstützt Zahlungen über **Stripe** für Treueprogramm-Funktionen.

### StripePayment Komponente

Verwende die `StripePayment` Komponente in deinen Seiten:

```tsx
import { StripePayment } from "@/components/stripe-payment";

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      <StripePayment
        amount={29.99}
        onSuccess={() => console.log("✅ Payment successful")}
        onError={(error) => console.error("❌", error)}
      />
    </div>
  );
}
```

### Payment API Endpoints

| Endpoint | Beschreibung |
|----------|-------------|
| `POST /api/payment/create-intent` | Erstellt einen Payment Intent |
| `POST /api/payment/webhook` | Webhook für Stripe Events |

---

## 📊 Dashboard

Zugang unter: **http://localhost:3000/dashboard**

### Features

- 🏢 **Multi-Tenant Setup** – Neue Organizations registrieren
- 🔒 **Membership-basierte Datenisolation** – Daten nach User & Organization
- 👥 **Profile Management** – Customer-Profile pro Organization verwalten
- ⚙️ **Settings** – Punkte-Ratio updaten (nur Admin)
- 📈 **Analytics** – KPIs, Punkte-Historie, Customer-Profiles

---

## 🐳 Docker

### Development

```bash
# Build Image mit PUBLIC-Variablen
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL="$NEXT_PUBLIC_SUPABASE_URL" \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="$NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  --build-arg NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" \
  -t loyalty-engine .

# Run Container mit RUNTIME-Secrets
docker run --env-file .env.local -p 3000:3000 loyalty-engine
```

### Production (Docker Compose)

```bash
# .env.local vorbereiten
cp .env.example .env.local
# Werte aus Vercel konfigurieren (siehe Setup Schritt 1)

# Starten
docker compose --env-file .env.local up --build
```

**Hinweis:** Rebuild Image, wenn `NEXT_PUBLIC_*` Werte ändern.
Server-only Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, etc.) bleiben Runtime-Variablen.

---

## 📚 Documentation

### API Collections

- 📮 **Postman**: `collections/loyalty-engine.postman_collection.json`
- 🪲 **Insomnia**: `collections/loyalty-engine.insomnia.json`

### OpenAPI Specification

- 📖 **OpenAPI 3.1**: `docs/openapi.yaml`

### Guides

- 🚀 **Quickstart (10 Minuten)**: `docs/quickstart-10min.md`
- 🏢 **Enterprise Integration**: `docs/integration-guide-enterprise.md`

---

## 📝 License

This project is part of the Web Engineering Course (WI-2024).

---

## 💡 Support

Bei Fragen oder Issues: [GitHub Issues](../../issues)

