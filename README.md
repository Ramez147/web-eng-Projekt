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
```

2. SQL-Migration in Supabase ausfuhren:

- Datei: `supabase/migrations/20260410_loyalty_engine.sql`
- Datei: `supabase/migrations/20260410_memberships.sql`

3. Dev-Server starten:

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

- `x-api-key: lp_live_...`

Request:

```json
{
	"pointsRatio": 12
}
```

### `POST /api/v1/points/earn`

Rechnet EUR in Punkte um und schreibt sie dem Profil gut.

Header:

- `x-api-key: lp_live_...`

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

- `x-api-key: lp_live_...`

### `POST /api/v1/collect`

Alternative API-first Route fuer Punkteeingang. Die Organization wird aus dem `x-api-key` ermittelt.

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

- `x-api-key: lp_live_...`

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

