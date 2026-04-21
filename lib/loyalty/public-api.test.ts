import * as api from "./public-api";

describe("public-api module", () => {
  it("should export collectRequestSchema", () => {
    expect(api.collectRequestSchema).toBeDefined();
  });
  it("should export redeemRequestSchema", () => {
    expect(api.redeemRequestSchema).toBeDefined();
  });
  it("should export getOrganizationIdFromApiKey", () => {
    expect(typeof api.getOrganizationIdFromApiKey).toBe("function");
  });
  it("should export getPublicApiErrorStatus", () => {
    expect(typeof api.getPublicApiErrorStatus).toBe("function");
  });
  it("should export createPublicApiErrorResponse", () => {
    expect(typeof api.createPublicApiErrorResponse).toBe("function");
  });
  // Tambahkan test lebih detail sesuai logic public-api.ts Anda
});
