# Quickstart in 10 Minuten

Diese Seite ist fuer Integrations-Teams gedacht, die eure Loyalty API sofort testen wollen.

## 1. Voraussetzungen (1 Minute)

- Basis-URL bekannt, z. B. `http://localhost:3000`
- Header `x-api-key` wird bei geschuetzten Endpunkten gesetzt
- API-Tool: curl/Postman/Insomnia

## 2. Organisation erstellen (2 Minuten)

`POST /api/v1/organizations/register`

```bash
curl -X POST "http://localhost:3000/api/v1/organizations/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"ACME GmbH\",\"pointsRatio\":10}"
```

Werte aus der Antwort speichern:
# Quickstart in 10 Minuten

Diese Seite ist fuer Integrations-Teams gedacht, die eure Loyalty API sofort testen wollen.

## 1. Voraussetzungen (1 Minute)

- Basis-URL bekannt, z. B. `http://localhost:3000`
- Header `x-api-key` wird bei geschuetzten Endpunkten gesetzt
- API-Tool: curl/Postman/Insomnia

## 2. Organisation erstellen (2 Minuten)

`POST /api/v1/organizations/register`

```bash
curl -X POST "http://localhost:3000/api/v1/organizations/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"ACME GmbH\",\"pointsRatio\":10}"
```

Werte aus der Antwort speichern:

- `organization.id` -> `ORG_ID`
- `apiKey` -> `API_KEY`

## 3. Punkte sammeln (2 Minuten)

`POST /api/v1/collect`

```bash
curl -X POST "http://localhost:3000/api/v1/collect" \
  -H "Content-Type: application/json" \
  -H "x-api-key: API_KEY" \
  -d "{\"externalCustomerId\":\"customer-123\",\"amountEur\":59.9,\"metadata\":{\"orderId\":\"order-1001\"}}"
```

Erwartung:

- Profil wird automatisch erstellt (falls neu)
- `pointsCollected` und `newPointsBalance` kommen zurueck

## 4. Punkte einloesen (2 Minuten)

`POST /api/v1/points/redeem`

```bash
curl -X POST "http://localhost:3000/api/v1/points/redeem" \
  -H "Content-Type: application/json" \
  -H "x-api-key: API_KEY" \
  -d "{\"organizationId\":\"ORG_ID\",\"externalCustomerId\":\"customer-123\",\"points\":100,\"metadata\":{\"rewardCode\":\"WELCOME-REWARD\"}}"
```

Erwartung:

- Erfolg: `status = applied`
- Nicht genug Punkte: HTTP 409 mit Hinweis

## 5. Transaktionshistorie abrufen (2 Minuten)

`GET /api/v1/history?externalCustomerId={customerId}`

Der Endpoint unterstützt **zwei Authentifizierungsmethoden**:

### Option A: Public API (API-Key)

```bash
curl -X GET "http://localhost:3000/api/v1/history?externalCustomerId=customer-123" \
  -H "x-api-key: API_KEY"
```

### Option B: Dashboard (Session-Cookie)

Wenn du im Dashboard angemeldet bist, wird das Session-Cookie automatisch gesendet:

```bash
# Im Browser öffnen (Cookie wird automatisch mitgesendet)
http://localhost:3000/api/v1/history?externalCustomerId=customer-123
```

**Erwartung:**

```json
{
  "organizationId": "uuid-hier",
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
    },
    {
      "id": "tx-uuid-2",
      "type": "redeem",
      "points": 100,
      "eurAmount": 0,
      "createdAt": "2026-04-27T12:15:00Z",
      "metadata": {"rewardCode": "WELCOME-REWARD"}
    }
  ]
}
```

## 6. Webhooks einrichten (2 Minuten)

Wenn externe Shops oder Backend-Systeme über Loyalty-Ereignisse informiert werden sollen, richte zusätzlich einen Webhook-Receiver ein. Das ist besonders wichtig für Ereignisse wie Punktegutschrift, Punkteeinlösung oder die erste Profilerstellung.

Typische Events:

- `points.earned`
- `points.redeemed`
- `customer.profile.created`

Empfehlung:

- Webhook-Endpoint im Shop-Backend bereitstellen
- Signatur oder Secret prüfen
- Event-Verarbeitung idempotent umsetzen
- Schnell mit `2xx` antworten

## 7. Analytics abrufen (2 Minuten)

`GET /api/v1/analytics/overview?organizationId=ORG_ID`

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/overview?organizationId=ORG_ID" \
  -H "x-api-key: API_KEY"
```

Erwartung:

- `customersCount`
- `totalRevenueEur`
- `pointsHistoryByDay`
- `history`

## 8. Ratio aktualisieren (1 Minute)

`PATCH /api/v1/organizations/{organizationId}/ratio`

```bash
curl -X PATCH "http://localhost:3000/api/v1/organizations/ORG_ID/ratio" \
  -H "Content-Type: application/json" \
  -H "x-api-key: API_KEY" \
  -d "{\"pointsRatio\":12}"
```

## Typische Fehler

- `400`: Request-Body ungueltig
- `409`: Redeem nicht moeglich, zu wenig Punkte
- `Invalid API key`: `x-api-key` falsch oder falsche `organizationId`

## Naechster Schritt

Wenn das klappt, integriere die Calls ins Unternehmens-Backend:

- Nach erfolgreichem Checkout -> `collect`
- Vor Reward-Freischaltung -> `redeem`
- Fuer interne Reports -> `analytics/overview`
