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

## 5. Analytics abrufen (2 Minuten)

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

## 6. Ratio aktualisieren (1 Minute)

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
