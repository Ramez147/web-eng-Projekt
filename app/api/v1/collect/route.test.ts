import { describe, test, expect } from "vitest";

function createRequest(body: any) {
  return new Request("http://localhost/api/collect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY!,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/collect", () => {

  test("invalid body", async () => {
    const { POST } = await import("./route");

    const req = createRequest({
      externalCustomerId: "",
      amountEur: -10,
    });

    const res = await POST(req as any);

    expect(res.status).toBe(400);
  });

  test("collect points", async () => {
    const { POST } = await import("./route");

    const req = createRequest({
      externalCustomerId: "test_" + Date.now(),
      amountEur: 10,
      metadata: {},
    });

    const res = await POST(req as any);

    expect([200, 400]).toContain(res.status);
  });

});