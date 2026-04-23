import { describe, test, expect } from "vitest";
import { getAdminSupabaseClient } from "../../../lib/loyalty/db";

function createRequest(body: any) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "user-agent": "vitest",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact (Integration Test)", () => {

  test("should return 400 if fields missing", async () => {
    const { POST } = await import("./route");

    const req = createRequest({
      name: "",
      email: "",
      message: "",
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  test("should handle invalid JSON", async () => {
    const { POST } = await import("./route");

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "invalid json",
    });

    const res = await POST(req);

    expect(res.status).toBe(500);
  });

});