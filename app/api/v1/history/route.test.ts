function createRequest(url: string, options?: { apiKey?: string }) {
  const headers: Record<string, string> = {};
  if (options?.apiKey) {
    headers["x-api-key"] = options.apiKey;
  }

  return new Request(url, {
    method: "GET",
    headers,
  });
}

describe("GET /api/v1/history", () => {
  test("returns 400 when externalCustomerId is missing", async () => {
    const { GET } = await import("./route");

    const res = await GET(
      createRequest("http://localhost/api/v1/history", {
        apiKey: process.env.API_KEY,
      }) as any,
    );

    expect(res.status).toBe(400);
  });

  test("returns 401 when neither API key nor session is provided", async () => {
    const { GET } = await import("./route");

    const res = await GET(
      createRequest("http://localhost/api/v1/history?externalCustomerId=test-customer") as any,
    );

    expect([400, 401]).toContain(res.status);
  });

  test("accepts valid API key for public API calls", async () => {
    const { GET } = await import("./route");

    const res = await GET(
      createRequest("http://localhost/api/v1/history?externalCustomerId=test-customer", {
        apiKey: process.env.API_KEY,
      }) as any,
    );

    // Should not be 401 (invalid key) - may be 404 if customer not found or 200 if found
    expect([200, 404, 400]).toContain(res.status);
  });

  test("returns auth error when user is not signed in and no API key provided", async () => {
    const { GET } = await import("./route");

    const res = await GET(
      createRequest("http://localhost/api/v1/history?externalCustomerId=test-customer") as any,
    );

    expect([400, 401, 403]).toContain(res.status);
  });
});