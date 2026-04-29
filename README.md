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

### `GET /api/v1/history?externalCustomerId={customerId}`

Ruft die komplette Transaktionshistorie für einen spezifischen Endkunden ab.

**Authentifizierung:** Unterstützt zwei Methoden

1. **Public API (API-Key):**
   ```bash
   curl -X GET "http://localhost:3000/api/v1/history?externalCustomerId=customer-123" \
     -H "x-api-key: ly_live_..."
   ```

2. **Dashboard (Session-Cookie):**
   - Automatisch für angemeldete Dashboard-Nutzer
   - Filtert nach Organization des aktuellen Users

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
      "metadata": {"orderId": "order-1001"}
    }
  ]
}
```

**Fehlercodes:**

- `400` - `externalCustomerId` fehlt oder leer
- `401` - Kein API-Key und kein Session-Cookie
- `403` - Membership nicht gefunden für angemeldeten User
- `404` - Kunde existiert nicht in dieser Organisation

### Webhooks im Projekt

Dieses Projekt verwendet Webhooks an der Stelle, an der ein externer Dienst ein Ereignis nicht direkt im synchronen API-Call abschließt, sondern später asynchron meldet. Der aktuell implementierte Webhook ist der Stripe-Payment-Webhook unter `POST /api/payment/webhook`.

#### Wie der Stripe-Webhook funktioniert

1. Stripe sendet ein Ereignis als HTTP-`POST` an die Webhook-Route.
2. Die Route liest den Roh-Request-Body als Text ein, weil Stripe die Signatur über den exakten Payload prüft.
3. Aus dem Header `stripe-signature` wird die Signatur gelesen.
4. Mit `STRIPE_WEBHOOK_SECRET` und `stripe.webhooks.constructEvent(...)` wird das Event kryptografisch verifiziert.
5. Nur Events mit bekannter Struktur und bekanntem Typ werden weiterverarbeitet.
6. Für unterstützte Events werden die relevanten Daten extrahiert und protokolliert.
7. Danach antwortet die Route mit `200` und `{ received: true }`, damit Stripe das Event als zugestellt betrachtet.

#### Unterstützte Event-Typen

Die aktuelle Implementierung verarbeitet diese Stripe-Events:

- `payment_intent.succeeded`
- `payment_intent.failed`
- `payment_method.attached`
- `charge.succeeded`
- `charge.failed`

In der Praxis werden derzeit vor allem `payment_intent.succeeded` und `payment_method.attached` in der Route aktiv behandelt. Andere valide Event-Typen werden akzeptiert, aber nur als empfangen bestätigt.

#### Sicherheits- und Verarbeitungsregeln

- Der Webhook verlässt sich nicht auf freie JSON-Eingaben, sondern auf die Stripe-Signaturprüfung.
- Der Endpoint ist absichtlich schlank gehalten und soll schnell antworten.
- Geschäftslogik wie Datenbank-Updates, Benachrichtigungen oder Folgeprozesse sollte erst nach erfolgreicher Verifikation ausgelöst werden.
- Webhooks müssen idempotent verarbeitet werden, weil Anbieter wie Stripe Ereignisse im Fehlerfall erneut senden können.

#### Eingesetzte Hilfsfunktionen

Die Webhook-Route ist in kleine, testbare Hilfsfunktionen aufgeteilt:

- `isValidEventType(...)` prüft, ob der Event-Typ verarbeitet werden soll.
- `isValidStripeEvent(...)` prüft die Grundstruktur des Stripe-Events.
- `isValidWebhookHeaders(...)` liest den Signatur-Header aus.
- `shouldProcessEvent(...)` kombiniert Struktur- und Typprüfung.
- `extractPaymentIntentFromEvent(...)` liest Payment-Intent-Daten aus.
- `extractPaymentMethodFromEvent(...)` liest Payment-Method-Daten aus.

Diese Aufteilung macht die Route besser testbar und reduziert die Logik im HTTP-Handler selbst.

#### Konfiguration

Für den Webhook sind diese Umgebungsvariablen relevant:

- `STRIPE_SECRET_KEY` für den Stripe-Client
- `STRIPE_WEBHOOK_SECRET` für die Signaturprüfung des Webhooks

#### Aktueller Status

Der Stripe-Webhook ist implementiert und testabgedeckt. Die im Projekt erwähnten Loyalty-Webhooks für externe Shops, zum Beispiel `points.earned`, `points.redeemed` oder `customer.profile.created`, sind als Integrationsidee beschrieben, aber in der gezeigten Route noch nicht als eigener Auslieferungsmechanismus umgesetzt.

#### Wann man Webhooks hier einsetzt

Webhooks sind im Projekt sinnvoll, wenn ein externer Dienst nur über ein Ereignis informiert werden soll, nachdem ein Hintergrundprozess oder ein Zahlungsdienst etwas abgeschlossen hat. Der eigentliche API-Call bleibt dabei synchron, während der Webhook die spätere Benachrichtigung übernimmt.

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

