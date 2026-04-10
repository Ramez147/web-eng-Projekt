# Enterprise Integration Guide

Diese Anleitung beschreibt, wie ein Unternehmen eure Loyalty Engine in ein eigenes Shop- oder App-Backend integriert.

## Zielbild

Ein Unternehmen nutzt eure API als externe Punkte-Engine:

- Beim Kauf: Punkte vergeben (`earn`)
- Beim Reward-Claim: Punkte einloesen (`redeem`)
- Fuer Reporting: Analytics abrufen (`overview`)

## Voraussetzungen

- Eure Plattform laeuft erreichbar unter einer Basis-URL (z. B. `https://api.example.com`)
- Das Unternehmen hat:
  - `organizationId`
  - `apiKey`
- API-Key wird nur serverseitig gespeichert (Secrets Manager, nicht im Browser)

## 1) Tenant Onboarding

### Request

`POST /api/v1/organizations/register`

```json
{
  "name": "ACME GmbH",
  "pointsRatio": 10
}
```

### Response (Beispiel)

```json
{
  "organization": {
    "id": "1a2b3c4d-0000-1111-2222-abcdefabcdef",
    "name": "ACME GmbH",
    "pointsRatio": 10,
    "createdAt": "2026-04-10T12:00:00.000Z"
  },
  "apiKey": "lp_live_xxx"
}
```

### Wichtig

- `apiKey` nur einmal sichtbar: direkt sicher speichern
- Ohne `x-api-key` funktionieren Folgerequests nicht

## 2) Checkout-Integration (Punkte vergeben)

Wenn ein Kauf erfolgreich abgeschlossen wurde, ruft das Unternehmens-Backend auf:

`POST /api/v1/points/earn`

Header:

- `x-api-key: <apiKey>`
- `Content-Type: application/json`

Body:

```json
{
  "organizationId": "1a2b3c4d-0000-1111-2222-abcdefabcdef",
  "externalCustomerId": "customer-123",
  "amountEur": 59.9,
  "metadata": {
    "orderId": "order-1001",
    "channel": "web"
  }
}
```

Verhalten:

- Punkte werden ueber Ratio berechnet
- Kundenprofil wird automatisch erstellt, falls neu
- Transaktion wird historisiert

## 3) Reward-Claim (Punkte einloesen)

Vor Freischaltung eines Rewards ruft das Unternehmens-Backend auf:

`POST /api/v1/points/redeem`

Header:

- `x-api-key: <apiKey>`
- `Content-Type: application/json`

Body:

```json
{
  "organizationId": "1a2b3c4d-0000-1111-2222-abcdefabcdef",
  "externalCustomerId": "customer-123",
  "points": 200,
  "metadata": {
    "rewardCode": "WELCOME-REWARD"
  }
}
```

Verhalten:

- Erfolg: Punkte werden abgezogen, Reward darf freigeschaltet werden
- Nicht genug Punkte: HTTP `409`, Reward darf nicht freigeschaltet werden

## 4) Analytics fuer interne UIs

`GET /api/v1/analytics/overview?organizationId=<id>`

Header:

- `x-api-key: <apiKey>`

Liefert:

- Anzahl Kundenprofile
- Gesamtumsatz
- Punkte-Historie pro Tag (`earn` / `redeem`)
- Letzte Transaktionen

## 5) Ratio-Management

`PATCH /api/v1/organizations/{organizationId}/ratio`

Header:

- `x-api-key: <apiKey>`
- `Content-Type: application/json`

Body:

```json
{
  "pointsRatio": 12
}
```

Hinweis:

- Neue Ratio gilt fuer zukuenftige Earn-Transaktionen
- Historische Transaktionen bleiben unveraendert

## 6) Fehlerbehandlung (Empfehlung)

- `400`: Eingaben validieren und dem Operator anzeigen
- `409` bei Redeem: User-freundliche Meldung "Nicht genug Punkte"
- `5xx` oder Netzwerkfehler: Retry mit Backoff + Dead-letter/Queue je nach Kritikalitaet

## 7) Idempotenz und Duplikate

Empfehlung fuer produktiven Betrieb:

- In `metadata` immer eine externe ID mitschicken (`orderId`, `rewardRedemptionId`)
- Im Unternehmens-Backend pro Event nur einmal senden
- Bei Retries Duplikatpruefung im Quellsystem aktivieren

## 8) Sicherheitscheckliste

- API-Key nie im Frontend ausliefern
- API-Key rotieren bei Verdacht auf Leak
- Logging ohne Klartext-API-Key
- Zugriff auf Secrets nur fuer Backend-Services

## 9) Referenzen

- OpenAPI: `docs/openapi.yaml`
- Postman: `collections/loyalty-engine.postman_collection.json`
- Insomnia: `collections/loyalty-engine.insomnia.json`
