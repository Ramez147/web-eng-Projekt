# Loyalty Engine Platform (Next.js + Supabase)

Mandantenfahige B2B-SaaS-Plattform fur Treueprogramme mit API-first Architektur.

## Features

- Multi-Tenancy uber `organizations`
- Sichere API-Key Authentifizierung (Hash-Speicherung)
- Punkte vergeben (`earn`) und einlosen (`redeem`)
- Auto-Erstellung von Kundenprofilen bei erster API-Transaktion
- Vollstandige Transaktions-Historie fur Analytics
- Dashboard-Konsole unter `/dashboard`

## Tech Stack

- Next.js App Router
- Supabase (PostgreSQL)
- REST Route Handlers unter `/api/v1`

## Setup

1. Environment-Variablen setzen (`.env.local`):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

2. Stripe Webhook konfigurieren:

- Gehe zu deinem Stripe Dashboard > Webhooks
- Erstelle einen neuen Webhook mit URL: `https://yourdomain.com/api/payment/webhook`
- Wähle Events: `payment_intent.succeeded`
- Kopiere den Webhook Secret in `STRIPE_WEBHOOK_SECRET`

3. SQL-Migration in Supabase ausfuhren:

- Datei: `supabase/migrations/20260410_loyalty_engine.sql`
- Datei: `supabase/migrations/20260410_memberships.sql`
- Datei: `supabase/migrations/20260419_contact_requests.sql`

4. Dev-Server starten:

```bash
npm run dev
```

## API v1

### `POST /api/v1/organizations/register`

Registriert ein Unternehmen und gibt den Klartext-API-Key genau einmal zuruck.

Request:

```json
{
	"name": "ACME GmbH",
	"pointsRatio": 10
}
```

### `PATCH /api/v1/organizations/{organizationId}/ratio`

Aktualisiert die Punkte-Ratio.

Header:

- `x-api-key: ly_live_...`

Request:

```json
{
	"pointsRatio": 12
}
```

### `POST /api/v1/points/earn`

Rechnet EUR in Punkte um und schreibt sie dem Profil gut.

Header:

- `x-api-key: ly_live_...`

Request:

```json
{
	"organizationId": "uuid",
	"externalCustomerId": "customer-123",
	"amountEur": 59.9,
	"metadata": {
		"orderId": "order-999"
	}
}
```

### `POST /api/v1/points/redeem`

Prufung und Einlosung von Punkten. Bei zu wenig Punkten kommt `409`.

Header:

- `x-api-key: ly_live_...`

### `POST /api/v1/collect`

Alternative API-first Route fuer Punkteeingang. Die Organization wird aus dem `x-api-key` ermittelt.

Request-Beispiel:

```json
{
	"externalCustomerId": "customer-123",
	"amountEur": 59.9,
	"metadata": {
		"orderId": "order-999",
		"channel": "shopify"
	}
}
```

### `POST /api/v1/redeem`

Alternative API-first Route fuer Einloesung. Die Organization wird aus dem `x-api-key` ermittelt.

Request:

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

### `GET /api/v1/analytics/overview?organizationId={uuid}`

Liefert:

- Anzahl Kundenprofile
- Gesamtumsatz
- Punkte-Historie pro Tag
- letzte Transaktionen

Header:

- `x-api-key: ly_live_...`

## Stripe Payment Integration

Die Plattform unterstützt Zahlungen über Stripe für Treueprogramm-Funktionen.

### Verwendung der Payment-Komponente

Importiere die `StripePayment` Komponente in deine Seite:

```tsx
import { StripePayment } from "@/components/stripe-payment";

export default function CheckoutPage() {
  return (
    <div>
      <h1>Checkout</h1>
      <StripePayment
        amount={29.99}
        onSuccess={() => console.log("Payment successful")}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
```

### API Endpoints

- `POST /api/payment/create-intent` - Erstellt einen Payment Intent
- `POST /api/payment/webhook` - Webhook für Stripe Events

## Dashboard

`/dashboard` bietet:

- Registrierung neuer Tenants
- Membership-basierte Datenisolation je eingeloggtem User
- Profile-Management je Organization
- Ratio-Update (nur `admin` Role)
- Analytics-Ansicht (KPI, Punkte-Historie, Profile)

## API Collections

- Postman: `collections/loyalty-engine.postman_collection.json`
- Insomnia: `collections/loyalty-engine.insomnia.json`

## OpenAPI

- OpenAPI 3.1 spec: `docs/openapi.yaml`

## Integration Guide

- Enterprise Integration Guide: `docs/integration-guide-enterprise.md`
- Quickstart in 10 Minuten: `docs/quickstart-10min.md`

